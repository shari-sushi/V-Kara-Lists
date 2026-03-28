# デプロイ手順

## インフラ構成

```txt
AWS EC2 (ap-northeast-1)
  └── docker-compose (ec2-docker-compose.yml)
        ├── app: Next.js  (port 80)
        └── api: Go/Gin   (port 8080)

AWS RDS
  └── MySQL 8.0.32 (EC2からのみアクセス可)
```

## デプロイフロー

### 1. コードのプッシュ

```bash
git push origin <branch>
# develop ブランチへのPRをマージすると本番反映
```

### 2. EC2へのSSH接続

```bash
ssh -i <キーペア.pem> ec2-user@<EC2のパブリックIP>
```

### 3. EC2上でのデプロイ操作

```bash
cd /path/to/V-Kara-Lists

# 最新コードを取得
git pull origin develop

# Dockerイメージをビルドして再起動
docker-compose -f ec2-docker-compose.yml up --build -d

# ログ確認
docker-compose -f ec2-docker-compose.yml logs -f
```

### 4. ヘルスチェック

```bash
# API の疎通確認
curl http://localhost:8080/v1/vcontents/

# コンテナ状態確認
docker-compose -f ec2-docker-compose.yml ps
```

## EC2 環境変数

EC2上の `ec2-docker-compose.yml` または `.env` ファイルに本番用の環境変数を設定する:

```env
# RDS接続情報
DB_HOST=<RDSエンドポイント>
DB_NAME=<本番DB名>
MYSQL_USER=<本番ユーザー>
MYSQL_PASSWORD=<本番パスワード>

# 本番環境フラグ
GO_ENV=production
```

## RDS について

- ローカル開発では Docker の MySQL を使う（`docker-compose.yml`）
- EC2（本番）では AWS RDS の MySQL 8.0.32 に接続する
- RDS へのアクセスは EC2 のセキュリティグループで制限済み
- スキーマ変更は GORM のオートマイグレーション（`infra/db.go`）が適用する

## 注意事項

- 本番デプロイ時は RDS のバックアップを確認する
- スキーマ変更（フィールド追加・削除）は慎重に行う
- `docker-compose.yml`（ローカル用）と `ec2-docker-compose.yml`（本番用）は別ファイル

## ロールバック手順

```bash
# 前のコミットに戻してデプロイ
git checkout <前のコミットハッシュ>
docker-compose -f ec2-docker-compose.yml up --build -d
```
