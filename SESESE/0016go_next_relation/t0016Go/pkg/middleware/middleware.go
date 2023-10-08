package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0022loginwithJWT/t0022Go/internal/utility/token"
)

func AuthMiddleware(c *gin.Context) {
	fmt.Printf("middleware中 \n")

	tokenString, err := c.Cookie("auth-token")
	fmt.Printf("tokenString=%v \n", tokenString)

	if err != nil {
		fmt.Printf("err=%v \n", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		c.Abort()
		return
	}

	token, err := token.ParseToken(tokenString) //tokenどうするの？err==nilならokってこと？
	fmt.Printf("token=%v \n", token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid token",
		})
		c.Abort()
		return
	}

	fmt.Printf("解析したauth-token= %v \n", token)
	c.Next()
}
