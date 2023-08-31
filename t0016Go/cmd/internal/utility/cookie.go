package utility

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetCookie(c *gin.Context) {
	cookie, err := c.Cookie("gin_cookie")

	if err != nil {
		cookie = "NotSet"
		c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
	}

	fmt.Printf("Cookie value: %s \n", cookie)
}

//SetCookie(name, value string, maxAge int(秒), path, domain string, secure, httpOnly bool)
// 属性値	：送受信コンテキスト
// None		：全て（cross-siteを許可する）
// Strict	：ファーストパーティ
// Lax		：トップレベル ナビゲーション
