package utility

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var Db *sql.DB

// init packageがimportされたときに１度だけ自動で呼び出される
func init() {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	db_name := os.Getenv("MYSQL_DATABASE")

	var path string = fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s?charset=utf8&parseTime=true", user, pw, db_name)
	// sqlへ接続するための文字列の生成
	var err error

	// fmt.Printf("%s\n%s\n", path, err)

	if Db, err = sql.Open("mysql", path); err != nil {
		fmt.Printf("database.goのinitでエラー発生:err=%s, path=%s", err, path)
		// log.Fatal("Db open error:", err.Error())
	}
	fmt.Printf("%s\n%s\n", path, err)
	fmt.Printf("%s\n", Db)

	checkConnect(1)

	// defer Db.Close()
}

// user := "ユーザー名"
// password := "パスワード"
// host := "ホスト名"
// port := "ポート番号"
// database := "データベース名"

func checkConnect(count uint) {
	var err error
	if err = Db.Ping(); err != nil {
		time.Sleep(time.Second * 2)
		count--
		fmt.Printf("retry... count:%v\n", count)
		if count > 0 {
			checkConnect(count)
		} else {
			fmt.Println("Connection retries exhausted err")
			fmt.Printf("err=%s", err)
			return
		}
	} else {
		fmt.Println("db connected!!")
	}
}
