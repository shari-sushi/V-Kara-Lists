package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/controller/postrequest"
	"github.com/sharin-sushi/0016go_next_relation/internal/crud"
	"github.com/sharin-sushi/0016go_next_relation/internal/types"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

//init at /internal/utility/database.go

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

	//配信者
	r.GET("/", crud.GetAllStreamers)
	r.POST("/", crud.PostStreamer)
	r.PUT("/", crud.PutStreamer)
	r.DELETE("/", crud.DeletetStreamer)

	//動画
	r.GET("/movie", crud.ReadMovies) //未作成

	//歌
	r.GET("/sing", crud.ReadSings)

	//https://qiita.com/koshi_an/items/12da955a1823b7f3e178より
	store := cookie.NewStore([]byte("OimoMochiMochIimoMochiOimo20000530"), []byte("sora4mama1997087")) //byteのスライスに変換することで値を変更できるらしい
	//Sesion()の第１引数がCookie名としてセットされ、以後自動で使用され、ブラウザに送信される）らしい
	r.Use(sessions.Sessions("mainCookieSession", store))
	//↑どうなってるのか謎。

	// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
	utility.CallGetMemberProfile(r)

	//ログイン、サインナップ、ログアウト ※ブラウザでは"/"にリンク有り
	r.POST("/signup", postrequest.PostSignup)
	r.POST("/login", postrequest.PostLogIn)
	r.POST("/logout", postrequest.PostLogout) //未作成

	r.POST("/signup2", utility.CalltoSignUpHandler)
	r.POST("/login2", utility.CalltoLogInHandler)
	r.POST("/logout2", utility.LogoutHandler)

	// 　　/mypage/~ をグループ化→/maypageとその下層へアクセスしたとき全てに適応　→１つなら要らか？
	//　　 ("~")　にアクセスしたときにセッション確認し強制で{}のページへ遷移
	//		↑違ったかも
	//	/maypage/{}で指定したpath にアクションがあった際にUse(sessionChechk())を実行する。
	r.Group("/mypage").Use(sessionCheck())
	{
		// r.GET("/", mypage.Mypage) //未作成　マイページにしたい
	}

	//Cookie　削除予定
	r.GET("/cookie", utility.GetCookie)

	// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
	// r.GET("/envpass", postrequest.EnvPass)

	r.RunTLS(":8080", "../../key/server.pem", "../../key/server.key")
}

type SessionInfo struct {
	MemberId interface{}
	// MemberName interface{}
}

//https://qiita.com/koshi_an/items/12da955a1823b7f3e178より
//ミドルウェア
func sessionCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		var LoginInfo SessionInfo
		session := sessions.Default(c)               //与えられたkeyの値が存在すればそれを返し、無ければpanic
		LoginInfo.MemberId = session.Get("MemberId") //与えられたkeyに関連するsessionを返す

		// セッションがない場合、ログインフォームをだす
		if LoginInfo.MemberId == nil {
			log.Println("ログインしていません")
			c.Redirect(http.StatusMovedPermanently, "/login")
			c.Abort() // これがないと続けて処理されてしまう
		} else {
			c.Set("UserId", LoginInfo.MemberId) // ユーザidをセット
			c.Next()
		}
		log.Println("ログインチェック終わり")
	}
}

var streamer types.Streamer
var streamers []types.Streamer
var stsmos []*types.StreamerMovie //Scan()するからポインタ？

func GetAllStreamers(c *gin.Context) {
	/////streamers 全件取得
	resultSts := utility.Db.Find(&streamers)
	if resultSts.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": resultSts.Error.Error()})
		return
	}

	fmt.Printf("全件取得streamers=%v \n", streamers)

	////streamers, movies joinして全件取 ReadMoviesに同じ
	resultStsmo := utility.Db.Model(&streamers).Select("streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title").Joins("LEFT JOIN movies m USING(streamer_id)").Scan(&stsmos)
	// SELECT ~略~ FROM streamers LEFT JOIN movies m USING streamer_id
	if resultStsmo.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultStsmo.Error.Error()})
		return
	}
	// for resultStsmo.Next() {
	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

	// }
	fmt.Printf("stsmos=%v, \n streamers=%v \n", stsmos, streamers)

	for _, stsmo := range stsmos {
		fmt.Printf("%+v\n", *stsmo)
	}

	c.JSON(http.StatusOK, gin.H{
		"streamers":                  streamers,
		"streamers_and_moviesmovies": stsmos,
	})
}

// SELECT streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title FROM streamers LEFT JOIN movies m USING(streamer_id)
