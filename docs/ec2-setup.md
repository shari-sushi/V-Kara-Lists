# EC2 セットアップ手順

EC2インスタンスを新規作成・再作成した際の初期セットアップ手順。

## 背景・経緯

2026-05-18、稼働中のEC2インスタンスのCPUが80%に跳ね上がりSSHが応答不能になった。
セキュリティグループのport 22が `0.0.0.0/0` で全開放されていたため、外部からの攻撃を受けた可能性がある。
原因の特定には至らなかったが、インスタンスを終了し新規作成した。

**対応として実施したこと:**

- port 22を自宅IPのみに制限（既にTerraformで管理）
- SSM Session Manager用のIAMポリシー（`AmazonSSMManagedInstanceCore`）をEC2ロールに追加
- `associate_public_ip_address = true` をTerraformに追加（パブリックIP固定）

## Terraform でインスタンスを再作成する手順

```bash
cd infra/terraform

# 1. 既存インスタンスを削除（コンソールで終了 or terraform destroy -target）
# 2. 新規作成
terraform apply
```

`terraform output ec2_public_ip` で新しいIPを確認する。

## EC2 初期セットアップ（手動）

新しいインスタンスにSSH接続後、以下を順に実行する。

### 1. Docker インストール

```bash
# パッケージ更新
sudo apt update && sudo apt upgrade -y

# Docker 公式リポジトリ追加
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker Engine インストール
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# ubuntu ユーザーを docker グループに追加（再ログイン必要）
sudo usermod -aG docker ubuntu
```

### 2. Docker Compose インストール

`docker-compose-plugin` は apt では入らないため、直接ダウンロードする。

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 3. AWS CLI v2 インストール

`apt` には awscli が存在しないため、公式インストーラーを使う。

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install -y unzip
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

インストール後、一度ログアウト・再接続して `aws` コマンドをパスに通す。

### 4. リポジトリのクローン

```bash
# SSH キーのセットアップ（GitHub への読み取り権限が必要な場合）
# または HTTPS で clone
git clone https://github.com/<org>/V-Kara-Lists.git ~/v-kara
cd ~/v-kara
git checkout <ブランチ名>
```

### 5. 環境変数ファイルの取得

EC2のIAMロール（`role_ec2_get_s3`）がS3への `GetObject` 権限を持っているため、認証情報不要で取得できる。

```bash
cd ~/v-kara
bash scripts/ec2/get_env_files_from_s3.bash
# → api.env, app.env が ~/v-kara/ に作成される
```

### 6. ECR 環境変数の設定

ECR_REGISTRY 等はパブリックリポジトリにコミットできないため、`~/.bashrc` で管理する。

```bash
echo 'export ECR_REGISTRY=<AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com' >> ~/.bashrc
echo 'export ECR_API_REPO=<APIリポジトリ名>' >> ~/.bashrc
echo 'export ECR_APP_REPO=<Appリポジトリ名>' >> ~/.bashrc
source ~/.bashrc
```

### 7. ECR ログイン

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
```

### 8. コンテナ起動

**重要: 初回起動時はボリュームが存在しない状態で起動すること。**
既存ボリュームがある場合は `down -v` で削除してから起動しないとMySQL初期化スクリプトが実行されない。

```bash
cd ~/v-kara
# 初回 or ボリュームをリセットしたい場合
docker-compose -f ec2-docker-compose.yml down -v
docker-compose -f ec2-docker-compose.yml up -d
```

### 9. 動作確認

```bash
# コンテナ状態確認
docker-compose -f ec2-docker-compose.yml ps

# API 疎通確認
curl http://localhost:8080/v1/vcontents/

# ログ確認
docker-compose -f ec2-docker-compose.yml logs -f
```

## DBデータの復元

新規EC2セットアップ後、MySQLコンテナは空の状態のため、S3バックアップからデータを復元する。

```bash
# S3からバックアップをダウンロード（S3_DB_BACKUP_BUCKET は ~/.env.ec2.pre で設定）
cd ~
aws s3 ls "s3://$S3_DB_BACKUP_BUCKET/" --recursive  # ファイル名を確認
aws s3 cp "s3://$S3_DB_BACKUP_BUCKET/<ファイル名>.sql.gz" .

