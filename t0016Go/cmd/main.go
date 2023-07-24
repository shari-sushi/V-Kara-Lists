package main

import (
	"log"
	"net/http"

	"github.com/sharin-sushi/0016go_next_relation/t0016Go/cmd/internal/article"
)

func main() {
	http.HandleFunc("/", article.Index)
	http.HandleFunc("/show", article.Show)
	http.HandleFunc("/create", article.Create)
	http.HandleFunc("/edit", article.Edit)
	http.HandleFunc("/delete", article.Delete)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
