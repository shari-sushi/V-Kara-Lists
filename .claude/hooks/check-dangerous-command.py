#!/usr/bin/env python3
"""
PreToolUse Hook: 危険なBashコマンドを実行前にブロックする

heredoc（<<EOF）内のコミットメッセージ等は対象外とし、
実際に実行されるコマンド部分のみを検査する。
"""
import sys
import json
import re

data = json.load(sys.stdin)
cmd = data.get("tool_input", {}).get("command", "")

# heredoc 以降はコミットメッセージ等の文字列リテラルなので除外
if "<<" in cmd:
    cmd = cmd[:cmd.index("<<")]

# ; && || 改行 でコマンドを分割し、各コマンドを個別に検査
parts = re.split(r"[;&|\n]", cmd)

DANGEROUS = [
    (r"^\s*rm\s+-rf\s+[/\*\.]", "破壊的な削除 (rm -rf)"),
    (r"^\s*cat\s+.*\.env", ".env ファイルの内容表示"),
    (r"DROP\s+(TABLE|DATABASE)", "DB破壊操作 (DROP TABLE/DATABASE)"),
    (r"^\s*export\s+\w*(PASSWORD|SECRET|KEY|TOKEN)\w*=", "機密情報の export"),
]

for part in parts:
    for pattern, desc in DANGEROUS:
        if re.search(pattern, part, re.IGNORECASE):
            print(f"⛔ 危険なコマンドをブロックしました: {desc}", file=sys.stderr)
            sys.exit(2)

sys.exit(0)
