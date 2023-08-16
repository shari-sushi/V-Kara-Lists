package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sharin-sushi/0016go_next_relation/internal/crud"
)

func main() {
	r := mux.NewRouter()
	// 新しいルーターの呼び出し

	//歌情報のCRUD
	r.HandleFunc("/", crud.Index).Methods("GET")
	r.HandleFunc("/show", crud.Show).Methods("GET")
	r.HandleFunc("/create", crud.Create).Methods("GET", "POST")
	r.HandleFunc("/edit", crud.Edit).Methods("GET", "POST")
	r.HandleFunc("/delete", crud.Delete).Methods("DELETE")
	r.HandleFunc("/newfunc", crud.Join).Methods("GET")

	// r.HandleFunc("/path", AAA.Aa).Methods("hoge")
	// hogeリクエストが"/path"に来た時にAAA.Aa関数が呼び出される

	// //会員登録とログイン
	// r.HandleFunc("/api/signup", utility.SignUp).Methods("POST")
	// r.HandleFunc("/api/login", utility.LogIn).Methods("POST")

	// r.HandleFunc("/login", login.Hash).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "DELETE"},
	})
	handler := c.Handler(r)

	// handler := cors.Default().Handler(r)

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
