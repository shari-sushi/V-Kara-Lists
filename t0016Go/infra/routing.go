package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers"
)

// 命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	Controller := controllers.NewController(DbInit())

	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			users.POST("/signup", Controller.CreateUser)
			users.PUT("/login", Controller.LogIn)
			users.PUT("/logout", controllers.Logout)
			users.DELETE("/withdraw", Controller.LogicalDeleteUser) //未
			users.GET("/gestlogin", controllers.GuestLogIn)
			users.GET("/profile", Controller.GetListenerProfile)
			users.GET("/mypage", Controller.ListenerPage)

			// users.GET("/resignup", userController.RestoreUser)　//ver1.5
		}
		vcontents := ver.Group("/vcontents")
		{
			vcontents.GET("/", Controller.ReturnTopPageData)
			vcontents.GET("/sings", Controller.GetJoinVtubersMoviesKaraokes)
			// /vtuber, /movie, /karaokeの文字列はフロント側で比較演算に使われてる
			// データ新規登録
			vcontents.POST("/create/vtuber", Controller.CreateVtuber)
			vcontents.POST("/create/movie", Controller.CreateMovie)
			vcontents.POST("/create/karaoke", Controller.CreateKaraoke)
			// vcontents.POST("/create/song", Controller.CreateSong)           //ver1.5

			//データ編集
			vcontents.POST("/edit/vtuber", Controller.EditVtuber)
			vcontents.POST("/edit/movie", Controller.EditMovie)
			vcontents.POST("/edit/karaoke", Controller.EditKaraoke)
			// vcontents.POST("/edit/song", Controller.EditSong)           //ver1.5

			// // データ削除(物理)
			vcontents.GET("/delete/deletePage", Controller.DeleteOfPage)
			vcontents.DELETE("/delete/vtuber", Controller.DeleteVtuber)
			vcontents.DELETE("/delete/movie", Controller.DeleteMovie)
			vcontents.DELETE("/delete/karaoke", Controller.DeleteKaraoke)
			// vcontents.DELETE("/delete/song", Controller.DeleteSong)           //ver1.5

			//ドロップダウン用
			vcontents.GET("/getalldata", Controller.GetVtuverMovieKaraoke)
			vcontents.GET("/oimomochimochiimomochioimo", Controller.Enigma) // 管理者用

		}
		fav := ver.Group("/fav")
		{
			fav.POST("/favorite/movie", Controller.SaveMovieFavorite)
			fav.DELETE("/unfavorite/movie", Controller.DeleteMovieFavorite)
			fav.POST("/favorite/karaoke", Controller.SaveKaraokeFavorite)
			fav.DELETE("/unfavorite/karaoke", Controller.DeleteKaraokeFavorite)
		}
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
