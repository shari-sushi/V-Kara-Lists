# Interactor/Repository の再編成計画

## 背景・目的

### 現状の問題点

1. **Interactorの依存関係が複雑**
   - `VtuberContentInteractor` が `FavoriteRepository` を持つ
   - `FavoriteInteractor` が `VtuberContentRepository` を持つ
   - 相互依存により保守性・テスト容易性が低い

2. **責務が不明確**
   - `FavoriteInteractor` に「お気に入り機能」以外のメソッドが混在
   - 例: `GetVtubersMoviesKaraokesWithFavCnts` はコンテンツ取得の責務
   - 例: `FindEachRecordsCreatedByListenerId` はユーザー投稿履歴の責務

3. **将来の拡張性が低い**
   - OriginalSong, CoveredSong, Live を追加予定
   - 現在の設計では Interactor が爆発的に増える可能性
   - `KaraokeInteractor`, `OriginalSongInteractor`, `LiveInteractor`...?

### 目的

- **DDD の集約(Aggregate)に沿った設計**にリファクタリング
- Vtuber を集約ルートとし、Movie, Karaoke, OriginalSong, CoveredSong, Live を同じ集約内で管理
- 依存関係を一方向にして保守性向上
- 将来の拡張に強い構造にする

## 変更スコープ

### 影響範囲

