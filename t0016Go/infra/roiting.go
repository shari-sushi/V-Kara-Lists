package infra

import (
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/internal/crud"
	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

func Routing(r *gin.Engine) {
	initDb()

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
	r.PUT("/login", utility.CalltoLogInHandler)    //動作ok
	r.PUT("/logout", utility.LogoutHandler)        //動作ok だけどフロントで完結しない？まあよしとした。
	r.DELETE("/withdraw", utility.Withdrawal)      //未
	r.DELETE("/????", utility.Withdrawal)          //未 ver.1.5かなぁ	//論理削除後の期限切れ path不要か？
	r.GET("/resignup", utility.Withdrawal)         //未	ver1.5かなぁ	//論理削除中に同じアドレスで再登録
	r.GET("/gestlogin", utility.GestlogIn)         //動作ok

	// /cud/~, /users/~にアクセスした際にmiddlewareでアクセスに認証制限
	CallGetMemberProfile(r) //未

	// //開発者用　パスワード照会（ リポジトリ0019で作り直した）
	// r.GET("/envpass", postrequest.EnvPass)
}
