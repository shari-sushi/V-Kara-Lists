package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers"
)

// このリポジトリの命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	userController := controllers.NewUserController(DbInit())
	VCController := controllers.NewVtuberContentController(DbInit())
	FavoriteController := controllers.NewFavoriteController(DbInit())

	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			users.POST("/signup", userController.CreateUser) //ok
			users.PUT("/login", userController.LogIn)
			users.PUT("/logout", controllers.Logout)
			users.DELETE("/withdraw", userController.LogicalDeleteUser) //未
			users.GET("/gestlogin", controllers.GuestLogIn)
			users.GET("/profile", userController.GetListenerProfile)
			users.GET("/mypage", userController.GetListenerProfile)

			// users.GET("/resignup", userController.RestoreUser)　//ver1.5
		}
		vcontents := ver.Group("/vcontents")
		{
			vcontents.GET("/", VCController.ReturnTopPageData)
			vcontents.GET("/sings", VCController.GetAllJoinVtubersMoviesKaraokes)
			// /vtuber, /movie, /karaokeの文字列はフロント側で比較演算に使われてる
			// データ新規登録
			vcontents.POST("/create/vtuber", VCController.CreateVtuber)
			vcontents.POST("/create/movie", VCController.CreateMovie)
			vcontents.POST("/create/karaoke", VCController.CreateKaraokeSing)
			// vcontents.POST("/create/song", VCController.CreateSong)           //ver1.5

			//データ編集
			vcontents.POST("/edit/vtuber", VCController.EditVtuber)
			vcontents.POST("/edit/movie", VCController.EditMovie)
			vcontents.POST("/edit/karaoke", VCController.EditKaraokeSing)
			// vcontents.POST("/edit/song", VCController.EditSong)           //ver1.5

			// // データ削除(物理)
			vcontents.DELETE("/delete/vtuber", VCController.DeleteVtuber)
			vcontents.DELETE("/delete/movie", VCController.DeleteMovie)
			vcontents.DELETE("/delete/karaoke", VCController.DeleteKaraokeSing)
			// vcontents.DELETE("/delete/song", VCController.DeleteSong)           //ver1.5

			//ドロップダウン用
			// vcontents.GET("/getsong", VCController.ReadAllSongs)       //ver1.5かな
			vcontents.GET("/getalldata", VCController.ReadAllVtuverMovieKaraoke)
			vcontents.GET("/oimomochimochiimomochioimo", VCController.Enigma) // 管理者用

		}
		fav := ver.Group("/fav")
		{
			fav.GET("/", FavoriteController.ReturnTopPageData)

			// favorites.GET("/followvtuber")   //V数が増えたら実装
			// favorites.GET("/unfollowvtuber") //V数が増えたら実装
			fav.POST("/favorite/movie", FavoriteController.CreateMovieFavorite) //ok
			fav.POST("/unfavorite/movie", FavoriteController.DeleteMovieFavorite)
			fav.POST("/favorite/karaoke", FavoriteController.CreateKaraokeFavorite) //ok
			fav.POST("/unfavorite/karaoke", FavoriteController.DeleteKaraokeFavorite)
		}
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
