package postrequest

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/controller/model"
	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/types"
)

// /signup
func PostSignup(c *gin.Context) {
	var form types.Member

	//loginのやつコピペしたので、要修正
	if c.ShouldBind(&form) == nil {
		if form.MemberName == "user" && form.Password == "password" {
			c.JSON(200, gin.H{"status": "you are logged in"})
		} else {
			c.JSON(401, gin.H{"status": "unauthorized"})
		}
	}

	// c.JSON(http.StatusOK, gin.H{
	// 	"userinfo":    data,
	// })

	//要対応ーーーーーーーーーーーーーー
	id := c.PostForm("user_id")
	pw := c.PostForm("password")
	acn := c.PostForm("accname")
	eml := c.PostForm("email")

	// id := "L2"
	// pw := ""
	// acn := "name"
	// eml :=

	// fmt.Printf("id=%v, pw=%v \n", id, pw)
	user, err := model.Signup(id, pw, acn, eml)
	fmt.Printf("user=%v, err=%v \n", user, err)

	if err != nil {
		c.Redirect(301, "/signup")
		return
	}

	//要対応ーーーーーーーーーーーーーーーーー
	c.HTML(http.StatusOK, "home.html", gin.H{"user": user})
}

// "/login"

func PostLogin(c *gin.Context) {

	var form types.Member
	// if c.ShouldBind(&form) == nil {
	// 	if form.MemberName == "user" && form.Password == "password" {
	// 		c.JSON(200, gin.H{"status": "you are logged in"})
	// 	} else {
	// 		c.JSON(401, gin.H{"status": "unauthorized"})
	// 	}
	// }
	c.ShouldBind(&form)
	fmt.Printf("bindできたかな→ID=%v, name=%v, mail=%v, pass=%v, crat%v", form.MemberId, form.MemberName, form.Email, form.Password, form.CreatedAt)

	member, err := model.Login(form.MemberName, form.Password)
	if err != nil {
		c.Redirect(301, "/login")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"memberinfo": member,
	})
}

//SessionManager.go　　セッション生成
func SessionManage(g *gin.Context, user DBManager.DBUsers) {
	session := sessions.Default(g)
	session.Set("alive", true)
	session.Set("memberID", user.ID)
	session.Set("memberName", user.NickName)
	session.Save()
}

// //Cookie まだサイトのコピペ
// func handler(w http.ResponseWriter, r *http.Request) {
// 	// cookieの設定
// 	expiration := time.Now()
// 	expiration = expiration.AddDate(0, 0, 1)
// 	cookie := http.Cookie{Name: "username", Value: "golang", Expires: expiration}
// 	http.SetCookie(w, &cookie)
// 	// クライアントからきたリクエストに埋め込まれているcookieの確認
// 	for _, c := range r.Cookies() {
// 		log.Print("Name:", c.Name, "Value:", c.Value)
// 	}

// 	if err := t.Execute(w, nil); err != nil {
// 		log.Printf("failed to execute template: %v", err)
// 	}
// }

// func EnvPass(c *gin.Context) {
// 	q := c.Query("pass")
// 	password := "L1"

// 	//↑にハードコード
// 	encryptPw1, _ := crypto.PasswordEncrypt(password)
// 	// postmanでurlに記入http://localhost:8080/signup/envpass?pass=
// 	encryptPw2, _ := crypto.PasswordEncrypt(q)

// 	// if err1 != nil {
// 	// 	fmt.Println("パスワード暗号化処理でエラー発生：", err1)
// 	// 	return nil, err1
// 	// }
// 	// if err2 != nil {
// 	// 	fmt.Println("パスワード暗号化処理でエラー発生：", err2)
// 	// 	return nil, err2
// 	// }
// 	fmt.Printf("ハードコートでは%v → %v, \n", password, encryptPw1)
// 	fmt.Printf("クエリのは %v → %v, \n", q, encryptPw2)

// }
