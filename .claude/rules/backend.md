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
├── cmd/main.go           # エントリポイント。Ginルーター初期化・CORS設定
├── domain/               # エンティティ・インターフェース定義（外部依存なし）
│   ├── user.go
│   ├── vtuber_content.go
│   ├── favorite.go
│   └── api/types.go      # APIリクエスト/レスポンス型
├── infra/
│   ├── db.go             # DB接続・GORMオートマイグレーション
│   └── routing.go        # v1/v2 ルート定義(v2は未実装)
├── interfaces/
│   ├── v1/controllers/   # HTTPハンドラ（Gin の Context を受け取る）
│   └── database/         # DBクエリ実装
└── useCase/              # ビジネスロジック
```

## 3層アーキテクチャ + 依存性分離 (レイヤードアーキテクチャもどき)

```txt
domain/ → useCase/ → interfaces/ → infra/
```

- `domain/` に Gin・GORM を import しない
- `useCase/` は DB を直接触らず、`interfaces/database/` のインターフェース経由で使う
- 新しい機能は既存の層構造に合わせて追加する

## 新しいエンドポイントを追加する手順

1. `domain/` に必要な型・インターフェースを追加する
2. `domain/api/types.go` にリクエスト/レスポンス型を追加する
3. `interfaces/database/` にDBクエリを実装する
4. `useCase/` にビジネスロジックを実装する
5. `interfaces/v1/controllers/` にHTTPハンドラを実装する
6. `infra/routing.go` にルートを追加する

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
func (h *VtuberContentController) CreateKaraoke(c *gin.Context) {
    var req domain.CreateKaraokeRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result, err := h.useCase.CreateKaraoke(req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, result)
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
