package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers"
)

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
		// vcontents := ver.Group("/vcontents")
		// {
		// }
		// likes := ver.Group("/likes")
		// {
		// }
	}
}

//topページ
// r.GET("/", controller.ReadAllVtubersAndMovies)                   //動作ok
// r.GET("/vtuber=[id]", controller.ReadAllVtubersAndMovies)        //未 ver. 1.0の最後
// r.GET("/vtuber=[id]/movies", controller.ReadAllVtubersAndMovies) //未 ver. 1.0の最後
// r.GET("/sings", controller.ReadAllSings)                         //動作ok

// // メインコンテンツのCRUD　/vtuber, /movie, /karaokeはフロント側で比較演算に使われてる
// // データ新規登録
// r.POST("/create/vtuber", controller.CreateVtuber)       //動作ok
// r.POST("/create/movie", controller.CreateMovie)         //動作ok
// r.POST("/create/karaoke", controller.CreateKaraokeSing) //動作ok
// r.POST("/create/song", controller.CreateSong)           //未　ver1.5かな

// //データ編集
// r.POST("/edit/vtuber", controller.EditVtuber)       //動作ok
// r.POST("/edit/movie", controller.EditMovie)         //動作ok
// r.POST("/edit/karaoke", controller.EditKaraokeSing) //動作ok
// r.POST("/edit/song", controller.EditSong)           //未　ver1.5かな

// // データ削除(物理)
// r.DELETE("/delete/vtuber", controller.DeleteVtuber)       //動作ok
// r.DELETE("/delete/movie", controller.DeleteMovie)         //動作ok
// r.DELETE("/delete/karaoke", controller.DeleteKaraokeSing) //動作ok
// r.DELETE("/delete/song", controller.DeleteSong)           //未　ver1.5かな

// //ドロップダウン用
// r.GET("/getvtuber", controller.ReadAllVtubersName)               //動ok
// r.POST("/getmovie", controller.ReadMovieTitlesOfTheVTuber)       //動ok
// r.POST("/getkaraokelist", controller.ReadKaraokeListsOfTheMovie) //動ok
// r.POST("/getsong", controller.ReadAllSongs)                      //動作ok
// r.GET("/getalldate", controller.ReadAllDate)                     //未

// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
// CallGetMemberProfile(r) //未

// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
// r.GET("/envpass", postrequest.EnvPass)