| 層                             | 変更内容                             |
| ------------------------------ | ------------------------------------ |
| **useCase/**                   | Interactor のリネーム・依存関係整理  |
| **interfaces/database/**       | Repository のリネーム・メソッド移動  |
| **interfaces/v1/controllers/** | Interactor 参照の更新                |
| **infra/routing.go**           | 影響なし (Controller 経由で呼ぶため) |

### 変更するファイル

```txt
t0016Go/
├── useCase/
│   ├── vtuber_content_interactor.go  → content_interactor.go (リネーム)
│   ├── favorite_interactor.go        → activity_interactor.go (リネーム)
│   └── repository.go                 (インターフェース名変更)
├── interfaces/database/
│   ├── vtuber_content_repository.go  → content_repository.go (リネーム)
│   ├── favorite_repository.go        (メソッド整理)
│   └── db_repository.go              (インターフェース実装更新)
└── interfaces/v1/controllers/
    ├── root.go                       (フィールド名変更)
    ├── vtuber_content.go             (Interactor 参照更新)
    └── favorite.go                   (Interactor 参照更新)
```

## 新しい設計

### Interactor の構成

```go
// 1. コンテンツ管理 (集約ルート: Vtuber)
type ContentInteractor struct {
    ContentRepository ContentRepository
}
// 責務:
// - Vtuber, Movie, Karaoke の CRUD
// - 将来: OriginalSong, CoveredSong, Live の CRUD
// - コンテンツの検索・取得・JOIN (お気に入り情報なし)

// 2. ユーザー管理
type UserInteractor struct {
    UserRepository UserRepository
}
// 責務:
// - ユーザーの CRUD
// - 認証・認可

// 3. ユーザーアクティビティ (横断的関心事)
type ActivityInteractor struct {
    FavoriteRepository FavoriteRepository
    ContentRepository  ContentRepository  // 読み取り専用
}
// 責務:
// - お気に入り機能 (CRUD)
// - 「お気に入り + コンテンツ」のJOINクエリ
// - 将来: フォロー機能
```

### 依存関係の方向

```txt
User ←
       ← Activity (お気に入り・フォロー)
Content ←

Activity だけが他のRepositoryを参照 (読み取り専用)
User と Content は完全に独立
```

### ドメインモデルの集約

```txt
Vtuber (集約ルート)
  └─ Movie
      ├─ Karaoke        (現在実装済み)
      ├─ OriginalSong   (将来追加予定)
      ├─ CoveredSong    (将来追加予定)
      └─ Live           (将来追加予定)
```

## 実装ステップ

### Phase 1: Repository のリネーム

#### 1-1. `VtuberContentRepository` → `ContentRepository`

```bash
# ファイル名変更
mv t0016Go/interfaces/database/vtuber_content_repository.go \
   t0016Go/interfaces/database/content_repository.go
```

```go
// interfaces/database/content_repository.go
type ContentRepository struct {
    SqlHandler SqlHandler
}

// メソッド名はそのまま
func (repo *ContentRepository) GetVtubers() ([]domain.Vtuber, error) { ... }
func (repo *ContentRepository) GetMovies() ([]domain.Movie, error) { ... }
func (repo *ContentRepository) GetKaraokes() ([]domain.Karaoke, error) { ... }
// ...既存メソッド全て
```

#### 1-2. インターフェース定義の更新

```go
// useCase/repository.go
type ContentRepository interface {
    // Vtuber
    GetVtubers() ([]domain.Vtuber, error)
    CreateVtuber(domain.Vtuber) error
    // ... 既存の全メソッド

    // 将来追加予定
    // CreateOriginalSong(domain.OriginalSong) error
    // CreateCoveredSong(domain.CoveredSong) error
    // CreateLive(domain.Live) error
}
```

### Phase 2: Interactor のリネームと依存整理

#### 2-1. `VtuberContentInteractor` → `ContentInteractor`

```bash
# ファイル名変更
mv t0016Go/useCase/vtuber_content_interactor.go \
   t0016Go/useCase/content_interactor.go
```

```go
// useCase/content_interactor.go
type ContentInteractor struct {
    ContentRepository ContentRepository
    // 削除: UserRepository, FavoriteRepository, OtherRepository
}

// メソッドはそのまま (内部の VtuberContentRepository → ContentRepository に置換)
func (interactor *ContentInteractor) GetVtubers() ([]domain.Vtuber, error) {
    allVts, err := interactor.ContentRepository.GetVtubers()
    return allVts, err
}
// ...
```

#### 2-2. `FavoriteInteractor` → `ActivityInteractor`

```bash
# ファイル名変更
mv t0016Go/useCase/favorite_interactor.go \
   t0016Go/useCase/activity_interactor.go
```

```go
// useCase/activity_interactor.go
type ActivityInteractor struct {
    FavoriteRepository FavoriteRepository
    ContentRepository  ContentRepository  // 読み取り専用で参照
    // 削除: UserRepository, OtherRepository
}

// メソッド名はそのまま
func (interactor *ActivityInteractor) CreateMovieFavorite(fav domain.Favorite) error {
    fav.KaraokeId = 0
    err := interactor.FavoriteRepository.CreateMovieFavorite(fav)
    return err
}

func (interactor *ActivityInteractor) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
    VtsMosKasWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesKaraokesWithFavCnts()
    return VtsMosKasWitFav, err
}
// ...
```

### Phase 3: Controller の更新

#### 3-1. `root.go` のフィールド名変更

```go
// interfaces/v1/controllers/root.go
type Controller struct {
    UserInteractor     useCase.UserInteractor
    ContentInteractor  useCase.ContentInteractor   // 旧: VtuberContentInteractor
    ActivityInteractor useCase.ActivityInteractor  // 旧: FavoriteInteractor
    OtherInteractor    useCase.OtherInteractor
}

func NewController(sqlHandler database.SqlHandler) *Controller {
    return &Controller{
        ContentInteractor: useCase.ContentInteractor{
            ContentRepository: &database.ContentRepository{
                SqlHandler: sqlHandler,
            },
        },
        UserInteractor: useCase.UserInteractor{
            UserRepository: &database.UserRepository{
                SqlHandler: sqlHandler,
            },
        },
        ActivityInteractor: useCase.ActivityInteractor{
            FavoriteRepository: &database.FavoriteRepository{
                SqlHandler: sqlHandler,
            },
            ContentRepository: &database.ContentRepository{
                SqlHandler: sqlHandler,
            },
        },
        OtherInteractor: useCase.OtherInteractor{
            OtherRepository: &database.OtherRepository{
                SqlHandler: sqlHandler,
            },
        },
    }
}
```

#### 3-2. ハンドラーの参照更新

```go
// interfaces/v1/controllers/vtuber_content.go
func (controller *Controller) GetJoinVtubersMoviesKaraokes(c *gin.Context) {
    // 変更前: controller.FavoriteInteractor.GetVtubersMoviesKaraokesWithFavCnts()
    // 変更後:
    VtsMosKasWithFav, err := controller.ActivityInteractor.GetVtubersMoviesKaraokesWithFavCnts()
    // ...
}

func (controller *Controller) CreateVtuber(c *gin.Context) {
    // 変更前: controller.VtuberContentInteractor.CreateVtuber(vtuber)
    // 変更後:
    if err := controller.ContentInteractor.CreateVtuber(vtuber); err != nil {
        // ...
    }
}
```

```go
// interfaces/v1/controllers/favorite.go
func (controller *Controller) SaveMovieFavorite(c *gin.Context) {
    // 変更前: controller.FavoriteInteractor.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
    // 変更後:
    foundFav := controller.ActivityInteractor.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
    // ...
}
```

### Phase 4: 全体の動作確認

1. ビルドが通ることを確認

   ```bash
   cd t0016Go
   go build ./...
   ```

2. テストが通ることを確認

   ```bash
   go test ./...
   ```

3. 既存機能の動作確認
   - トップページ表示
   - Vtuber/Movie/Karaoke の作成
   - お気に入り追加・削除
   - ユーザーページ表示

## 完了条件

- [x] `VtuberContentRepository` → `ContentRepository` にリネーム完了
- [x] `FavoriteRepository` のメソッドは維持 (JOIN系メソッドはそのまま)
- [x] `VtuberContentInteractor` → `ContentInteractor` にリネーム完了
- [x] `FavoriteInteractor` → `ActivityInteractor` にリネーム完了
- [x] `ContentInteractor` の不要な依存 (FavoriteRepository等) を削除
- [x] `ActivityInteractor` の不要な依存 (UserRepository等) を削除
- [x] Controller の参照を全て更新
- [x] `go build ./...` が通る
- [x] `go test ./...` が通る (既存テストが壊れていない)
- [x] 既存機能が正常動作する

## 注意事項

### 破壊的変更について

- この変更は **内部構造のリファクタリング** であり、API エンドポイントに変更はない
- フロントエンドへの影響は **ゼロ**
- データベーススキーマへの変更も **なし**

### 段階的な実装

- いきなり全ファイルを変更せず、**1つずつコミット**すること
- 各 Phase ごとにビルドが通ることを確認する
- Phase 1 → Phase 2 → Phase 3 の順序を守る

### テストについて

- 既存のテストコードは現時点で少ない
- 今回のリファクタリング後、徐々にテストを追加していく方針
- 最低限 `go build` と手動での動作確認は必須

### 将来の拡張パス

この設計により、将来の拡張は以下のように行う:

```go
// domain/vtuber_content.go に既に定義済み
type OriginalSong struct {
    ID         SongId
    Url        MovieUrl
    Name       string
    ArtistId   int
    ReleasedAt time.Time
    // ...
}

// ContentRepository に追加
func (repo *ContentRepository) CreateOriginalSong(song domain.OriginalSong) error {
    return repo.SqlHandler.Create(&song).Error
}

// ContentInteractor に追加
func (interactor *ContentInteractor) CreateOriginalSong(song domain.OriginalSong) error {
    song = common.NormalizeOriginalSong(song)
    if err := common.ValidateOriginalSong(song); err != nil {
        return err
    }
    return interactor.ContentRepository.CreateOriginalSong(song)
}

// Controller に追加
func (controller *Controller) CreateOriginalSong(c *gin.Context) {
    var song domain.OriginalSong
    if err := c.ShouldBind(&song); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if err := controller.ContentInteractor.CreateOriginalSong(song); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create original song"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Successfully created"})
}
```

**新しい Interactor は不要**。既存の `ContentInteractor` に追加するだけ。

## 関連ドキュメント

- [refactor-controller-root-structure.md](./refactor-controller-root-structure.md) - Controller構造の再検討 (別タスク)
- [.claude/rules/backend.md](../.claude/rules/backend.md) - バックエンド実装ルール
