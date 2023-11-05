package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/crud"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

func main() {
	start()
}

func start() {
	utility.InitDb()
	r := gin.Default()
	r.Use(RequestLogger())
	r.Use(cors.New(cors.Config{
		// アクセス許可するオリジン
		AllowOrigins: []string{"https://localhost:3000"},
		// AllowOrigins: []string{"*"}, //ワイルドカードだが、クライアント側がcredenrials incliudeでは許されてない。

		// アクセス許可するHTTPメソッド
		AllowMethods: []string{"POST", "GET", "PUT", "DELETE"},
		// 許可するHTTPリクエストヘッダ
		// AllowHeaders: []string{"Content-Type"},
		AllowHeaders: []string{"Origin", "Content-Length", "Content-Type", "Cookie"},
		// cookieなどの情報を許可するかどうか
		AllowCredentials: true,
		// // preflightリクエストの結果をキャッシュする時間
		// MaxAge: 24 * time.Hour,
	}))

	// いらんくね
	//https://qiita.com/koshi_an/items/12da955a1823b7f3e178より
	store := cookie.NewStore([]byte("OimoMochiMochIimoMochiOimo20000530"), []byte("sora4mama1997087")) //byteのスライスに変換することで値を変更できるらしい
	//Sesion()の第１引数がCookie名としてセットされ、以後自動で使用され、ブラウザに送信される）らしい
	r.Use(sessions.Sessions("mainCookieSession", store))
	//↑どうなってるのか謎。

	//topページ
	r.GET("/", crud.ReadAllVtubersAndMovies)                   //動作ok
	r.GET("/vtuber=[id]", crud.ReadAllVtubersAndMovies)        //未 ver. 1.0の最後
	r.GET("/vtuber=[id]/movies", crud.ReadAllVtubersAndMovies) //未 ver. 1.0の最後
	r.GET("/sings", crud.ReadAllSings)                         //動作ok

	// メインコンテンツのCRUD　/vtuber, /movie, /karaokeはフロント側で比較演算に使われてる
	// データ新規登録
	r.POST("/create/vtuber", crud.CreateVtuber)       //動作ok
	r.POST("/create/movie", crud.CreateMovie)         //動作ok
	r.POST("/create/karaoke", crud.CreateKaraokeSing) //動作ok
	r.POST("/create/song", crud.CreateSong)           //未　ver1.5かな

	//データ編集
	r.POST("/edit/vtuber", crud.EditVtuber)       //動作ok
	r.POST("/edit/movie", crud.EditMovie)         //動作ok
	r.POST("/edit/karaoke", crud.EditKaraokeSing) //動作ok
	r.POST("/edit/song", crud.EditSong)           //未　ver1.5かな

	// データ削除(物理)
	r.DELETE("/delete/vtuber", crud.DeleteVtuber)       //動作ok
	r.DELETE("/delete/movie", crud.DeleteMovie)         //動作ok
	r.DELETE("/delete/karaoke", crud.DeleteKaraokeSing) //動作ok
	r.DELETE("/delete/song", crud.DeleteSong)           //未　ver1.5かな

	//ドロップダウン用
	r.GET("/getvtuber", crud.ReadAllVtubersName)               //動ok
	r.POST("/getmovie", crud.ReadMovieTitlesOfTheVTuber)       //動ok
	r.POST("/getkaraokelist", crud.ReadKaraokeListsOfTheMovie) //動ok
	r.POST("/getsong", crud.ReadAllSongs)                      //動作ok
	r.GET("/getalldate", crud.ReadAllDate)                     //未

	//ユーザー認証 ※ブラウザでは"/"にリンク有り
	r.POST("/signup", utility.CalltoSignUpHandler) //動作ほぼok　登録済みのメアドの時に、処理は止めてくれるけど、エラー内容を返してくれない…。
	r.POST("/login", utility.CalltoLogInHandler)   //動作ok
	r.GET("/logout", utility.LogoutHandler)        //動作ok だけどフロントで完結しない？まあよしとした。
	r.DELETE("/withdraw", utility.Withdrawal)      //未
	r.DELETE("/????", utility.Withdrawal)          //未 ver.1.5かなぁ	//論理削除後の期限切れ path不要か？
	r.GET("/resignup", utility.Withdrawal)         //未	ver1.5かなぁ	//論理削除中に同じアドレスで再登録
	r.GET("/gestlogin", utility.GestlogIn)         //動作ok

	// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
	utility.CallGetMemberProfile(r) //未

	// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
	// r.GET("/envpass", postrequest.EnvPass)

	r.RunTLS(":8080", "../../key/server.pem", "../../key/server_unencrypted.key")
}

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Printf("Method: %s, Path: %s, Header: %v\n, , Body: %v\n", c.Request.Method, c.Request.URL.Path, c.Request.Header, c.Request.Body)
		c.Next()
	}
}

// 多分消して良い

// 		// セッションがない場合、ログインフォームをだす
// 		if LoginInfo.MemberId == nil {
// 			log.Println("ログインしていません")
// 			c.Redirect(http.StatusMovedPermanently, "/login")
// 			c.Abort() // これがないと続けて処理されてしまう
// 		} else {
// 			c.Set("UserId", LoginInfo.MemberId) // ユーザidをセット
// 			c.Next()
// 		}
// 		log.Println("ログインチェック終わり")
// 	}
// }
