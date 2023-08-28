package postrequest

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/controller/model"
)

func PostSignup(c *gin.Context) {

	//要対応ーーーーーーーーーーーーーー
	id := c.PostForm("user_id")
	pw := c.PostForm("password")
	// fmt.Printf("id=%v, pw=%v \n", id, pw)
	user, err := model.Signup(id, pw)
	fmt.Printf("user=%v, err=%v \n", user, err)

	if err != nil {
		c.Redirect(301, "/signup")
		return
	}

	//要対応ーーーーーーーーーーーーーーーーー
	c.HTML(http.StatusOK, "home.html", gin.H{"user": user})
}

func PostLogin(c *gin.Context) {
	id := c.PostForm("user_id")
	pw := c.PostForm("password")
	fmt.Println("初期値 id=", id, "pw=", pw)
	user, err := model.Login(id, pw)
	if err != nil {
		c.Redirect(301, "/login")
		return
	}
	c.HTML(http.StatusOK, "home.html", gin.H{"user": user})
}
