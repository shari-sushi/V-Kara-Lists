package utility

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetCookiefunc(c *gin.Context) {
	cookie, err := c.Cookie("gin_cookie")

	if err != nil {
		cookie = "NotSet"
		c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
	}
	//SetCookie(name, value string(秒), maxAge int, path, domain string, secure, httpOnly bool)

	fmt.Printf("Cookie value: %s \n", cookie)
}
