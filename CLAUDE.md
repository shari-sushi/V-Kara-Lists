# V-Kara-Lists - Claude エージェント設定

## 常時ロードするルール

以下のルールファイルは常に参照すること:

- `.claude/rules/overview.md` - プロジェクト概要・アーキテクチャ
- `.claude/rules/coding-standards.md` - コーディング規約
- `.claude/rules/setup.md` - 開発環境セットアップ
- `.claude/rules/deployment.md` - デプロイ手順
- `.claude/rules/troubleshooting.md` - よくある問題と解決策

## コンテキスト別ルール

作業内容に応じて以下のルールを追加で参照すること:

| ルールファイル | 適用タイミング |
| --- | --- |
| `.claude/rules/frontend.md` | `t0016Next/**` 配下のファイルを編集する場合 |
| `.claude/rules/backend.md` | `t0016Go/**` 配下のファイルを編集する場合 |
| `.claude/rules/database.md` | `db/**` やマイグレーション、スキーマ変更を行う場合 |
| `.claude/rules/planning.md` | `VIBES/plan/**` 配下のファイルを作成・編集する場合 |

## vibeコーディングの進め方

1. 実装前に `VIBES/plan/` に計画ファイルを作成する
2. ユーザーと仕様を合意してから実装を開始する
3. 実装後は lint / build が通ることを確認する
4. コミット前に型エラーがないことを確認する
