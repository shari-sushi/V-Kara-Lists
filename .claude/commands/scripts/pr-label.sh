#!/usr/bin/env bash
# claude-reviewed 等のPRラベルを付与/剥奪する薄いラッパー。
# babysit-prs / wait-for-review から呼ばれる想定（ラベル操作のたびに
# gh label list や gh label create をClaude自身が判断するとコンテキスト/トークンを
# 消費するため、判定込みでスクリプト側に閉じ込める）。
#
# Usage:
#   pr-label.sh add    <PR番号> [ラベル名=claude-reviewed]
#   pr-label.sh remove <PR番号> [ラベル名=claude-reviewed]
set -euo pipefail

ACTION="${1:?usage: pr-label.sh <add|remove> <PR番号> [ラベル名]}"
PR="${2:?usage: pr-label.sh <add|remove> <PR番号> [ラベル名]}"
LABEL="${3:-claude-reviewed}"

case "$ACTION" in
  add)
    if ! gh label list --json name --jq '.[].name' | grep -qx "$LABEL"; then
      gh label create "$LABEL" --description "Claudeによる自動レビュー済み" --color "B60205"
    fi
    gh pr edit "$PR" --add-label "$LABEL"
    ;;
  remove)
    gh pr edit "$PR" --remove-label "$LABEL" 2>/dev/null || true
    ;;
  *)
    echo "unknown action: $ACTION (expected add|remove)" >&2
    exit 1
    ;;
esac
