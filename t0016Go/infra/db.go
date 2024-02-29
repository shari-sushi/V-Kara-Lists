package infra

import (
	"fmt"
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

func init() {
	getEnvVar()
}

// 似たような処理がSetListenerIdintoCookie()にもあるので、envを変更するときは注意
func getEnvVar() {
	goEnv := os.Getenv("GO_ENV") //ローカルpc上でのみ設定
	isDockerCompose := os.Getenv("IS_DOCKER_COMPOSE")
	if goEnv == "" && isDockerCompose == "" {
		//クラウド環境
		fmt.Println("クラウド環境で起動")
		envCheck(goEnv, isDockerCompose)
	} else if goEnv == "" && isDockerCompose == "true" {
		// ローカルのdocker上(compose使用)
		fmt.Println("ローカルのdockerコンテナ内で起動")
		envCheck(goEnv, isDockerCompose)
	} else if goEnv == "development" && isDockerCompose == "" {
		//VSCodeで起動
		fmt.Println("VSCodeで起動。godotenv.Load使用")
		err := godotenv.Load("../.env")
		if err == nil {
			fmt.Println("got .env file sucussesly. retry os.Getenv")
			goEnv := os.Getenv("GO_ENV")
			envCheck(goEnv, isDockerCompose)
		} else {
			fmt.Println("godotenvで.envファイル取得失敗")
			envCheck(goEnv, isDockerCompose)
		}
	}
}

func envCheck(goEnv, isDockerCompose string) {
	fmt.Printf("goEnv == %v && isDocker == %v \n", goEnv, isDockerCompose)

	guest := os.Getenv("GUEST_USER_NAME")
	fmt.Printf("GUEST_USER_NAME=%v \n", guest)
}

func dbInit() database.SqlHandler {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	db_name := ""
	// db_name := "migration_test" //migrationテスト用
	port := "3306"
	dbUrL := ""
	path := ""

	isDockerCompose := os.Getenv("IS_DOCKER_COMPOSE")
	goEnv := os.Getenv("GO_ENV")

	if goEnv == "" && isDockerCompose == "" {
		//クラウド環境
		dbUrL = os.Getenv("RDS_END_PIONT")
		db_name = os.Getenv("AWS_DATABASE")
	} else if (goEnv == "" && isDockerCompose == "true") || (goEnv == "development" && isDockerCompose == "") {
		// ローカルのdocker上(compose使用) or  VSCodeで起動
		dbUrL = "localhost"
		db_name = os.Getenv("MYSQL_DATABASE")
	}

	path = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true", user, pw, dbUrL, port, db_name)

	fmt.Printf("path=%v \n", path)
	var err error
	var sqlHandler *SqlHandler
	gormDB, err := gorm.Open(mysql.Open(path), &gorm.Config{})
	gormDB = gormDB.Debug()
	if err == nil {
		sqlHandler = new(SqlHandler)
		sqlHandler.Conn = gormDB
		sqlHandler.migration()
	} else {
		panic("failed to connect database")
	}

	// rows, err := gormDB.Raw("SHOW DATABASES").Rows()
	// if err != nil {
	// 	fmt.Printf("show databases get err: %v\n", err)
	// }
	// defer rows.Close()

	// fmt.Printf("result of \"show databases\" is \n")
	// for rows.Next() {
	// 	var database string
	// 	if err := rows.Scan(&database); err != nil {
	// 		panic(err.Error())
	// 	}
	// 	fmt.Printf("%v\n", database)
	// }
	// fmt.Printf("That's all\n")

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
func (handler *SqlHandler) Limit(limit int) *gorm.DB {
	return handler.Conn.Limit(limit)
}
func (handler *SqlHandler) Model(value interface{}) *gorm.DB {
	return handler.Conn.Model(value)
}
func (handler *SqlHandler) Omit(columns ...string) *gorm.DB {
	return handler.Conn.Omit(columns...)
}
func (handler *SqlHandler) Order(value interface{}) *gorm.DB {
	return handler.Conn.Order(value)
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
