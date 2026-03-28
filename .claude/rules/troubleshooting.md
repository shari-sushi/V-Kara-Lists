# よくある問題と解決策

## フロントエンド (Next.js)

### `Module not found` エラー

- `@/` エイリアスが使われているか確認する
- `tsconfig.json` の `paths` 設定を確認: `"@/*": ["./src/*"]`

### 型エラーが大量に出る

- `npm run build` で全型エラーを確認してから修正する
- `any` 型を使って誤魔化さず、正しい型を定義する

### APIリクエストが失敗する (CORS)

- Go側の CORS 設定（`cmd/main.go`）で許可オリジンを確認する
- ローカル開発は `http://localhost:3005` が許可されているか確認する

### 環境変数が読み込まれない

- `NEXT_PUBLIC_` プレフィックスがないとブラウザ側から読めない※vercelにデプロイした場合に限る
- `.env.local` は `t0016Next/myapp/` に置く

---

## バックエンド (Go)

### DB接続エラー

- Docker の MySQL コンテナが起動しているか確認: `docker ps`
- `t0016Go/.env` の接続情報（HOST, PORT, USER, PASSWORD）を確認する
- RDS 接続の場合、EC2のセキュリティグループで 3306 ポートが開いているか確認する

### `go build` エラー

- import 文に未使用パッケージがある場合は削除する
- `go mod tidy` で依存関係を整理する

### GORM マイグレーションが反映されない

- `infra/db.go` の `AutoMigrate` に新しい構造体が追加されているか確認する
- MySQL の既存テーブルと構造体の型が合っているか確認する（カラム名の命名規則: snake_case）

### JWT 認証エラー

- トークンの有効期限切れでないか確認する
- `AES_KEY` / `AES_IV` が本番・開発で一致しているか確認する

---

## Docker

### コンテナが起動しない

```bash
# ログを確認
docker-compose logs api
docker-compose logs app

# コンテナを完全に再作成
docker-compose down && docker-compose up --build
```

### ポートが既に使われている

```bash
# 使用中のプロセスを確認
lsof -i :8080
lsof -i :3005
```

### EC2 でイメージのビルドが遅い

- EC2 インスタンスタイプを確認する（t2.micro は遅い）
- `--no-cache` オプションを外して再ビルドを試す

## データベース (MySQL)

### MySQLに接続できない

```bash
# Dockerのコンテナ内で確認
make mysql
# または
docker exec -it <db-container-name> mysql -u root -p
```

### マイグレーション後にカラムが増えない

- GORM は既存テーブルへのカラム追加はするが、削除・変更はしない
- カラムの変更が必要な場合は `ALTER TABLE` を手動で実行する

### RDS への接続 (EC2から)

```bash
mysql -h <RDSエンドポイント> -u <ユーザー> -p <データベース名>
```

## GitHub Actions

### CI が失敗する

- ローカルで `go build ./...` と `go test ./...` を実行して確認する
- `.github/workflows/go.yml` のGoバージョンと `go.mod` のバージョンが一致しているか確認する
