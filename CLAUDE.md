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

Public Repositoryなのでセキュリティリスクとなる機密情報のハードコード等はコミットしないこと

## コンテキスト別ルール

作業内容に応じて以下のルールを追加で参照すること:

| ルールファイル | 適用タイミング |
| --- | --- |
| `.claude/rules/frontend.md` | `t0016Next/**` 配下のファイルを編集する場合 |
| `.claude/rules/backend.md` | `t0016Go/**` 配下のファイルを編集する場合 |
| `.claude/rules/database.md` | `db/**` やマイグレーション、スキーマ変更を行う場合 |
| `.claude/rules/planning.md` | `VIBES/plan/**` 配下のファイルを作成・編集する場合 |

## vibeコーディングの進め方

1. 実装前に `VIBES/plan/` に計画ファイルを作成し、実装後はVIBES/doneに計画ファイルを移動する
2. ユーザーと仕様を合意してから実装を開始する
3. 実装後は lint / build が通ることを確認する
4. コミット前に型エラーがないことを確認する
5. githubへのpr, コメントは文末に `🤖 Generated with [Claude Code](https://claude.com/claude-code)`を記載する
