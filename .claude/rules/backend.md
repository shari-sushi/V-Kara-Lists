# バックエンド ルール (Go / Gin / GORM)

## スタック

- **言語**: Go 1.18（update 予定）
- **フレームワーク**: Gin 1.9.1
- **ORM**: GORM 1.25.4 (MySQL ドライバ)
- **認証**: golang-jwt/jwt 3.2.2
- **バリデーション**: go-ozzo/ozzo-validation 3.6.0
- **テスト**: DATA-DOG/go-sqlmock 1.5.1

## ディレクトリ構成と責務

```txt
t0016Go/
├── cmd/main.go       # エントリポイント。Ginルーター初期化・CORS設定
├── domain/           # エンティティ・インターフェース定義（外部依存なし）
│   ├── user.go
│   ├── vtuber_content.go
│   ├── favorite.go
│   └── api/types.go  # APIリクエスト/レスポンス型
├── common/           # 共通ユーティリティ（認証・暗号化・バリデーション等）
├── infra/
│   ├── db.go         # DB接続・GORMオートマイグレーション
│   └── routing.go    # DI組み立て + v1/v2 ルート定義(v2は未実装)
├── repository/       # DBクエリ実装 + インターフェース定義
├── service/          # ビジネスロジック
└── handler/          # HTTPハンドラ（Gin の Context を受け取る）
```

## 3層アーキテクチャ + 依存性分離

```txt
domain/ → repository/ → service/ → handler/ → infra/
```

- `domain/` に Gin・GORM を import しない
- `service/` は DB を直接触らず、`repository/` のインターフェース経由で使う
- `handler/` は service のメソッドを呼び出すのみ（ビジネスロジックを持たない）
- `infra/routing.go` でDIを組み立てる（repository → service → handler の順）
- 新しい機能は既存の層構造に合わせて追加する

## 新しいエンドポイントを追加する手順

1. `domain/` に必要な型を追加する
2. `domain/api/types.go` にリクエスト/レスポンス型を追加する
3. `repository/interface.go` にリポジトリインターフェースを追加する
4. `repository/*_repository.go` にDBクエリを実装する
5. `service/*_service.go` にビジネスロジックを実装する
6. `handler/*_handler.go` にHTTPハンドラを実装する
7. `infra/routing.go` にルートを追加する

## ルーティング規則

```go
// infra/routing.go
v1 := r.Group("/v1")
{
    vcontents := v1.Group("/vcontents")
    {
        vcontents.GET("/", handler.GetTopPage)
        vcontents.POST("/create/karaokes", handler.CreateKaraoke)
    }
}
```

- グループは機能単位（`/users`, `/vcontents`, `/fav`）でまとめる
- v2 は別グループで定義する（`r.Group("/v2")`）

## HTTPハンドラの書き方

```go
func (h *ContentHandler) CreateKaraokes(c *gin.Context) {
    var req api.CreateKaraokeSongsRequest
    if err := c.ShouldBind(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
        return
    }

    if err := h.ContentService.CreateKaraokes(api.CreateKaraokeSongsRequestToKaraokes(req, listenerId)); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create karaokes"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Successfully Registered"})
}
```

- エラーは必ず処理する（`_ = err` 禁止）
- 早期リターンでネストを浅くする
- ステータスコードは適切に使い分ける（400/401/403/404/500）

## GORM の使い方

```go
// 基本クエリ
db.Where("vtuber_id = ?", id).Find(&vtubers)

// 作成
db.Create(&karaoke)

// ソフトデリートではなくハードデリート（コンテンツ系）
db.Delete(&karaoke)

// バッチ作成
db.CreateInBatches(karaokes, 100)
```

- `domain/` の構造体タグ（`gorm:"..."`, `json:"..."`）でテーブル定義を管理する
- マイグレーションは `infra/db.go` の `AutoMigrate` で自動適用される

## 認証

- JWT を Cookie に保存する方式
- `cmd/main.go` のミドルウェアで認証チェックを行う
- ゲストログイン機能あり（`/v1/users/gestlogin`）

## 完了確認

```bash
cd t0016Go
go build ./...      # ビルドが通ること
go test ./...       # 既存テストが壊れていないこと
go vet ./...        # 静的解析が通ること
```
