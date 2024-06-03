package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers"
)

// 命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	controller := controllers.NewController(dbInit())

	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			users.POST("/signup", controller.CreateUser)
			users.PUT("/login", controller.LogIn)
			users.PUT("/logout", controllers.Logout)
			users.DELETE("/withdraw", controller.LogicalDeleteUser)
			users.GET("/gestlogin", controllers.GuestLogIn)
			users.GET("/profile", controller.GetListenerProfile)
			users.GET("/mypage", controller.ListenerPage)
		}
		vcontents := ver.Group("/vcontents")
		{
			vcontents.GET("/", controller.ReturnTopPageData)
			vcontents.GET("/vtuber/:kana", controller.ReturnVtuberPageData)
			// TODO : v2 : 単数形に
			vcontents.GET("/sings", controller.GetJoinVtubersMoviesKaraokes)
			vcontents.GET("/original-song", controller.ReturnOriginalSongPage)

			// /vtuber, /movie, /karaokeの文字列はフロント側で比較演算に使われてる
			// データ新規登録
			vcontents.POST("/create/vtuber", controller.CreateVtuber)
			vcontents.POST("/create/movie", controller.CreateMovie)
			vcontents.POST("/create/karaoke", controller.CreateKaraoke)

			//データ編集
			vcontents.POST("/edit/vtuber", controller.EditVtuber)
			vcontents.POST("/edit/movie", controller.EditMovie)
			vcontents.POST("/edit/karaoke", controller.EditKaraoke)

			// // データ削除(物理)
			vcontents.GET("/delete/deletePage", controller.DeleteOfPage)
			vcontents.DELETE("/delete/vtuber", controller.DeleteVtuber)
			vcontents.DELETE("/delete/movie", controller.DeleteMovie)
			vcontents.DELETE("/delete/karaoke", controller.DeleteKaraoke)

			//ドロップダウン用
			vcontents.GET("/getalldata", controller.GetVtuverMovieKaraoke)

			// テスト用
			vcontents.GET("/dummy-top-page", controller.ReturnDummyTopPage)
		}
		fav := ver.Group("/fav")
		{
			fav.POST("/favorite/movie", controller.SaveMovieFavorite)
			fav.DELETE("/unfavorite/movie", controller.DeleteMovieFavorite)
			fav.POST("/favorite/karaoke", controller.SaveKaraokeFavorite)
			fav.DELETE("/unfavorite/karaoke", controller.DeleteKaraokeFavorite)
		}
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
