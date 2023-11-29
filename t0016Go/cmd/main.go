package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/infra"
)

func main() {
	r := gin.Default()
	r.Use(requestLogger()) //開発用。本番環境ではコメントアウトする。
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://localhost", "http://localhost"},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Cookie"},
		AllowCredentials: true,
	}))

	infra.Routing(r)

	r.Run(":8080")
	// r.RunTLS(":8080", "../../key/server.pem", "../../key/server_unencrypted.key")
}

func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Printf("Method: %s, Path: %s, Header: %v\n, , Body: %v\n", c.Request.Method, c.Request.URL.Path, c.Request.Header, c.Request.Body)
		c.Next()
	}
}
