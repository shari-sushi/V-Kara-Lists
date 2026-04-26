# プロジェクト概要

## V-Kara-Lists とは

VTuber（バーチャルYouTuber）のカラオケ配信を管理・共有するWebアプリケーション。ユーザーはVTuber情報・配信動画・歌った曲（カラオケ）を登録・閲覧できる。

サービスURL: https://v-karaoke.com

## アーキテクチャ

```txt
[ブラウザ]
    ↓ HTTPS
[AWS EC2]
  ├── docker-compose
  │     ├── app: Next.js (port 80)  ← t0016Next/
  │     └── api: Go/Gin (port 8080) ← t0016Go/
  └── [AWS RDS] MySQL 8.0.32
```

## ディレクトリ構成

```txt
V-Kara-Lists/
├── t0016Next/myapp/      # Next.js フロントエンド
│   └── src/
│       ├── pages/        # ページコンポーネント
│       ├── components/   # 共通コンポーネント
│       ├── types/        # TypeScript 型定義
│       ├── api/          # APIクライアント
│       ├── features/     # 機能別コード
│       ├── hooks/        # カスタムフック
│       ├── styles/       # スタイル
│       └── util/         # ユーティリティ
├── t0016Go/              # Go バックエンド
│   ├── cmd/              # エントリポイント
│   ├── domain/           # エンティティ定義
│   ├── infra/            # DB接続・ルーティング（DI組み立てもここ）
│   ├── repository/       # DBクエリ実装・インターフェース定義
│   ├── service/          # ビジネスロジック
│   └── interfaces/       # HTTPハンドラ（handler/ へ移行中）
├── db/                   # MySQL初期化SQL
├── docker-compose.yml    # ローカル開発用
├── ec2-docker-compose.yml # EC2本番用
├── Makefile              # 開発コマンド集
├── VIBES/plan/           # 実装計画ドキュメント
└── CLAUDE.md             # Claude 設定
```

## 主なデータモデル

- **Listener** (ユーザー): メール・パスワード認証、ゲストログインあり
- **Vtuber**: VTuber情報（名前・読み仮名・紹介動画URL）
- **Movie**: 配信動画（YouTubeURL・タイトル・所属VTuber）
- **Karaoke**: 歌った曲（動画URL・歌い始め時間・曲名）
- **OriginalSong**: オリジナル楽曲
- **Favorite**: お気に入り（Movie/Karaoke）
- **Follow**: フォロー（Listener → Vtuber）

## API バージョン

- `v1`: 現在稼働中のAPI（`t0016Go/infra/routing.go`）
- `v2`: 開発中（未実装）

## ブランチ戦略

- `develop`: メインブランチ（PRのマージ先）
- feature ブランチ: `develop` から切って作業、PR で `develop` へマージ

## PR ルール

- PR 本文の先頭に `- close #xx` を記載する（マージ時にIssueが自動クローズされる）
