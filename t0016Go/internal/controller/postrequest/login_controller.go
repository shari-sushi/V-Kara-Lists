package postrequest

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/controller/model"
	"github.com/sharin-sushi/0016go_next_relation/internal/controller/types"
)

func PostSignup(c *gin.Context) {
	// var userinfo types.User
	var json types.UserInfoFromFront
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//r.BodyがHTTPリクエストのボディを参照し、&userinfoに格納
	fmt.Printf("r.Bodyの処理完了し、userinfo=%v", userinfo)
	c.JSON(http.StatusOK, gin.H{"str": json.FieldStr, "int": json.FieldInt, "bool": json.FieldBool})

	fmt.Printf("Editのpostが通り、errはnil\n")

	fmt.Printf("unique_id=%v, movie=%v, url=%v, singStart=%v, song=%v \n", userinfo.Unique_id, userinfo.Movie, userinfo.Url, userinfo.SingStart, userinfo.Song)
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
