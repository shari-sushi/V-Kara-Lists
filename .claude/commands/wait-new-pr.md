---
description: 指定した issue 番号の PR が出現するまで6分ごとにポーリングし、見つかったらレビューを開始する
argument-hint: "<issue番号>（例: 171）"
allowed-tools: Bash, Read, Grep, Glob, Agent, Skill
---

# 新規 PR 待機 → レビュー開始

指定した issue 番号に対応する PR が GitHub 上に出現するまで待機し、
出現したら自動でレビューを開始する。

対象 issue 番号: $ARGUMENTS

## 前提・パラメータ

- **ポーリング間隔**: 6分（360秒）ごと
- **最大待機時間**: 1時間（= 最大10回ポーリング）
- 1時間経っても PR が見つからなければ、その旨を報告して終了する。
- `gh` はカレントディレクトリから owner/repo を自動判定する。

## 進め方

### 1. issue 番号を確認する

- `$ARGUMENTS` から issue 番号（数字のみ）を取り出す。
- 番号が指定されていない/数字でない場合は、ユーザーに番号を尋ねて中断する。

### 2. PR をポーリングする（バックグラウンド実行）

以下のスクリプトを **`run_in_background: true`** で実行する。
6分ごとに最大10回、対象 issue に紐づく open な PR を探す。
見つかれば PR 番号を出力して exit 0、1時間タイムアウトで exit 1 する。

```bash
ISSUE=<issue番号>
for i in $(seq 1 10); do
  # 「issue を close する記述（close/closes/fixes/resolves #N）」を本文に持つ PR か、
  # ブランチ名に issue 番号を含む PR を探す。
  PR=$(gh pr list --state open \
        --json number,headRefName,body \
        --jq "[.[] | select(
                 (.body // \"\" | test(\"(?i)(close[sd]?|fix(e[sd])?|resolve[sd]?)\\\\s+#${ISSUE}\\\\b\"))
                 or (.headRefName | test(\"(^|[^0-9])${ISSUE}([^0-9]|$)\"))
               )] | first | .number // empty")
  if [ -n "$PR" ]; then
    echo "FOUND_PR=$PR"
    exit 0
  fi
  echo "attempt $i/10: not found yet"
  [ "$i" -lt 10 ] && sleep 360
done
echo "TIMEOUT: PR not found within 1 hour"
exit 1
```

- 検出ロジックは「本文の close 系記述」または「ブランチ名に issue 番号を含む」の OR。
  このリポジトリの運用（feature ブランチ、PR 本文1行目に `- close #N`）の両方に対応する。
- 誤検出（番号の部分一致など）が疑わしい場合は、見つかった PR を `gh pr view <番号>` で確認し、
  本当に対象 issue のものか目視で裏取りしてから次へ進む。

### 3. 結果に応じて分岐する

- **`FOUND_PR=<番号>` が出力された**: その PR 番号でレビューを開始する（次のステップ）。
- **`TIMEOUT` で終了した**: 「1時間以内に issue #<番号> の PR は見つからなかった」と報告して終了する。

### 4. 比較相手（ベース）を最新化してからレビューを開始する

PR が見つかったら、**まず差分の比較相手を最新にする**。レビューの差分は
PR のベースブランチ（このリポジトリでは `develop`）との比較で見るため、
ローカルのベースが古いと存在しない差分を指摘したり、既に取り込み済みの変更を
未取り込みと誤認したりする。

```bash
git fetch origin develop main
```

- 比較相手は PR のベースブランチ（`gh pr view <PR番号> --json baseRefName --jq .baseRefName`）に合わせる。
- ローカルにチェックアウトして差分を見る場合も、ベースは `origin/<baseRefName>` の最新を指すこと。

最新化したうえで、`/review` を PR 番号付きで起動してレビューを行う。

- 例: `Skill(review, "<PR番号>")`

## 注意

- ポーリング中は他作業を続けてよい。スクリプト終了時に再度呼び出されるので、その時点でレビューへ進む。
- ネットワーク/認証エラーで `gh` が失敗した場合は、リトライを続けず原因を報告する。
