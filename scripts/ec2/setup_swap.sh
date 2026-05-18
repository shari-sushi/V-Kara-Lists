#!/bin/bash
# t3a.micro (RAM 1GB) のメモリ不足対策として 2GB の swap を作成する
# 既存インスタンスへの適用用スクリプト（新規インスタンスは user_data で自動適用される）
set -e

SWAPFILE=/swapfile
SWAP_SIZE_MB=1536

if swapon --show | grep -q "$SWAPFILE"; then
  echo "Swap already enabled at $SWAPFILE. Skipping."
  exit 0
fi

echo "Creating 1.5GB swap at $SWAPFILE..."
sudo dd if=/dev/zero of="$SWAPFILE" bs=1M count="$SWAP_SIZE_MB"
sudo chmod 600 "$SWAPFILE"
sudo mkswap "$SWAPFILE"
sudo swapon "$SWAPFILE"

if ! grep -q "$SWAPFILE" /etc/fstab; then
  echo "$SWAPFILE none swap sw 0 0" | sudo tee -a /etc/fstab
fi

echo "Swap setup complete."
free -h
