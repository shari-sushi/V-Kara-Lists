# バックエンド レイヤードアーキテクチャ リファクタリング

## 背景・目的

現在のバックエンドは「クリーンアーキテクチャ」を謳っているが、実装が不十分:

- `NewController` で具体型を直接生成 → DI が不完全でテストしにくい
- Controller に全 Interactor を持たせる → 不要な依存関係が発生
- ディレクトリ名が一般的なGoの構造と乖離（`useCase`, `interfaces/database`）

**目指すゴール:**

- Go標準的な「handler → service → repository」の3層構造
- インターフェースによる適切な依存性注入
- 各層の責務を明確化し、テストしやすい構造へ

## 変更スコープ

### ディレクトリ構成変更

**変更前:**

```txt
t0016Go/
├── interfaces/
│   ├── v1/controllers/   # HTTPハンドラー
│   └── database/         # DB実装
└── useCase/              # ビジネスロジック (*_interactor.go)
```

**変更後:**

```txt
t0016Go/
├── handler/              # HTTPハンドラー（旧 controllers）
│   ├── content_handler.go
│   ├── user_handler.go
│   ├── favorite_handler.go
│   └── other_handler.go
├── service/              # ビジネスロジック（旧 useCase/*_interactor.go）
│   ├── content_service.go
│   ├── user_service.go
│   ├── favorite_service.go
│   └── other_service.go
└── repository/           # DB操作（旧 interfaces/database）
    ├── interface.go      # インターフェース定義（旧 useCase/repository.go）
    ├── content_repository.go
    ├── user_repository.go
    ├── favorite_repository.go
    └── other_repository.go
```

### 依存注入の流れ

```txt
infra/routing.go（DI組み立て）
  ↓
handler（gin.Context受取・レスポンス返却）
  ↓ service interface経由
service（ビジネスロジック・バリデーション）
  ↓ repository interface経由
repository（GORM呼び出し）
```

## 実装ステップ

### ✅ Step 1: repository層のリファクタリング（完了）

1. `t0016Go/repository/` ディレクトリを作成
2. `useCase/repository.go` を `repository/interface.go` に移動
3. `interfaces/database/*_db.go` を `repository/*_repository.go` にリネーム・移動
4. import path を全て修正

### ✅ Step 2: service層のリファクタリング（完了）

1. `t0016Go/service/` ディレクトリを作成
2. `useCase/*_interactor.go` を `service/*_service.go` にリネーム・移動
3. 構造体名を `*Interactor` → `*Service` に変更
4. import path を修正

### ✅ Step 3: handler層のリファクタリング（完了）

1. `t0016Go/handler/` ディレクトリを作成
2. `interfaces/v1/controllers/*.go` を `handler/*.go` に移動
3. `Controller` 構造体を廃止し、各ハンドラー単位で構造体を作成:
   - `ContentHandler`, `UserHandler`, `FavoriteHandler`, `OtherHandler`
4. 各ハンドラーには必要な service のみを依存させる

### ✅ Step 4: DI構造の改善（完了）

1. `infra/routing.go` でDI組み立てを実施:

   ```go
   func Routing(r *gin.Engine) {
       db := database.NewSqlHandler()

       // Repository層
       contentRepo := repository.NewContentRepository(db)
       userRepo := repository.NewUserRepository(db)
       favoriteRepo := repository.NewFavoriteRepository(db)
       otherRepo := repository.NewOtherRepository(db)

       // Service層
       contentSvc := service.NewContentService(contentRepo)
       userSvc := service.NewUserService(userRepo)
       favoriteSvc := service.NewFavoriteService(favoriteRepo, contentRepo)
       otherSvc := service.NewOtherService(otherRepo)

       // Handler層
       contentHandler := handler.NewContentHandler(contentSvc, favoriteSvc)
       userHandler := handler.NewUserHandler(userSvc)
       favoriteHandler := handler.NewFavoriteHandler(favoriteSvc)
       otherHandler := handler.NewOtherHandler(otherSvc)

       // ルーティング
       v1 := r.Group("/v1")
       {
           vcontents := v1.Group("/vcontents")
           {
               vcontents.GET("/", contentHandler.ReturnTopPageData)
               vcontents.POST("/create/vtuber", contentHandler.CreateVtuber)
               // ...
           }
           // ...
       }
   }
   ```

### ✅ Step 5: 古いディレクトリの削除（完了）

1. `interfaces/v1/controllers/` を削除
2. `interfaces/database/` を削除
3. `useCase/` を削除
4. `interfaces/` ディレクトリが空なら削除

### ✅ Step 6: ルールファイルの更新（完了）

1. `.claude/rules/backend.md` のディレクトリ構成を更新
2. 新しいエンドポイント追加手順を更新

## 完了条件

- [x] `go build ./...` が通る
- [x] `go test ./...` が通る
- [x] `go vet ./...` が通る
- [ ] 既存の全APIエンドポイントが動作する（手動確認）
- [x] 古いディレクトリ（`interfaces/v1/controllers/`, `interfaces/database/`, `useCase/`）が削除されている
- [x] `.claude/rules/backend.md` が更新されている
- 注: `interfaces/v2/` は開発中のプレースホルダーとして残存

## 注意事項

### 破壊的変更

- ディレクトリ構造が大きく変わるため、import path が全て変更される
- git の履歴を残すため、`git mv` を使用する

### 段階的な実装

- 一度に全てを変更すると動作確認が困難
- 1つの層ずつリファクタリングし、その都度ビルド確認を行う

### 既存の機能を壊さない

- リファクタリングは構造変更のみ、ロジックの変更は行わない
- バリデーション・エラーハンドリングは現状維持
- `interfaces/v1/controllers/common/` の共通処理は `handler/common/` に移動

### テストコードへの影響

- 既存のテストコードがあれば import path を修正する必要がある
- 今回はテストコード追加は行わない（別タスク化）

### フロントエンドへの影響

- APIエンドポイントのパスは変更しない
- レスポンス形式も変更しない
- フロントエンド側の修正は不要

## 参考

Goの一般的なレイヤードアーキテクチャ:

- handler: HTTPリクエスト/レスポンス処理
- service: ビジネスロジック・バリデーション
- repository: データ永続化（DB操作）
- domain: エンティティ・ビジネスルール

各層は上位層から下位層への依存のみを持ち、interface を介して疎結合にする。
