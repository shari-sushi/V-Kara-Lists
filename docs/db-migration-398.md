# #398 本番リリースとデータ移行 runbook

旧テーブル（movies / karaokes / favorites）から新テーブル（videos / video_songs / favorite_videos / favorite_video_songs）へデータを移し、新コードの api / app を本番に出す手順。本番の操作はすべて人が手で行う。

## 前提

- 本番は #414 より前の旧コードで動いている。ECR の `latest` にはすでに新コードが入っているので、次にデプロイが成功した時点で新コードが未移行の DB に出る。デプロイの修正とこの移行はセットで行う
- 移行 SQL は差分マージ方式（TRUNCATE しない、何度実行しても同じ結果になる）。新コードが先に出てしまい、新テーブルにデータが入った後でも安全に流せる
- 旧テーブルは移行で変更しない。旧コードは新テーブルを読まないので、新コードのデプロイ前なら旧コンテナを起動し直すだけで元に戻せる

## 使うファイル

| ファイル | 内容 | 本番への変更 |
| --- | --- | --- |
| `scripts/db/sql/398_inspect.sql` | 件数・created_at・移行で対象外になる行の確認 | なし（SELECT のみ） |
| `scripts/db/backup-on-ec2.sh` | mysqldump → S3 `manual/<ラベル>/` | なし（読み取りのみ） |
| `scripts/db/sql/398_create_new_tables.sql` | 新テーブルの作成（AutoMigrate と同じ定義） | テーブル追加 |
| `scripts/db/sql/398_migrate.sql` | 旧 → 新のデータコピー（1トランザクション） | 新テーブルへ INSERT |
| `scripts/db/sql/398_verify.sql` | 移行漏れの検証 | なし（SELECT のみ） |
| `scripts/db/sql/398_rename_old.sql` / `_down.sql` | 旧テーブルの `_old` へのリネームと取り消し | テーブル名変更 |
| `scripts/db/rehearse-local.sh` | ローカルでのリハーサル | ローカルのみ |

EC2 の `~/v-kara` はデプロイで git pull されないため、スクリプトは push 済みのコミットから取得する（`<sha>` はこのファイル群を含むコミット）。

```bash
# EC2 上
mkdir -p ~/398 && cd ~/398
for f in sql/398_inspect.sql sql/398_create_new_tables.sql sql/398_migrate.sql sql/398_verify.sql \
         sql/398_rename_old.sql sql/398_rename_old_down.sql backup-on-ec2.sh; do
  curl -fsSL "https://raw.githubusercontent.com/shari-sushi/V-Kara-Lists/<sha>/scripts/db/$f" -o "$(basename "$f")"
done

# SQL ファイルを本番 DB に流すヘルパー（認証情報はコンテナ内の環境変数を使う）
run_sql() { docker exec -i v_kara_db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot --default-character-set=utf8mb4 --table "$@" "$MYSQL_DATABASE"' sh "$@"; }
```

EC2 へは `aws ssm start-session --target <instance-id> --profile vkara` で入り、`sudo -iu ubuntu` で作業する。

## 手順

### 1. 事前確認（読み取りのみ・いつでも可）

```bash
run_sql --force < 398_inspect.sql
```

- 新テーブルが無ければ「Table doesn't exist」が出るが、想定どおり（`--force` で続行する）
- `migration blockers / skipped rows` の各件数を控える。0 でないものは移行対象外になる。扱いを決めてから進む

### 2. ローカルリハーサル（本番作業の前日まで）

```bash
# EC2 上: リハーサル用のバックアップを取る
source ~/.env.ec2.pre && bash backup-on-ec2.sh pre-398-rehearsal

# 手元: リポジトリの外にダウンロードしてリハーサル
mkdir -p ~/v-kara-backups
aws s3 cp "s3://<bucket>/manual/pre-398-rehearsal/<ファイル名>" ~/v-kara-backups/ --profile vkara
scripts/db/rehearse-local.sh dump ~/v-kara-backups/<ファイル名>
```

`OK: リハーサル成功 (dump)` が出て、件数が手順1と矛盾しないこと。終わったら手元のダンプは削除する。

### 3. メンテナンス開始

```bash
docker stop v-kara-api v-kara-app
```

利用者がいない時間帯に行う。メンテナンス画面は無いので、停止中はサイトがエラーになる。

### 4. バックアップ

```bash
source ~/.env.ec2.pre && bash backup-on-ec2.sh before-398-migration
```

`uploaded:` と `sha256:` を控える。失敗したら先に進まない。

### 5. 新テーブル作成 → 移行 → 検証

```bash
run_sql < 398_create_new_tables.sql
run_sql < 398_migrate.sql
run_sql < 398_verify.sql
```

