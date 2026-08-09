---
description: 自分が出したPRのレビューを30分ごとにポーリングし、レビューが付いたら対応する。merge / closeでループを終了する
argument-hint: "<PR番号>（省略時はカレントブランチのPRを自動検出）"
allowed-tools: Bash, Read, Edit, Grep, Glob, Agent, Skill
---

# レビュー待機 → 対応 → merge/closeまでループ

自分（Claude）が出したPRについて、レビュー（コメント／変更要求／承認）が付くのを
30分間隔でポーリングし、レビューが付いたらその場で対応する。
PRが **merge** または **close** されたら、その時点でループを終了する。

対象PR番号: $ARGUMENTS

## 前提・パラメータ

- **ポーリング間隔**: 30分（1800秒）ごと
- **1サイクルの上限**: 48回（=24時間）。上限に達したら一旦ユーザーに状況を報告し、継続するか確認する。
- `gh` はカレントディレクトリから owner/repo を自動判定する。
- 「同じセッションで」待つのが目的なので、他のスキル（`/wait-new-pr` 等）を呼ばずこのコマンド単体で完結させる。

## 進め方

### 1. 対象PRを確定する

- `$ARGUMENTS` にPR番号があればそれを使う。
- 省略時は `gh pr view --json number --jq .number`（カレントブランチのPR）で自動検出する。
- 見つからなければユーザーにPR番号を尋ねて中断する。

### 2. ベースライン（現在のレビュー/コメント件数）を取得する

```bash
PR=<PR番号>
BASE_REVIEWS=$(gh pr view "$PR" --json reviews --jq '.reviews | length')
BASE_COMMENTS=$(gh pr view "$PR" --json comments --jq '.comments | length')
```

### 3. ポーリングする（バックグラウンド実行）

以下のスクリプトを **`run_in_background: true`** で実行する。
30分ごとに最大48回、PRの状態と新規レビュー/コメントの有無を確認する。

```bash
PR=<PR番号>
BASE_REVIEWS=<2で取得した値>
BASE_COMMENTS=<2で取得した値>
i=0
while true; do
  i=$((i+1))
  STATE=$(gh pr view "$PR" --json state --jq .state)
  if [ "$STATE" = "MERGED" ]; then
    echo "RESULT=MERGED"
    exit 0
  fi
  if [ "$STATE" = "CLOSED" ]; then
    echo "RESULT=CLOSED"
    exit 0
  fi
  REVIEWS=$(gh pr view "$PR" --json reviews --jq '.reviews | length')
  COMMENTS=$(gh pr view "$PR" --json comments --jq '.comments | length')
  if [ "$REVIEWS" -gt "$BASE_REVIEWS" ] || [ "$COMMENTS" -gt "$BASE_COMMENTS" ]; then
    echo "RESULT=REVIEWED"
    echo "REVIEWS=$REVIEWS COMMENTS=$COMMENTS"
    exit 0
  fi
  echo "attempt $i/48: no change yet (state=$STATE reviews=$REVIEWS comments=$COMMENTS)"
  if [ "$i" -ge 48 ]; then
    echo "RESULT=TIMEOUT"
    exit 1
  fi
  sleep 1800
done
```

### 4. 結果に応じて分岐する

#### `RESULT=MERGED`

- マージされたことをユーザーに報告し、**ループを終了する**。
- 対応する計画ファイルが `VIBES/plan/` にあれば `VIBES/done/` へ移動する（`.claude/rules/planning.md` 準拠）。

#### `RESULT=CLOSED`（マージされずclose）

- closeされたことをユーザーに報告し、**ループを終了する**。
- 再オープンや別対応が必要か、ユーザーに確認する。

#### `RESULT=TIMEOUT`

- 24時間レビューが付かなかった旨を報告し、ポーリングを継続するかユーザーに確認する。
- 継続する場合はステップ2からやり直す（ベースラインは変わらない）。

#### `RESULT=REVIEWED`（新規レビュー/コメントを検出）

