package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers"
)

// 命名規則
// https://github.com/sharin-sushi/0016go_next_relation/issues/71#issuecomment-1843543763

func Routing(r *gin.Engine) {
	ver := r.Group("/v1")
	{
		users := ver.Group("/users")
		{
			userController := controllers.NewUserController(DbInit())
			users.POST("/signup", userController.CreateUser)
			users.PUT("/login", userController.LogIn)                   //動作ok
			users.PUT("/logout", controllers.Logout)                    //動作ok だけどフロントで完結しない？まあよしとした。
			users.DELETE("/withdraw", userController.LogicalDeleteUser) //未
			// users.DELETE("/?", userController.)       //未 ver.1.5かなぁ	//論理削除後の期限切れ path不要か？
			// users.GET("/resignup", userController.Undelete) //未	ver1.5かなぁ	//論理削除中に同じアドレスで再登録
			users.GET("/gestlogin", controllers.GuestLogIn) //動作ok
			users.GET("/profile", userController.GetListenerProfile)
			// users.GET("/restore", userController.RestoreUser)　//ver ?で実装する。
		}
		vcontents := ver.Group("/vcontents")
		{
			VCController := controllers.NewVtuberContentController(DbInit())

			vcontents.GET("/", VCController.TopPageData) //動作ok
			// vcontents.GET("/vtuber=[id]", VCController.ReadAllVtubersAndMovies)        //未 ver. 1.0の最後
			// vcontents.GET("/vtuber=[id]/movies", VCController.ReadAllVtubersAndMovies) //未 ver. 1.0の最後
			vcontents.GET("/sings", VCController.GetAllJoinVtubersMoviesKaraokes) //動作ok

			// メインコンテンツのCRUD　/vtuber, /movie, /karaokeはフロント側で比較演算に使われてる
			// データ新規登録
			vcontents.POST("/create/vtuber", VCController.CreateVtuber)       //動作ok
			vcontents.POST("/create/movie", VCController.CreateMovie)         //動作ok
			vcontents.POST("/create/karaoke", VCController.CreateKaraokeSing) //動作ok
			// vcontents.POST("/create/song", VCController.CreateSong)           //未　ver1.5かな

			//データ編集
			vcontents.POST("/edit/vtuber", VCController.EditVtuber)       //動作ok
			vcontents.POST("/edit/movie", VCController.EditMovie)         //動作ok
			vcontents.POST("/edit/karaoke", VCController.EditKaraokeSing) //動作ok
			// vcontents.POST("/edit/song", VCController.EditSong)           //未　ver1.5かな

			// // データ削除(物理)
			vcontents.DELETE("/delete/vtuber", VCController.DeleteVtuber)       //動作ok
			vcontents.DELETE("/delete/movie", VCController.DeleteMovie)         //動作ok
			vcontents.DELETE("/delete/karaoke", VCController.DeleteKaraokeSing) //動作ok
			// vcontents.DELETE("/delete/song", VCController.DeleteSong)           //未　ver1.5かな

			//ドロップダウン用
			// vcontents.GET("/getsong", VCController.ReadAllSongs)                      //動作ok
			vcontents.GET("/getalldata", VCController.ReadAllVtuverMovieKaraoke) //未
			// 管理者用
			vcontents.GET("/oimomochimochiimomochioimo", VCController.Enigma) //動作ok

		}
		// likes := ver.Group("/likes")
		// {
		// }
	}
}

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
