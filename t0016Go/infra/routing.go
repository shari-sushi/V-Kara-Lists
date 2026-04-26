package infra

import (
	"github.com/gin-gonic/gin"
	contenthandler  "github.com/sharin-sushi/0016go_next_relation/handler/content"
	favoritehandler "github.com/sharin-sushi/0016go_next_relation/handler/favorite"
	otherhandler    "github.com/sharin-sushi/0016go_next_relation/handler/other"
	userhandler     "github.com/sharin-sushi/0016go_next_relation/handler/user"
	"github.com/sharin-sushi/0016go_next_relation/repository"
	"github.com/sharin-sushi/0016go_next_relation/service"
)

// 命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	routingV1(r)
	// 1つでもhandlerを実装したら開放する
	// routingV2(r)
}

// フロントで移行でき次第、１つずつも呼び出してるメソッドと共に削除していく。
func routingV1(r *gin.Engine) {
	db := NewSqlHandler()

	// Repository層
	contentRepo := repository.NewContentRepository(db)
	userRepo := repository.NewUserRepository(db)
	favoriteRepo := repository.NewFavoriteRepository(db)
	otherRepo := repository.NewOtherRepository(db)

	// Service層
	contentSvc := service.ContentService{ContentRepository: contentRepo}
	userSvc := service.UserService{UserRepository: userRepo}
	activitySvc := service.ActivityService{FavoriteRepository: favoriteRepo, ContentRepository: contentRepo}
	otherSvc := service.OtherService{OtherRepository: otherRepo}

	// Handler層
	contentH := contenthandler.NewContentHandler(contentSvc, activitySvc)
	userH := userhandler.NewUserHandler(userSvc, activitySvc)
	favoriteH := favoritehandler.NewFavoriteHandler(activitySvc)
	_ = otherhandler.NewOtherHandler(otherSvc)

	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			users.POST("/signup", userH.CreateUser)
			users.PUT("/login", userH.LogIn)
			users.PUT("/logout", userhandler.Logout) // dbアクセスしないから sqlHandlerのメソッドにしてないぽいそんな設計で良いのか
			users.DELETE("/withdraw", userH.LogicalDeleteUser)
			users.GET("/gestlogin", userhandler.GuestLogIn) // dbアクセスしないから gin.sqlHandlerのメソッドにしてないぽいそんな設計で良いのか
			users.GET("/profile", userH.GetListenerProfile)
			users.GET("/mypage", userH.ListenerPage)
		}
		vcontents := ver.Group("/vcontents")
		{
			vcontents.GET("/", contentH.ReturnTopPageData)
			vcontents.GET("/vtuber/:kana", contentH.ReturnVtuberPageData)
			vcontents.GET("/sings", contentH.GetJoinVtubersMoviesKaraokes)
			vcontents.GET("/original-song", contentH.ReturnOriginalSongPage)

			// /vtuber, /movie, /karaokeの文字列はフロント側で比較演算に使われてる
			// データ新規登録
			// TODO: 複数形のpathを用意して、複数登録対応にする(既存のpathも残す)
			vcontents.POST("/create/vtubers", contentH.CreateVtuber)
			vcontents.POST("/create/videos", contentH.CreateMovie)
			vcontents.POST("/create/karaokes", contentH.CreateKaraokes)

			//データ編集
			vcontents.POST("/edit/vtuber", contentH.EditVtuber)
			vcontents.POST("/edit/movie", contentH.EditMovie)
			vcontents.POST("/edit/karaoke", contentH.EditKaraoke)

			// // データ削除(物理)
			vcontents.GET("/delete/deletePage", contentH.DeleteOfPage)
			vcontents.DELETE("/delete/vtuber", contentH.DeleteVtuber)
			vcontents.DELETE("/delete/movie", contentH.DeleteMovie)
			vcontents.DELETE("/delete/karaoke", contentH.DeleteKaraoke)

			//ドロップダウン用
			vcontents.GET("/getalldata", contentH.GetVtuberMovieKaraoke)

			// テスト用
			vcontents.GET("/dummy-top-page", contentH.ReturnDummyTopPage)
		}
		fav := ver.Group("/fav")
		{
			fav.POST("/favorite/movie", favoriteH.SaveMovieFavorite)
			fav.DELETE("/unfavorite/movie", favoriteH.DeleteMovieFavorite)
			fav.POST("/favorite/karaoke", favoriteH.SaveKaraokeFavorite)
			fav.DELETE("/unfavorite/karaoke", favoriteH.DeleteKaraokeFavorite)
		}
	}
}

//lint:ignore U1000 (何かしら実装したら使う予定)
func routingV2(r *gin.Engine) {

	var v2 = r.Group("/v2")
	{
		users := v2.Group("/users")
		{
			users.GET("/", func(c *gin.Context) {})       //　GETに変えた注意
			users.GET("/logout", func(c *gin.Context) {}) // フロントに任せて良くない？→微妙
			users.POST("/signup", func(c *gin.Context) {})
			users.DELETE("/withdraw", func(c *gin.Context) {})
			users.GET("/guest", func(c *gin.Context) {})
			users.GET("/profile", func(c *gin.Context) {})
			users.GET("/like-karaoke", func(c *gin.Context) {})
			users.GET("/like-movie", func(c *gin.Context) {})
			users.GET("/resitored-vtubers", func(c *gin.Context) {})
			users.GET("/resitored-movies", func(c *gin.Context) {})
			users.GET("/resitored-songs", func(c *gin.Context) {})
		}

		streamContents := v2.Group("/stream-contents")
		{
			vtubers := streamContents.Group("/vtubers")
			{
				vtubers.GET("/", func(c *gin.Context) {})
				vtubers.POST("/create", func(c *gin.Context) {})
				vtubers.PUT("/update", func(c *gin.Context) {})
				vtubers.DELETE("/delete", func(c *gin.Context) {})
				vtubers.POST("/like", func(c *gin.Context) {})
				vtubers.DELETE("/unlike", func(c *gin.Context) {})
			}
			videos := streamContents.Group("/videos")
			{
				videos.GET("/", func(c *gin.Context) {})
				videos.POST("/create", func(c *gin.Context) {})
				videos.PUT("/update", func(c *gin.Context) {})
				videos.DELETE("/delete", func(c *gin.Context) {})
				videos.POST("/like", func(c *gin.Context) {})
				videos.DELETE("/unlike", func(c *gin.Context) {})
			}

			// 従来のカラオケソング＝歌ではなく、カラオケ配信＝歌枠(動画)の意
			// songsController := v2Songs.NewController(dbInit())
			songs := streamContents.Group("/songs")
			{
				songs.GET("/", func(c *gin.Context) {})
				// songs.POST("/create", songsController.Create)
				songs.PUT("/update", func(c *gin.Context) {})
				songs.DELETE("/delete", func(c *gin.Context) {})
				songs.POST("/like", func(c *gin.Context) {})
				songs.DELETE("/unlike", func(c *gin.Context) {})
			}
		}
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
