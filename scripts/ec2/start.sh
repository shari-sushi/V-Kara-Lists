#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VKARA_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ECR変数を読み込む（~/.env.ec2.pre に設定: ECR_REGISTRY, ECR_API_REPO, ECR_APP_REPO）
if [ -f "$HOME/.env.ec2" ]; then
  # shellcheck source=/dev/null
  source "$HOME/.env.ec2"
fi

# envファイルをS3から取得
bash "$SCRIPT_DIR/get_env_files_from_s3.bash"

# ECRログイン
aws ecr get-login-password --region ap-northeast-1 \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# コンテナ起動
cd "$VKARA_DIR"
docker-compose -f ec2-docker-compose.yml up -d

echo "v-kara started."