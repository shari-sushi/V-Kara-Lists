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
//
// 実行方法:
//
//	docker compose up -d db
//	export TEST_DB_DSN="user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=true"
//	cd t0016Go && go test ./repository/... -v
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

// TestConnectTestDB_CanCreateAndCountFavorite は実DB接続基盤そのものの疎通確認。
// AutoMigrateしたfavoritesテーブルにレコードを作成し、カウントできることを確認する。
func TestConnectTestDB_CanCreateAndCountFavorite(t *testing.T) {
	repo := connectTestDB(t)

	fav := domain.Favorite{ListenerId: 1, MovieUrl: "smoke-test-movie-url", KaraokeId: 0}
	if err := repo.SqlHandler.Create(&fav).Error; err != nil {
		t.Fatalf("failed to create favorite: %v", err)
	}

	if got := countFavorites(t, repo); got != 1 {
		t.Fatalf("got %d favorites, want 1", got)
	}
}
