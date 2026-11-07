#!/usr/bin/env bash
# #398 データ移行のローカルリハーサル
#
# 使い捨ての MySQL コンテナ（開発用の v_kara_db とは別。ポートは公開しない）を毎回新しく立て、
# データを入れて「新テーブル作成 → 状態確認 → 移行 → 検証 → 再実行で増えないこと → _old リネームと戻し」を流す。
#
# 使い方:
#   scripts/db/rehearse-local.sh fixture                # 架空データ。本番の現状（旧コードのまま、新テーブルなし）を想定
#   scripts/db/rehearse-local.sh fixture-post-deploy    # 架空データ。新コードのデプロイ後に新テーブルへ登録がある状態を想定
#   scripts/db/rehearse-local.sh dump <path.sql.gz>     # 本番バックアップ（scripts/db/backup-on-ec2.sh の出力）を使う
#
# オプション（環境変数）:
#   KEEP_CONTAINER=1  終了後もコンテナを残す（中身を手で確認したいとき）
#
# 本番ダンプは個人情報を含むため、リポジトリの外に置くこと（リポジトリ内のパスは拒否する）。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQL_DIR="$SCRIPT_DIR/sql"
FIXTURE_DIR="$SCRIPT_DIR/rehearsal"
CONTAINER="v_kara_migration_rehearsal"
MYSQL_IMAGE="mysql:8.0.32" # 本番の ec2-docker-compose.yml と合わせる

usage() {
  sed -n '2,15p' "$0"
  exit 1
}

mode="${1:-}"
case "$mode" in
  fixture | fixture-post-deploy) ;;
  dump)
    dump_path="${2:-}"
    [ -f "$dump_path" ] || { echo "ダンプファイルが見つからない: $dump_path" >&2; exit 1; }
    if git -C "$(dirname "$dump_path")" rev-parse --show-toplevel >/dev/null 2>&1; then
      echo "ダンプが git リポジトリの中にある。誤コミット防止のためリポジトリ外（例: ~/v-kara-backups/）に置くこと" >&2
      exit 1
    fi
    ;;
  *) usage ;;
esac

run_mysql() {
  docker exec -i "$CONTAINER" sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot --default-character-set=utf8mb4 "$@" "$MYSQL_DATABASE"' sh "$@"
}

run_sql_file() {
  echo "--- $(basename "$1")"
  run_mysql --table "${@:2}" <"$1"
}

query_value() {
  echo "$1" | run_mysql --batch --skip-column-names
}

table_counts() {
  query_value "SELECT CONCAT_WS(',',
    (SELECT COUNT(*) FROM videos), (SELECT COUNT(*) FROM video_songs),
    (SELECT COUNT(*) FROM favorite_videos), (SELECT COUNT(*) FROM favorite_video_songs))"
}

cleanup() {
  if [ "${KEEP_CONTAINER:-0}" = "1" ]; then
    echo "コンテナ $CONTAINER を残した。削除: docker rm -f $CONTAINER"
  else
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  fi
}

docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
trap cleanup EXIT

echo "=== 使い捨て MySQL を起動"
docker run -d --name "$CONTAINER" --platform linux/amd64 \
  -e MYSQL_ROOT_PASSWORD="$(openssl rand -hex 16)" \
  -e MYSQL_DATABASE=vkara_rehearsal \
  "$MYSQL_IMAGE" --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci >/dev/null
for i in $(seq 1 60); do
  query_value "SELECT 1" >/dev/null 2>&1 && break
  [ "$i" -eq 60 ] && { echo "MySQL が起動しない" >&2; exit 1; }
  sleep 3
done

echo "=== データ投入 ($mode)"
case "$mode" in
  fixture)
    run_sql_file "$FIXTURE_DIR/legacy_schema.sql"
    run_sql_file "$FIXTURE_DIR/fixture_legacy_data.sql"
    ;;
  fixture-post-deploy)
    run_sql_file "$FIXTURE_DIR/legacy_schema.sql"
    run_sql_file "$FIXTURE_DIR/fixture_legacy_data.sql"
    run_sql_file "$SQL_DIR/398_create_new_tables.sql"
    run_sql_file "$FIXTURE_DIR/fixture_post_deploy_data.sql"
    ;;
  dump)
    gunzip -c "$dump_path" | run_mysql
    ;;
esac

echo "=== 新テーブル作成（既にあれば何もしない）"
run_sql_file "$SQL_DIR/398_create_new_tables.sql"

echo "=== 移行前の状態確認"
run_sql_file "$SQL_DIR/398_inspect.sql" --force

echo "=== 移行"
before="$(table_counts)"
run_sql_file "$SQL_DIR/398_migrate.sql"
after_first="$(table_counts)"
echo "件数(videos,video_songs,favorite_videos,favorite_video_songs): 移行前 $before → 移行後 $after_first"

echo "=== 検証"
run_sql_file "$SQL_DIR/398_verify.sql"
failed_checks="$(query_value "$(sed -n '/^SELECT check_name/,/^ORDER BY ord;/p' "$SQL_DIR/398_verify.sql")" |
  awk -F'\t' '($1 ~ /^missing_/ || $1 ~ /^single_song_/) && $2 != 0')"
if [ -n "$failed_checks" ]; then
  echo "NG: 検証に失敗した項目がある" >&2
  echo "$failed_checks" >&2
  exit 1
fi

echo "=== 再実行しても件数が増えないこと"
run_sql_file "$SQL_DIR/398_migrate.sql"
after_second="$(table_counts)"
if [ "$after_first" != "$after_second" ]; then
  echo "NG: 2回目の移行で件数が変わった ($after_first → $after_second)" >&2
  exit 1
fi

expected=""
case "$mode" in
  fixture) expected="3,5,1,1" ;;
  fixture-post-deploy) expected="4,7,2,1" ;;
esac
if [ -n "$expected" ] && [ "$after_first" != "$expected" ]; then
  echo "NG: 架空データの想定件数と違う (想定 $expected / 実際 $after_first)" >&2
  exit 1
fi

echo "=== 旧テーブルの _old リネームと取り消し"
run_sql_file "$SQL_DIR/398_rename_old.sql"
query_value "SELECT GROUP_CONCAT(table_name ORDER BY table_name) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name LIKE '%\_old'"
run_sql_file "$SQL_DIR/398_rename_old_down.sql"

echo "OK: リハーサル成功 ($mode)"
