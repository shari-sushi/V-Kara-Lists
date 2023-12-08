package infra

//"github.com/sharin-sushi/0022loginwithJWT/internal/utility"

import (
	// "database/sql"

	"fmt"
	"log"
	"os"

	// "time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	domain "github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"

	// "github.com/sharin-sushi/0022loginwithJWT/t0022Go/pkg/middleware"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// var DbGo *sql.DB
// var Db *gorm.DB

type SqlHandler struct {
	Conn *gorm.DB
}

// func GetDB() *gorm.DB {
// 	return Db
// }

func init() {
	//docker外ではPCのGO_ENVを取得し、godotenvが.dnvを取得する。
	//docker上ではdockercomposeが.envを取得する。
	// goEnv := os.Getenv("GO_ENV")
	// if goEnv == "development" {
	// fmt.Printf("goEnc=%v \n", goEnv)
	// t0016Go\internal\utility\auth.go
	err := godotenv.Load("../.env")
	if err == nil {
		checkFile := os.Getenv("GO_ENV")
		fmt.Printf("got .env file is %v \n", checkFile)
	} else {
		fmt.Print("godotenvによる.envファイル取得失敗。dockercompose.yamlから取得 \n")
		// log.Fatal("Error loading go/.env file")
		// }
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
		port = "localhost:3306" //docker不使用用
	} else if checkFile == "" {
		port = "v_kara_db" //docker不使用用
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

	// fmt.Printf("err=%s\n", err)
	// defer D.Close()
	return sqlHandler
}

func (Db *SqlHandler) migration() {
	fmt.Print("migratoin開始")
	Db.Conn.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(
		// User
		domain.Listener{},
		// Like Relatoin
		domain.FavoritePost{}, domain.Follow{},
		// Vtuber Contents
		domain.KaraokeList{}, domain.Movie{}, domain.Vtuber{}, domain.OriginalSong{},
	)
}

func (handler *SqlHandler) Create(value interface{}) *gorm.DB {
	return handler.Conn.Create(value)
}

func (handler *SqlHandler) Delete(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Delete(value)
}

func (handler *SqlHandler) Find(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Find(value)
}
func (handler *SqlHandler) Where(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Where(value)
}

func (handler *SqlHandler) First(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.First(value)
}
func (handler *SqlHandler) Select(value interface{}, conds ...interface{}) *gorm.DB {
	return handler.Conn.Select(value)
}
func (handler *SqlHandler) Update(column string, value interface{}) *gorm.DB {
	return handler.Conn.Update(column, value)
}
func (handler *SqlHandler) Updates(values interface{}) *gorm.DB {
	return handler.Conn.Updates(values)
}
func (handler *SqlHandler) Model(value interface{}) *gorm.DB {
	return handler.Conn.Model(value)
}
func (handler *SqlHandler) Save(value interface{}) *gorm.DB {
	return handler.Conn.Save(value)
}
func (handler *SqlHandler) Joins(query string, value interface{}) *gorm.DB {
	return handler.Conn.Joins(query, value)
}
func (handler *SqlHandler) Omit(columns string) *gorm.DB {
	return handler.Conn.Joins(columns)
}

// type LineOfLog struct {
// 	RemoteAddr  string
// 	ContentType string
// 	Path        string
// 	Query       string
// 	Method      string
// 	Body        string
// }

// var TemplateOfLog = `
// Remote address:   {{.RemoteAddr}}
// Content-Type:     {{.ContentType}}
// HTTP method:      {{.Method}}

// path:
// {{.Path}}

// query string:
// {{.Query}}

// body:
// {{.Body}}

// `

// //httpリクエストの中身をログに出力しようとして、やめた残がい。
// func Log(handler http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		bufbody := new(bytes.Buffer)
// 		bufbody.ReadFrom(r.Body)
// 		body := bufbody.String()

// 		line := LineOfLog{
// 			r.RemoteAddr,
// 			r.Header.Get("Content-Type"),
// 			r.URL.Path,
// 			r.URL.RawQuery,
// 			r.Method, body,
// 		}
// 		tmpl, err := template.New("line").Parse(TemplateOfLog)
// 		if err != nil {
// 			panic(err)
// 		}

// 		bufline := new(bytes.Buffer)
// 		err = tmpl.Execute(bufline, line)
// 		if err != nil {
// 			panic(err)
// 		}

// 		log.Printf(bufline.String())
// 		handler.ServeHTTP(w, r)
// 	})
// }
