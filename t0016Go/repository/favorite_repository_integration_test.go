package repository

import (
	"os"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// testSqlHandler は実DB接続用の SqlHandler 実装。
// infra.SqlHandler を使うと import cycle (infra -> repository) になるため repository 側に用意する。
type testSqlHandler struct {
	Conn *gorm.DB
}

func (h *testSqlHandler) Count(column *int64) *gorm.DB      { return h.Conn.Count(column) }
func (h *testSqlHandler) Create(value interface{}) *gorm.DB { return h.Conn.Create(value) }
func (h *testSqlHandler) Delete(value interface{}, conds ...interface{}) *gorm.DB {
	return h.Conn.Delete(value, conds...)
}
func (h *testSqlHandler) Find(value interface{}, conds ...interface{}) *gorm.DB {
	return h.Conn.Find(value, conds...)
}
func (h *testSqlHandler) First(value interface{}, conds ...interface{}) *gorm.DB {
	return h.Conn.First(value, conds...)
}
func (h *testSqlHandler) Group(column string) *gorm.DB { return h.Conn.Group(column) }
func (h *testSqlHandler) Joins(query string, value ...interface{}) *gorm.DB {
	return h.Conn.Joins(query, value...)
}
func (h *testSqlHandler) Limit(limit int) *gorm.DB         { return h.Conn.Limit(limit) }
func (h *testSqlHandler) Model(value interface{}) *gorm.DB { return h.Conn.Model(value) }
func (h *testSqlHandler) Omit(columns ...string) *gorm.DB  { return h.Conn.Omit(columns...) }
func (h *testSqlHandler) Order(value interface{}) *gorm.DB { return h.Conn.Order(value) }
func (h *testSqlHandler) Raw(sql string) *gorm.DB          { return h.Conn.Raw(sql) }
func (h *testSqlHandler) Save(value interface{}) *gorm.DB  { return h.Conn.Save(value) }
func (h *testSqlHandler) Select(value interface{}, conds ...interface{}) *gorm.DB {
	return h.Conn.Select(value, conds...)
}
func (h *testSqlHandler) Unscoped() *gorm.DB { return h.Conn.Unscoped() }
func (h *testSqlHandler) Update(column string, value interface{}) *gorm.DB {
	return h.Conn.Update(column, value)
}
func (h *testSqlHandler) Updates(values interface{}) *gorm.DB { return h.Conn.Updates(values) }
func (h *testSqlHandler) Where(value interface{}, conds ...interface{}) *gorm.DB {
	return h.Conn.Where(value, conds...)
}

// connectTestDB は TEST_DB_DSN が設定されている場合のみ実DBへ接続する。
// 未設定の場合は t.Skip して通常のユニットテスト実行(go test ./...)には影響しない。
func connectTestDB(t *testing.T) *favoriteRepository {
	t.Helper()

	dsn := os.Getenv("TEST_DB_DSN")
	if dsn == "" {
		t.Skip("TEST_DB_DSN が未設定のためスキップ (docker compose up -d db で起動後、TEST_DB_DSN を設定して実行してください)")
	}

	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect test db: %v", err)
	}

	if err := conn.AutoMigrate(&domain.Favorite{}); err != nil {
		t.Fatalf("failed to migrate favorites table: %v", err)
	}

	t.Cleanup(func() {
		conn.Unscoped().Where("1 = 1").Delete(&domain.Favorite{})
	})

	// 各テストをクリーンな状態で始める
	conn.Unscoped().Where("1 = 1").Delete(&domain.Favorite{})

	return &favoriteRepository{SqlHandler: &testSqlHandler{Conn: conn}}
}

func countFavorites(t *testing.T, repo *favoriteRepository) int64 {
	t.Helper()
	var count int64
	if err := repo.SqlHandler.Model(&domain.Favorite{}).Count(&count).Error; err != nil {
		t.Fatalf("failed to count favorites: %v", err)
	}
	return count
}

// TestDeleteMovieFavorite_BlocksSQLInjection は、悪意ある movie_url を渡しても
// 他ユーザーのお気に入りレコードが巻き添えで削除されないことを検証する。
//
// 修正前の DeleteMovieFavorite は下記のように fmt.Sprintf で WHERE 句を組み立てていた:
//
//	whereQu := fmt.Sprintf("listener_id = %v AND movie_url = '%v' AND karaoke_id = 0", fav.ListenerId, fav.MovieUrl)
//
// listener_id に一致しない値(存在しないID)を指定した上で movie_url に
// `x' OR '1'='1` を渡すと、AND が OR より優先度が高いSQLの評価順の結果、
// "(listener_id = 999999 AND movie_url = 'x') OR ('1'='1' AND karaoke_id = 0)"
// となり karaoke_id = 0 の全レコードが削除されてしまう(実際に悪用可能な脆弱性)。
// プレースホルダー化した現在の実装ではこの注入は成立せず、他ユーザーのレコードは残る。
func TestDeleteMovieFavorite_BlocksSQLInjection(t *testing.T) {
	repo := connectTestDB(t)

	victim := domain.Favorite{ListenerId: 1, MovieUrl: "victim-movie-url", KaraokeId: 0}
	if err := repo.SqlHandler.Create(&victim).Error; err != nil {
		t.Fatalf("failed to seed victim favorite: %v", err)
	}

	attacker := domain.Favorite{
		ListenerId: 999999, // 存在しないlistener_id
		MovieUrl:   "nonexistent' OR '1'='1",
		KaraokeId:  0,
	}

	if err := repo.DeleteMovieFavorite(attacker); err != nil {
		t.Fatalf("DeleteMovieFavorite returned unexpected error: %v", err)
	}

	got := countFavorites(t, repo)
	if got != 1 {
		t.Fatalf("SQLインジェクションにより他ユーザーのお気に入りが削除された可能性がある: got %d favorites remaining, want 1", got)
	}
}

// TestFindFavoriteUnscopedByFavOrUnfavRegistry_BlocksSQLInjection は、
// movie_url に注入文字列を渡しても他ユーザーのレコードを取得できないことを検証する。
func TestFindFavoriteUnscopedByFavOrUnfavRegistry_BlocksSQLInjection(t *testing.T) {
	repo := connectTestDB(t)

	victim := domain.Favorite{ListenerId: 1, MovieUrl: "victim-movie-url", KaraokeId: 0}
	if err := repo.SqlHandler.Create(&victim).Error; err != nil {
		t.Fatalf("failed to seed victim favorite: %v", err)
	}

	attacker := domain.Favorite{
		ListenerId: 999999, // 存在しないlistener_id
		MovieUrl:   "nonexistent' OR '1'='1",
		KaraokeId:  0,
	}

	got := repo.FindFavoriteUnscopedByFavOrUnfavRegistry(attacker)

	if got.MovieUrl == victim.MovieUrl {
		t.Fatalf("SQLインジェクションにより他ユーザーのお気に入りが取得できてしまった: got movie_url=%q", got.MovieUrl)
	}
}
