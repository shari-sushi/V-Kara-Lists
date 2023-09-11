package utility

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// mainに
// store := cookie.NewStore([]byte("OimoMochiMochIimoMochiOimo"))
// を書いたので↓のコードは不要になったと思う。念のため残しておくが
//
//

func GetCookie(c *gin.Context) {
	cookie, err := c.Cookie("shariSiteSession") //最初"gin_cookie"だった

	if err != nil {
		cookie = "NotSet"
		c.SetCookie("shariSiteSession", "test", 3600, "/", "localhost", false, true)
	}

	fmt.Printf("Cookie value: %s \n", cookie)
}

//　↓SetCookie説明メモ
//SetCookie(name, value string, maxAge int(秒), path, domain string, secure, httpOnly bool)
// 属性値	：送受信コンテキスト
// None		：全て（cross-siteを許可する）
// Strict	：ファーストパーティ
// Lax		：トップレベル ナビゲーション
