package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/infra"
)

func main() {
	r := gin.Default()
	r.Use(requestLogger()) //開発用。本番稼動時はコメントアウトする。
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost", "https://localhost",
			"http://v-karaoke.com", "https://v-karaoke.com",
			"http://backend.v-karaoke.com", "https://backend.v-karaoke.com",
		},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Cookie"},
		AllowCredentials: true,
	}))

	fmt.Println("hallow api server in AWS 02.20")

	infra.Routing(r)

	r.Run(":8080")
}

func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Printf("Method: %s, Path: %s, Header: %v\n, , Body: %v\n", c.Request.Method, c.Request.URL.Path, c.Request.Header, c.Request.Body)
		c.Next()
	}
}
