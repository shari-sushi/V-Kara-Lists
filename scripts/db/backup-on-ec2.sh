#!/usr/bin/env bash
# 本番 DB（EC2 上の MySQL コンテナ）の手動バックアップを取り、S3 に置く。EC2 上で実行する。
#
# 使い方（EC2 上）:
#   S3_DB_BACKUP_BUCKET=<バケット名> bash backup-on-ec2.sh <ラベル>
#   例: bash backup-on-ec2.sh before-398-migration
#   S3_DB_BACKUP_BUCKET は ~/.env.ec2.pre に設定済みのものを使う（source ~/.env.ec2.pre）
#
# - DB の認証情報はコマンドに書かず、コンテナ内の環境変数（db.env 由来の MYSQL_ROOT_PASSWORD / MYSQL_DATABASE）を使う
# - S3 には manual/<ラベル>/ に置く。自動バックアップ(daily/ など)のライフサイクルの対象外にするため
# - ダンプは EC2 のローカルに残さない（アップロード後に削除する）
# - 復元すると、ダンプに含まれるテーブルはすべてダンプ時点の内容に置き換わる（DROP TABLE IF EXISTS → CREATE → INSERT）
set -euo pipefail

label="${1:?ラベルを指定する（例: before-398-migration）}"
bucket="${S3_DB_BACKUP_BUCKET:?S3_DB_BACKUP_BUCKET を設定する（source ~/.env.ec2.pre）}"
container="${DB_CONTAINER:-v_kara_db}"

case "$label" in
  *[!a-zA-Z0-9._-]*) echo "ラベルは英数字と . _ - のみ" >&2; exit 1 ;;
esac

docker exec "$container" sh -c 'test -n "$MYSQL_ROOT_PASSWORD" && test -n "$MYSQL_DATABASE"' || {
  echo "コンテナ $container に MYSQL_ROOT_PASSWORD / MYSQL_DATABASE が無い" >&2
  exit 1
}

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
work_dir="$(mktemp -d)"
dump_file="$work_dir/vkara-$label-$timestamp.sql.gz"
trap 'rm -f "$dump_file"; rmdir "$work_dir" 2>/dev/null || true' EXIT

# --single-transaction: InnoDB を止めずに一貫したスナップショットを取る
docker exec "$container" sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -uroot \
  --single-transaction --no-tablespaces --set-gtid-purged=OFF \
  --default-character-set=utf8mb4 "$MYSQL_DATABASE"' | gzip >"$dump_file"

gzip -t "$dump_file"
# mysqldump が最後まで書き切ったことを確認する（途中で失敗すると末尾のこの行が無い）
gunzip -c "$dump_file" | tail -n 1 | grep -q -- '-- Dump completed' || {
  echo "ダンプが途中で終わっている" >&2
  exit 1
}

echo "テーブルごとの INSERT 文の数:"
gunzip -c "$dump_file" | grep -o '^INSERT INTO `[a-z_]*`' | sort | uniq -c

s3_key="manual/$label/$(basename "$dump_file")"
aws s3 cp "$dump_file" "s3://$bucket/$s3_key" --only-show-errors
echo "sha256: $(sha256sum "$dump_file" | cut -d' ' -f1)"
echo "uploaded: s3://<bucket>/$s3_key"
