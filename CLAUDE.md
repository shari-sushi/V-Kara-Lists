# V-Kara-Lists - Claude エージェント設定

## セキュリティ禁止事項（最優先）

### フックで自動ブロックされる操作

- `rm -rf` などの破壊的な削除
- `.env` ファイルの `cat` による内容表示
- `DROP TABLE / DROP DATABASE` の実行（`mysql -e` 経由も含む）
- `PASSWORD` / `SECRET` / `KEY` / `TOKEN` を含む環境変数の `export`

### ガイドライン（自動ブロックなし・Claude が従うこと）

- `.env` ファイルや環境変数の**値**を出力・ログ・コミットしない
- パスワード・APIキー・秘密鍵を含むコードをコミットしない
- 本番DB（RDS）への直接DDL実行は事前にバックアップを取ること
- Bash 経由の `.env` アクセス（`vim`・`grep` 等）はフックで完全にはブロックできない。Claude 自身がガイドラインに従うこと

## 常時ロードするルール

以下のルールファイルは常に参照すること:

- `.claude/rules/overview.md` - プロジェクト概要・アーキテクチャ
- `.claude/rules/coding-standards.md` - コーディング規約
- `.claude/rules/setup.md` - 開発環境セットアップ
- `.claude/rules/deployment.md` - デプロイ手順
- `.claude/rules/troubleshooting.md` - よくある問題と解決策
- `.claude/rules/feedback.md` - フィードバックシステムの運用ルール
- `.claude/feedback/lessons.md` - 過去のミスから蒸留した教訓

Public Repositoryなのでセキュリティリスクとなる機密情報のハードコード等はコミットしないこと

## フィードバック（学習ループ）

レビュー指摘やミスは `.claude/feedback/log.md` に記録し、蓄積したパターンを `.claude/feedback/lessons.md` に蒸留する。詳細は `.claude/rules/feedback.md` を参照。

- `/self-review` : 差分を3段階でセルフレビューし、先回りPRまで仕上げるコマンド
- `/review-retro` : 受けたレビュー指摘の原因を掘り、log/lessons に反映するコマンド
- `/wait-new-pr` : 指定 issue の PR 出現を待ってレビューを開始するコマンド

## コンテキスト別ルール

作業内容に応じて以下のルールを追加で参照すること:

| ルールファイル | 適用タイミング |
| --- | --- |
| `.claude/rules/frontend.md` | `t0016Next/**` 配下のファイルを編集する場合 |
| `.claude/rules/backend.md` | `t0016Go/**` 配下のファイルを編集する場合 |
| `.claude/rules/database.md` | `db/**` やマイグレーション、スキーマ変更を行う場合 |
| `.claude/rules/planning.md` | `VIBES/plan/**` 配下のファイルを作成・編集する場合 |

## vibeコーディングの進め方

1. 計画以下のいずれかを行う  
   対応issueに計画を記載  
   `VIBES/plan/` に計画ファイルを作成
2. ユーザーと仕様を合意してから実装を開始する
3. 基本的に最新のdevelopから専用ブランチを切る
4. 実装後は lint / build が通ることを確認する
5. コミット前に型エラーがないことを確認する
6. 1で計画ファイルを作成していたら`./done`に移す  
   githubへのpr, コメントは文末に `🤖 Generated with [Claude Code](https://claude.com/claude-code)`を記載  
   prの1行目は - close #{対応issue番号}

## 自動化タスクの原則

- issue に受け入れ基準（期待挙動・完了条件）が無い場合、実装してはならない。
  実装せず、不足している前提を箇条書きで質問するコメントを残して終了する。
- 仕様・要件・数値を推測で埋めない。分からないことは調べるか質問する。捏造は禁止。
- 破壊的変更（マイグレーション、設定・インフラ変更、削除）は PR 説明に影響範囲を明記し、
  勝手に main / develop へ直接反映しない。
- 既存のコードスタイル・ディレクトリ構成・テスト方針に従う。
