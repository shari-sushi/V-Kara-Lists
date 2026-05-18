#!/bin/bash
# systemdサービスのインストール（EC2セットアップ時に一度だけ実行する）
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

sudo cp "$SCRIPT_DIR/vkara.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable vkara.service

echo "vkara.service installed and enabled."
echo "EC2再起動時に自動でコンテナが起動します。"