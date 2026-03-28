# 開発環境セットアップ

## 前提条件

- Docker / Docker Compose がインストール済み
- Go 1.18+ ←アプデ予定
- Node.js 18+
- make コマンド

## 初回セットアップ

```bash
# 1. リポジトリルートで実行（.env生成 + npm install + go mod tidy）
make setup

# 2. 各サービスの .env を設定する
#    - t0016Go/.env
#    - t0016Next/myapp/.env.local（または .env.development）
```

## 必要な環境変数

### t0016Go/.env

```env
# DB接続（ローカルはDockerのMySQLを使う）
DB_NAME=<データベース名>
MYSQL_USER=<ユーザー名>
MYSQL_PASSWORD=<パスワード>
MYSQL_ROOT_PASSWORD=<rootパスワード>

# 暗号化
BCRYPT_COST=10 // 1~10 で任意
AES_KEY=<32文字のキー>
AES_IV=<32文字のIV>

# 環境
GO_ENV=development
```

### t0016Next/myapp/.env.local

```env
NEXT_PUBLIC_API_DOMAIN=http://localhost:8080
```

## 日常的な開発コマンド

```bash
# DBのみDockerで起動 + Goバックエンド起動（推奨）
make db-be

# フロントエンド開発サーバー起動（port 3005）
make fe

# Goバックエンドのみ起動
make run

# MySQLに接続して確認
make mysql

# フロントエンドのプロダクションビルド
make fe-build
```

## 推奨開発スタイル

- **DB のみ** Docker で動かす
- **Go API** と **Next.js** はターミナル / IDE から直接起動する
- 全サービスをまとめて Docker Compose で動かすことも可能（`docker-compose.yml`）

## ポート一覧

| サービス       | ポート |
| -------------- | ------ |
| Next.js (dev)  | 3005   |
| Go API         | 8080   |
| MySQL (Docker) | 3306   |

## テスト実行

```bash
# Go テスト
cd t0016Go && go test ./...

# TypeScript 型チェック
cd t0016Next/myapp && npm run build

# Lint
cd t0016Next/myapp && npm run lint
```
