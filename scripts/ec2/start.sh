#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VKARA_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ECR変数を読み込む（~/.env.ec2.pre に設定: ECR_REGISTRY, ECR_API_REPO, ECR_APP_REPO）
if [ -f "$HOME/.env.ec2.pre" ]; then
  # shellcheck source=/dev/null
  source "$HOME/.env.ec2.pre"
fi

# envファイルをS3から取得
bash "$SCRIPT_DIR/get_env_files_from_s3.bash"

# ECRログイン・イメージをpull・ログアウト
# （ECR認証情報をDocker Hub通信に混入させないためにpull後にlogoutする）
# set -e でコケた場合もlogoutを保証する
trap 'docker logout "$ECR_REGISTRY" 2>/dev/null || true' EXIT
aws ecr get-login-password --region ap-northeast-1 \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"
docker pull "$ECR_REGISTRY/$ECR_API_REPO:latest"
docker pull "$ECR_REGISTRY/$ECR_APP_REPO:latest"
docker logout "$ECR_REGISTRY"

# コンテナ起動
cd "$VKARA_DIR"
docker-compose -f ec2-docker-compose.yml up -d

echo "v-kara started."
