package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/sharin-sushi/0016go_next_relation/t0016Go/internal/article"
)

func main() {
	r := mux.NewRouter()
	// 新しいルーターの呼び出し

	//歌情報のCRUD
	r.HandleFunc("/", article.Index).Methods("GET")
	r.HandleFunc("/show", article.Show).Methods("GET")
	r.HandleFunc("/create", article.Create).Methods("GET", "POST")
	// r.HandleFunc("/posts", article.Edit).Methods("GET")
	r.HandleFunc("/edit", article.Edit).Methods("GET", "POST")
	// r.HandleFunc("/posts/{id:[0-9]+}", article.Edit).Methods("GET")
	r.HandleFunc("/delete", article.Delete).Methods("DELETE")

	// r.HandleFunc("/path", AAA.Aa).Methods("hoge")
	// hogeリクエストが"/path"に来た時にAAA.Aa関数が呼び出される

	// //会員登録とログイン
	// r.HandleFunc("/api/signup", utility.SignUp).Methods("POST")
	// r.HandleFunc("/api/login", utility.LogIn).Methods("POST")

	handler := cors.Default().Handler(r)

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