- `missing_*` と `single_song_videos_without_exactly_one_song` がすべて 0
- `skipped_*` が手順1で控えた件数と一致
- 件数の目安（2026-11-07 時点の公開 API）: movies 76 → videos 76、karaokes 574 → video_songs は 574 から skipped を引いた数

1つでも合わなければ手順「ロールバック A」へ。

### 6. 新コードのデプロイ

どちらかで行う。

#### 方法 1: SSM で手動（deploy.yml に依存しない）

deploy.yml の「Pull and restart containers on EC2」と同じ内容を EC2 上で実行する。

```bash
cd /home/ubuntu/v-kara
curl -fsSL https://raw.githubusercontent.com/shari-sushi/V-Kara-Lists/<develop の sha>/ec2-docker-compose.yml -o ec2-docker-compose.yml
aws s3 cp s3://<app env バケット>/.env app.env
aws s3 cp s3://<api env バケット>/.env api.env
chmod 600 *.env
source ~/.env.ec2.pre   # ECR_REGISTRY / ECR_API_REPO / ECR_APP_REPO
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin "$ECR_REGISTRY"
docker-compose -f ec2-docker-compose.yml pull api app
docker-compose -f ec2-docker-compose.yml up -d --force-recreate api app
docker logout "$ECR_REGISTRY"
rm -f api.env app.env
```

`docker system prune -af` はロールバック用の旧イメージも消すので、確認が済むまで実行しない。

#### 方法 2: manual-deploy.yml（GitHub Actions の workflow_dispatch）

deploy.yml と同じ SSM ステップを使うため、デプロイ失敗の原因が直っていることが前提。

### 7. 確認とメンテナンス終了

```bash
curl -sf http://localhost:8080/health
curl -s http://localhost:8080/v1/vcontents/ | head -c 500   # 新形式のキーが返ること
docker logs v-kara-api 2>&1 | grep -i -E "error|migrat" | tail -20
```

ブラウザで、トップ・Vtuber ページ・お気に入り（ログインして）を確認する。手順6でコンテナが起動した時点で、サイトは再開している。

### 8. 後片付け（1〜2週間後）

新コードで問題が無いことを確認してから実行する。

```bash
bash backup-on-ec2.sh before-398-rename-old
run_sql < 398_rename_old.sql
```

`_old` テーブルの DROP はこの runbook の対象外。DROP は元に戻せないので、さらに期間を置いてから別途判断する。

## ロールバック

| 状況 | 方法 | 失うもの |
| --- | --- | --- |
| A. 手順3〜5で失敗（新コード未デプロイ） | `docker start v-kara-api v-kara-app` で旧コードのまま再開する。新テーブルは残っても旧コードは使わない | なし |
| B. 手順6以降で新コードに問題 | 旧イメージに戻す（下記）。旧テーブルは変更していないので、旧コードはそのまま動く | 新コードで登録されたデータは、旧コードからは見えない（新テーブルに残る） |
| C. DB の内容が壊れた | 手順4のバックアップから復元する（下記） | バックアップ以降のすべての書き込み |
| D. 手順8のリネームを戻す | `run_sql < 398_rename_old_down.sql` | なし |

### B. 旧イメージに戻す

```bash
# 手元: 旧コードのイメージのタグ（コミット sha）を確認する
aws ecr describe-images --repository-name <api リポジトリ> --profile vkara \
  --query 'sort_by(imageDetails,&imagePushedAt)[-5:].[imagePushedAt,imageTags]'

# EC2: 旧タグを pull して latest に付け替えて起動する（app も同様）
docker pull "$ECR_REGISTRY/$ECR_API_REPO:<旧 sha>"
docker tag "$ECR_REGISTRY/$ECR_API_REPO:<旧 sha>" "$ECR_REGISTRY/$ECR_API_REPO:latest"
docker-compose -f ec2-docker-compose.yml up -d --force-recreate api
```

ECR の `latest` は新コードのままなので、次の自動デプロイで再び新コードが出る。直すまで develop への push を止める。

### C. バックアップから復元

```bash
docker stop v-kara-api v-kara-app
aws s3 cp "s3://$S3_DB_BACKUP_BUCKET/manual/before-398-migration/<ファイル名>" /tmp/
gunzip -c /tmp/<ファイル名> | docker exec -i v_kara_db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot --default-character-set=utf8mb4 "$MYSQL_DATABASE"'
rm -f /tmp/<ファイル名>
```

ダンプに含まれるテーブルはダンプ時点の内容に置き換わる。ダンプ後に作った新テーブルは消えずに残るので、旧コードに戻す場合はそのままでよい。新コードでやり直す場合は手順5から再実行する（差分マージなので新テーブルを空にする必要はない）。

## 元に戻せない操作

- `_old` テーブルの DROP（この runbook では行わない）
- ロールバック C の復元（バックアップ以降の書き込みが失われる）
