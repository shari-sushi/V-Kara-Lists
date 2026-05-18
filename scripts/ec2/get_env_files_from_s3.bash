#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VKARA_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# S3バケット名は ~/.env.ec2.pre で設定する（パブリックリポジトリにコミットしない）
if [ -z "$S3_API_ENVFILE_BUCKET" ] || [ -z "$S3_APP_ENVFILE_BUCKET" ]; then
  echo "Error: S3_API_ENVFILE_BUCKET and S3_APP_ENVFILE_BUCKET must be set in ~/.env.ec2.pre"
  exit 1
fi

aws s3 cp "s3://$S3_API_ENVFILE_BUCKET/.env" "$VKARA_DIR/api.env"
aws s3 cp "s3://$S3_APP_ENVFILE_BUCKET/.env" "$VKARA_DIR/app.env"

echo "env files fetched."