# rootユーザーでインポート（-p とパスワードの間にスペースを入れない）
gunzip -c <ファイル名>.sql.gz | docker exec -i v_kara_db mysql -u root -p<MYSQL_ROOT_PASSWORD> <DB_NAME>
```

パスワードは `~/v-kara/db.env` の `MYSQL_ROOT_PASSWORD` を参照。

### 注意: <MYSQL_USER> ユーザーではインポートできない

`<MYSQL_USER>` ユーザーでインポートすると以下のエラーが出る:

```
ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER, SYSTEM_VARIABLES_ADMIN or SESSION_VARIABLES_ADMIN privilege(s)
```

`root` ユーザーで実行すること。

## トラブルシューティング

### MySQL に接続できない（Access denied）

ボリュームが中途半端な状態で残っているため初期化スクリプトが動いていない。

```bash
docker-compose -f ec2-docker-compose.yml down -v
docker-compose -f ec2-docker-compose.yml up -d
```

ログに `[Entrypoint]: Creating database <DB_NAME>` が出ていれば正常に初期化されている。

### `dnf` コマンドが見つからない

このAMI（ami-054400ced365b82a0）は **Ubuntu 24.04** であり、Amazon Linux ではない。
`dnf` ではなく `apt` を使う。Terraform の `user_data` に `dnf` が残っているが Ubuntu では無視される。

### AWS CLI が apt でインストールできない

Ubuntu 24.04 の apt リポジトリに `awscli` パッケージが存在しない。
上記手順の通り、公式の zip インストーラーを使う。

### docker-compose が見つからない

`docker-compose-plugin` は `docker.io` パッケージに含まれない。
上記手順の通り、GitHub Releases から直接ダウンロードする。

## 起動時間の目安

t3a.micro（1vCPU / 1GB RAM）での起動時間:

| フェーズ | 所要時間 |
| --- | --- |
| インスタンス起動〜SSH接続可能 | 1〜2分 |
| docker-compose up 〜 MySQL Healthy | 約30秒 |
| 全コンテナ起動完了 | 約35秒 |
| API が応答し始めるまで | 1〜2分 |

再起動時はDockerコンテナの起動でCPUが5分間70%タッチしたが、正常な動作。
**CPU が落ち着くまで約27分かかった実績あり（2026-05-18計測）。**
SSH接続はCPUが高い間でも可能。

## 自動起動の設定（systemd）

EC2再起動時にコンテナを自動起動するための設定。初回セットアップ時に一度だけ実行する。

### 前提: `~/.env.ec2.pre` をEC2に転送する

ECR変数はパブリックリポジトリにコミットできないため、ローカルに保持してEC2に転送する。

ローカルの `~/.env.ec2.pre`（git管理外）:

```bash
export ECR_REGISTRY=<AWSアカウントID>.dkr.ecr.ap-northeast-1.amazonaws.com
export ECR_API_REPO=<APIリポジトリ名>
export ECR_APP_REPO=<Appリポジトリ名>
export S3_API_ENVFILE_BUCKET=<api.env を格納するS3バケット名>
export S3_APP_ENVFILE_BUCKET=<app.env を格納するS3バケット名>
export S3_DB_BACKUP_BUCKET=<DBバックアップS3バケット名>
```

EC2を作り直すたびにscpで転送する:

```bash
scp -i <キーペア.pem> ~/.env.ec2.pre ubuntu@<EC2_IP>:~/.env.ec2.pre
```

### systemd サービスのインストール

```bash
cd ~/v-kara
bash scripts/ec2/install-service.sh
```

インストール後は EC2 を再起動しても `start.sh` が自動実行され、コンテナが起動する。

### 手動で起動する場合

```bash
bash ~/v-kara/scripts/ec2/start.sh
```

## 今後の自動化（TODO）

- [ ] `user_data` にセットアップスクリプトを組み込む（docker, docker-compose, awscli のインストール）
- [ ] GitHub Actions のデプロイワークフローにスクリプト転送ステップを追加
