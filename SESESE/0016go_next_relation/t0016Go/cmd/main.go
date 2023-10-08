package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/crud"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

func main() {
	r := gin.Default()

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
	r.GET("/", crud.ReadAllVtubers)                   //動作ok
	r.GET("/vtuber=[id]", crud.ReadAllVtubers)        //未 ver. 1.0の最後
	r.GET("/vtuber=[id]/movies", crud.ReadAllVtubers) //未 ver. 1.0の最後
	r.GET("/sings", crud.ReadAllSings)                //動作ok

	// データ新規登録
	r.POST("/create/vtuber", crud.CreateVtuber)     //未
	r.POST("/create/movie", crud.CreateMovie)       //未
	r.POST("/create/sings", crud.CreateKaraokeSing) //未
	r.POST("/create/songs", crud.CreateSong)        //未　ver1.5かな

	//データ編集
	r.POST("/edit/vtuber", crud.EditVtuber)     //未
	r.POST("/edit/movie", crud.EditMovie)       //未
	r.POST("/edit/sings", crud.EditKaraokeSing) //未
	r.POST("/edit/songs", crud.EditSong)        //未　ver1.5かな

	// データ削除(論理)
	r.DELETE("/delete/vtruber", crud.DeleteVtuber)    //未
	r.DELETE("/delete/movie", crud.DeleteMovie)       //未
	r.DELETE("/delete/sings", crud.DeleteKaraokeSing) //未
	r.DELETE("/delete/songs", crud.DeleteSong)        //未　ver1.5かな

	//ユーザー認証 ※ブラウザでは"/"にリンク有り
	r.POST("/signup2", utility.CalltoSignUpHandler) //動作ほぼok　登録済みのメアドの時に、処理は止めてくれるけど、エラー内容を返してくれない…。
	r.POST("/login2", utility.CalltoLogInHandler)   //動作ok
	r.GET("/logout2", utility.LogoutHandler)        //動作ok

	// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
	utility.CallGetMemberProfile(r) //未

	// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
	// r.GET("/envpass", postrequest.EnvPass)

	r.RunTLS(":8080", "../../key/server.pem", "../../key/server.key")
}

// 多分消して良い
// var streamer types.Vtuber
// var streamers []types.Vtuber
// var stsmos []*types.VtuberMovie //Scan()するからポインタ？

// func FindAllStreamers(c *gin.Context) {
// 	/////streamers 全件取得
// 	resultSts := utility.Db.Find(&streamers)
// 	if resultSts.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": resultSts.Error.Error()})
// 		return
// 	}

// 	fmt.Printf("全件取得streamers=%v \n", streamers)

// 	////streamers, movies joinして全件取 ReadMoviesに同じ
// 	resultStsmo := utility.Db.Model(&streamers).Select("streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title").Joins("LEFT JOIN movies m USING(streamer_id)").Scan(&stsmos)
// 	// SELECT ~略~ FROM streamers LEFT JOIN movies m USING streamer_id
// 	if resultStsmo.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultStsmo.Error.Error()})
// 		return
// 	}
// 	// for resultStsmo.Next() {
// 	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

// 	// }
// 	fmt.Printf("stsmos=%v, \n streamers=%v \n", stsmos, streamers)

// 	for _, stsmo := range stsmos {
// 		fmt.Printf("%+v\n", *stsmo)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"streamers":                  streamers,
// 		"streamers_and_moviesmovies": stsmos,
// 	})
// }

// SELECT streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title FROM streamers LEFT JOIN movies m USING(streamer_id)

// ********memo*******

// セッション管理しようとしたときの。
// type SessionInfo struct {
// 	MemberId interface{}
// 	// MemberName interface{}
// }

//https://qiita.com/koshi_an/items/12da955a1823b7f3e178より
//ミドルウェア
// func sessionCheck() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var LoginInfo SessionInfo
// 		session := sessions.Default(c)               //与えられたkeyの値が存在すればそれを返し、無ければpanic
// 		LoginInfo.MemberId = session.Get("MemberId") //与えられたkeyに関連するsessionを返す

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
