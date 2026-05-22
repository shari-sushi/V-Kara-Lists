# AWS ALB から Caddy へ移行

## 背景・目的

コスト削減のため AWS ALB を廃止し、EC2 上の Caddy コンテナで代替する。
Cloudflare がすでにプロキシしているため EC2 の IP はクライアントに露出しない。
TLS 証明書は Caddy が Cloudflare DNS-01 チャレンジで Let's Encrypt から自動取得・自動更新する。

## 変更スコープ

### 新規作成

- `Caddyfile` — DNS-01 + リバースプロキシ設定
- `caddy.Dockerfile` — Cloudflare DNS プラグイン入りカスタム Caddy イメージ

### 変更ファイル

- `ec2-docker-compose.yml` — Caddy サービス追加（80/443 ポート）、app の ports 削除
- `infra/terraform/alb.tf` — ALB 全リソース削除
- `infra/terraform/security_group.tf` — ALB SG 削除、EC2 SG を 80/443 直接受け入れに変更
- `.github/workflows/deploy.yml` — Caddy ビルドジョブ追加、Caddyfile デプロイ、ヘルスチェック修正
- `.github/workflows/manual-deploy.yml` — 同上

## 実装ステップ

1. コードの変更 (完了)
2. ECR に `ECR_CADDY_REPO` リポジトリを手動作成
3. GitHub Actions シークレットに以下を追加:
   - `ECR_CADDY_REPO` — Caddy ECR リポジトリ名
   - `S3_CADDY_ENV_BUCKET` — caddy.env を置く S3 バケット名
4. S3 に `caddy.env` を配置:
   ```env
   CF_API_TOKEN=<Cloudflare API トークン（Zone:DNS:Edit 権限）>
   ```
5. Cloudflare SSL/TLS 設定を **Full (strict)** に変更
6. `caddy` サービスの初回デプロイ（manual-deploy.yml から `caddy` 選択）
7. Caddy が証明書取得できることを確認:
   ```bash
   docker logs v-kara-caddy
   ```
8. `https://v-karaoke.com` と `https://backend.v-karaoke.com/health` の疎通確認
9. Terraform apply で ALB を削除:
   ```bash
   cd infra/terraform
   terraform plan
   terraform apply
   ```

## 完了条件

- [ ] `https://v-karaoke.com` が正常表示される
- [ ] `https://backend.v-karaoke.com/health` が 200 を返す
- [ ] `http://v-karaoke.com` が HTTPS にリダイレクトされる
- [ ] Caddy のログに証明書取得成功が記録されている
- [ ] ALB が AWS コンソールから消えている（terraform apply 済み）
- [ ] GitHub Actions deploy ワークフローが成功する

## 注意事項

- Cloudflare API トークンに必要な権限: `Zone:DNS:Edit`（対象ゾーン: `v-karaoke.com`）
- **切り替え順序**: 先に Caddy を起動して証明書取得を確認してから ALB を削除すること（逆順だと一時停止が発生）
- `caddy_data` Docker ボリュームに TLS 証明書が永続化される。EC2 再作成時は再取得が必要
- `acm.tf` の ACM 証明書は `prevent_destroy = true` のため Terraform では削除されない（手動削除可）
