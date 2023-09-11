package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/rs/cors"

	"github.com/sharin-sushi/0016go_next_relation/internal/controller/postrequest"
	"github.com/sharin-sushi/0016go_next_relation/internal/crud"
	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

//init at /internal/utility/database.go

func main() {
	r := gin.Default()

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

	//ログイン、サインナップ、ログアウト ※ブラウザでは"/"にリンク有り
	r.POST("/signup", postrequest.PostSignup)
	r.POST("/login", postrequest.PostLogin)
	r.POST("/logout", postrequest.PostLogout) //未作成

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

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
	})
	handler := c.Handler(r)

	// handler := cors.Default().Handler(r)

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}

	r.Run(":8080")
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