1. レビュー内容を取得して精査する。

   ```bash
   gh pr view "$PR" --json reviews --jq '.reviews[] | {author: .author.login, state: .state, body: .body}'
   gh api "repos/{owner}/{repo}/pulls/$PR/comments" --jq '.[] | {user: .user.login, path, line, body}'
   ```

2. **承認（APPROVED）のみで、変更要求や具体的な指摘コメントが無い場合**:
   - `gh pr merge "$PR" --squash` でマージする。
   - マージ後は上記「`RESULT=MERGED`」と同じ後処理を行い、**ループを終了する**。

3. **変更要求（CHANGES_REQUESTED）や具体的な指摘コメントがある場合**:
   - 指摘ごとに以下のいずれかで対応する。
     - **すぐ直せるもの**: コードを修正し、コミットしてPRブランチにpushする。
     - **別issueで検討すべきもの**（スコープ外・大きめの改善・要議論など）: その場で `gh issue create` でissueを作成し、
       返信コメントに issue番号を明記する（例: `別issueで対応します → #123`）。
       issue本文の末尾にも `🤖 Generated with [Claude Code](https://claude.com/claude-code)` を付ける。
       ラベル付けは下記「issue作成時のラベル付けルール」に従う。
     - **対応不要と判断したもの**: 理由を返信コメントに明記する。
   - 対応内容をまとめて `gh pr comment "$PR" --body "..."` で返信する。指摘ごとに「対応しました」「issue #N で対応します」「対応不要: 理由」のいずれかを明記する。
     コメント末尾に `🤖 Generated with [Claude Code](https://claude.com/claude-code)` を付ける。
   - 何かしら対応した場合（コード修正／issue化／対応不要の返信いずれでも）は、
     `.claude/commands/scripts/pr-label.sh remove "$PR"` で `claude-reviewed` ラベルを剥がす。
     （`babysit-prs` はこのラベルが付いているPRを再レビュー対象外にするため、
     古いレビュー結果のまま二度と見直されなくなるのを防ぐ。ラベルが元々無ければ何もしない。）
   - 対応が完了したら **ベースライン（BASE_REVIEWS / BASE_COMMENTS）を最新の件数に更新し、ステップ3のポーリングを再度起動する**（merge/closeになるまで繰り返す）。

### issue作成時のラベル付けルール

`gh issue create` で作成するissueには、必ず以下2種類のラベルを付ける（`--label` を複数指定）。

1. **ステータス系（必ず1つ）**: `created` / `need-spec` / `ready` から1つ選ぶ。
   - 新規に切り出しただけで受け入れ基準が固まっていない → `need-spec`
   - 対応方針や受け入れ基準までこの場で明確にできた → `ready`
   - どちらとも言えない・とりあえず起票のみ → `created`
   - `created` ラベルがリポジトリに存在しない場合は `gh label create created --description "起票直後・未整理" --color "ededed" 2>/dev/null || true` で事前に作成する。
   - `need-spec` は既存ラベルなので `needspec` ではなくこの表記を使う。
2. **内容系（該当するものを1つ以上）**: `refactor` / `backend` / `frontend` / `css` / `infla` / `security` / `feature` / `documentation` / `bug` / `enhancement` / `critical` から、内容に合うものを選ぶ（複数可）。
   - 例: Goのバックエンドの軽微な指摘を切り出す場合 → `backend` + ステータス系1つ
   - 例: 緊急度の高いバグを切り出す場合 → `bug` + `critical` + ステータス系1つ

```bash
gh issue create --title "..." --body "..." --label "need-spec" --label "backend"
```

## 注意

- ポーリング中は他作業を続けてよい。スクリプト終了時に再度呼び出されるので、その時点で分岐処理へ進む。
- ネットワーク/認証エラーで `gh` が失敗した場合は、リトライを続けず原因を報告する。
- コードを修正した場合は、コミット・push前に `.claude/rules/coding-standards.md` の完了基準（build/lint/test）を満たしているか確認する。
- 別issue化するかどうかの判断に迷う場合は、マージ後の修正コストで判断する（マージ後でも簡単に直せる／後回しで問題ない → issue化、正しさに関わる／マージ後の修正が難しい → その場で直す）。
</content>
