package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
	"github.com/sharin-sushi/0016go_next_relation/internal/controller/postrequest"
	"github.com/sharin-sushi/0016go_next_relation/internal/crud"
)

func main() {
	r := gin.Default()

	//配信者
	r.GET("/", crud.GetAllStreamers)
	r.POST("/", crud.PostStreamer)
	r.PUT("/", crud.PutStreamer)
	r.DELETE("/", crud.DeletetStreamer)

	//動画
	r.GET("/movie", crud.ReadMovies) //まだ何も書いてない

	//歌
	r.GET("/sing", crud.ReadSings)

	//ログイン、サインナップ ※リンクは"/"に有り
	r.POST("/signup", postrequest.PostSignup)
	r.POST("/login", postrequest.PostLogin)

	// r.POST("/create", crud.Create)
	// r.GET("/edit", crud.Edit)
	// r.POST("/edit", crud.Edit)
	// r.DELETE("/delete", crud.Delete)
	// r.GET("/newfunc", crud.Join)
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

// // ーーー↓素のGoーーーー
// func main() {
// 	r := mux.NewRouter()
// 	// 新しいルーターの呼び出し

// 	//旧CRUD　歌情報
// 	// r.HandleFunc("/", crud.Index).Methods("GET")
// 	// r.HandleFunc("/show", crud.Show).Methods("GET")
// 	// r.HandleFunc("/create", crud.Create).Methods("GET", "POST")
// 	// r.HandleFunc("/edit", crud.Edit).Methods("GET", "POST")
// 	// r.HandleFunc("/delete", crud.Delete).Methods("DELETE")

// 	//新CRUD
// 	r.HandleFunc("/newtop", crud.ReadAllData).Methods("GET")

// 	// r.HandleFunc("/path", AAA.Aa).Methods("hoge")
// 	// hogeリクエストが"/path"に来た時にAAA.Aa関数が呼び出される

// 	// //会員登録とログイン
// 	// r.HandleFunc("/api/signup", userList.SignUp).Methods("GET", "POST")
// 	// r.HandleFunc("/api/login", userList.LogIn).Methods("GET")

// 	// r.HandleFunc("/login", login.Hash).Methods("DELETE")

// 	c := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:3000"},
// 		AllowCredentials: true,
// 		AllowedMethods:   []string{"GET", "POST", "DELETE"},
// 	})
// 	handler := c.Handler(r)

// 	// handler := cors.Default().Handler(r)

// 	if err := http.ListenAndServe(":8080", handler); err != nil {
// 		log.Fatal("ListenAndServe:", err)
// 	}

// }
