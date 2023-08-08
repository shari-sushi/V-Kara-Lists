package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sharin-sushi/0016go_next_relation/t0016Go/internal/crud"
)

func main() {
	r := mux.NewRouter()
	// 新しいルーターの呼び出し

	r.HandleFunc("/", crud.Index).Methods("GET")
	r.HandleFunc("/show", crud.Show).Methods("GET")
	r.HandleFunc("/create", crud.Create).Methods("POST")
	r.HandleFunc("/edit", crud.Edit).Methods("PUT")
	r.HandleFunc("/delete", crud.Delete).Methods("DELETE")

	// r.HandleFunc("/path", AAA.Aa).Methods("hoge")
	// hogeリクエストが"/path"に来た時にAAA.Aa関数が呼び出される

	handler := cors.Default().Handler(r)

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
