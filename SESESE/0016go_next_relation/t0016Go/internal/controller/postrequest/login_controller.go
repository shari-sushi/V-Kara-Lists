package postrequest

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/sharin-sushi/0016go_next_relation/internal/controller/model"
	"github.com/sharin-sushi/0016go_next_relation/internal/types"
)

// /signup
func PostSignup(c *gin.Context) {

	// なにこれ
	// // var userinfo types.User
	// var json types.UserInfoFromFront
	// if err := c.ShouldBindJSON(&json); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }
	// //r.BodyがHTTPリクエストのボディを参照し、&userinfoに格納
	// fmt.Printf("r.Bodyの処理完了し、userinfo=%v", userinfo)
	// c.JSON(http.StatusOK, gin.H{"str": json.FieldStr, "int": json.FieldInt, "bool": json.FieldBool})

	// GPTより、
	// func SomeHandler(c *gin.Context) {
	// 	loggedIn, err := c.Cookie("loggedIn")
	// 	if err != nil {
	// 		// クッキーが存在しない場合の処理
	// 		return
	// 	}

	// 	if loggedIn == "true" {
	// 		// ログインしている場合の処理
	// 	} else {
	// 		// ログインしていない場合の処理
	// 	}
	// }
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
	type test struct {
		csrfToken string
		types.Member
	}

	var form test
	if c.ShouldBind(&form) != nil {
		c.JSON(401, gin.H{"status": "ログイン情報の送信に失敗しました"})
		// if form.MemberName == "user" && form.Password == "password" { //書き方間違えてない？正しくはその時のセッションから取得して比較する？目的がわからん。
		// 	c.JSON(200, gin.H{"status": "ログイン済み"})
		// } else {
		// 	// c.JSON(401, gin.H{"status": "unauthorized"}) //動作確認ok
		// }
	}
	// fmt.Printf("bitしたform=%v \n", form)

	sessionID := generateSessionID()
	fmt.Printf("sessionID=%v \n", sessionID)
	c.SetCookie("LoginCookie", sessionID, 3600, "/", "localhost", false, true) //最後のとこ　HttpOnly trueならフロントで読み取れない
	// POSTMANでCookieにセットされていること確認ok
	fmt.Printf("bind内容:crsfToken=%v \n", form.csrfToken)

	fmt.Printf("bind内容:ID=%v, name=%v, mail=%v, pass=%v, crat%v \n", form.MemberId, form.MemberName, form.Email, form.Password, form.CreatedAt)
	//ここまでは処理確認ok
	member, err := model.Login(form.MemberName, form.Password)
	if err != nil {
		c.Redirect(301, "/login")
		return
	}
	fmt.Printf("DBから取得した情報=%+v \n ", member) //%vでも%sでも L1[GIN]
	sessionManage(c, *member)

	// フロント側の仕様
	//サーバーがJSON形式のレスポンスを返し、その中に
	///authenticated というフィールドが含まれていることを仮定している？
	// true であれば認証成功

	responseData := gin.H{
		"status":     "ok",
		"logined":    "authenticated",
		"message":    "Login successful",
		"memberId":   member.MemberId,
		"memberName": member.MemberName,
	}
	fmt.Println(responseData)
	c.JSON(200, responseData)
}

func PostLogout(c *gin.Context) {
	session := sessions.Default(c)
	log.Println("セッション取得")
	session.Clear()
	log.Println("クリア処理")
	session.Save()
}

//SessionManager.go　　セッション生成(alive, ID, 名前)
func sessionManage(g *gin.Context, user types.Member) {
	session := sessions.Default(g) //現在のセッションを取得
	session.Set("alive", true)     //取得したセッションに値を設定
	session.Set("memberID", user.MemberId)
	session.Set("memberName", user.MemberName)
	err := session.Save() //セッションの変更を保存

	if err != nil {
		log.Printf("Error saving session: %v", err)
	}
}

func generateSessionID() string {
	b := make([]byte, 16) // 16バイトのランダムデータを生成
	rand.Read(b)

	return hex.EncodeToString(b)

}

// sessionおくる…？　ChatGPTから教えてもらったけど、やってるこは現状とほぼ一緒なんだよな多分
//  http.SetCookie(c.Writer, &cookie)は既現状にない？
// func HandleLogin(c *gin.Context) {
//     // セッションデータをセット
//     SetSessionCookie(c, "memberID", user.MemberId)
//     SetSessionCookie(c, "memberName", user.MemberName)
//     // ログイン後の処理
// }
// func SetSessionCookie(c *gin.Context, key string, value string) {
//     cookie := http.Cookie{
//         Name:     key,
//         Value:    value,
//         Path:     "/",
//         Domain:   "localhost", // ドメインを適切に設定
//         MaxAge:   3600,        // クッキーの有効期限を設定（秒単位）
//         HttpOnly: true,        // JavaScriptからアクセス不可にする→falseなら読み取れる？
//     }
//     http.SetCookie(c.Writer, &cookie)
// }

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
