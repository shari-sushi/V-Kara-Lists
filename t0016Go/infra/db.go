package infra

//"github.com/sharin-sushi/0022loginwithJWT/internal/utility"

import (
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	domain "github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlHandler struct {
	Conn *gorm.DB
}

func init() { //共通化したい……interfaces/controllers/commonと
	//docker外ではPCのGO_ENVを取得し、godotenvが.dnvを取得する。
	//docker上ではdockercomposeが.envを取得する。
	// goEnv := os.Getenv("GO_ENV")
	// if goEnv == "development" {
	// fmt.Printf("goEnc=%v \n", goEnv)
	err := godotenv.Load("../.env")
	if err == nil {
		checkFile := os.Getenv("GO_ENV")
		fmt.Printf("got .env file is %v \n", checkFile)
	} else {
		fmt.Print("godotenvによる.envファイル取得失敗。dockercompose.yamlから取得 \n")
	}
}

func DbInit() database.SqlHandler {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	// db_name := os.Getenv("MYSQL_DATABASE")
	// db_name := "migration_test" //migrationテスト用
	// port := "v_kara_db" //docker用
	var port string
	checkFile := os.Getenv("GO_ENV")
	if checkFile == "development" {
		port = "localhost:3306" //docker不使用時
	} else if checkFile == "" {
		port = "v_kara_db" //docker不使用用時
	} else {
		log.Fatal("GO_ENVに想定外の値が入力されています。")

	}
	db_name := "test"
	path := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=true", user, pw, port, db_name)
	fmt.Printf("path=%v \n", path)
	var err error
	gormDB, err := gorm.Open(mysql.Open(path), &gorm.Config{})
	gormDB = gormDB.Debug()
	if err != nil {
		panic("failed to connect database")
	}
	sqlHandler := new(SqlHandler)
	sqlHandler.Conn = gormDB
	sqlHandler.migration()

	return sqlHandler
}

func (Db *SqlHandler) migration() {
	fmt.Print("migratoin開始")
	Db.Conn.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(
		// User
		domain.Listener{},
		// Like Relatoin
		domain.Favorite{}, domain.Follow{},
		// Vtuber Contents
		domain.Karaoke{}, domain.Movie{}, domain.Vtuber{}, domain.OriginalSong{},
	)
}

func (handler *SqlHandler) Count(column *int64) *gorm.DB {
	return handler.Conn.Count(column)
}
func (handler *SqlHandler) Create(value interface{}) *gorm.DB {
	return handler.Conn.Create(value)
}
func (handler *SqlHandler) Delete(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Delete(value, conds...)
}
func (handler *SqlHandler) Find(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Find(value, conds...)
}
func (handler *SqlHandler) First(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.First(value, conds...)
}
func (handler *SqlHandler) Group(column string) *gorm.DB {
	return handler.Conn.Group(column)
}
func (handler *SqlHandler) Joins(query string, value ...interface{}) *gorm.DB {
	return handler.Conn.Joins(query, value...)
}
func (handler *SqlHandler) Model(value interface{}) *gorm.DB {
	return handler.Conn.Model(value)
}
func (handler *SqlHandler) Omit(columns ...string) *gorm.DB {
	return handler.Conn.Omit(columns...)
}
func (handler *SqlHandler) Save(value interface{}) *gorm.DB {
	return handler.Conn.Save(value)
}
func (handler *SqlHandler) Select(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Select(value, conds...)
}
func (handler *SqlHandler) Unscoped() *gorm.DB {
	return handler.Conn.Unscoped()
}
func (handler *SqlHandler) Update(column string, value interface{}) *gorm.DB {
	return handler.Conn.Update(column, value)
}
func (handler *SqlHandler) Updates(values interface{}) *gorm.DB {
	return handler.Conn.Updates(values)
}
func (handler *SqlHandler) Where(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Where(value, conds...)
}
