package utility

//"github.com/sharin-sushi/0022loginwithJWT/internal/utility"

import (
	// "database/sql"

	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"

	// "time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-jwt/jwt"
	"github.com/sharin-sushi/0016go_next_relation/internal/controller/crypto"
	"github.com/sharin-sushi/0016go_next_relation/internal/types"
	"github.com/sharin-sushi/0016go_next_relation/internal/utility/token"
	"github.com/sharin-sushi/0016go_next_relation/pkg/middleware"

	// "github.com/sharin-sushi/0022loginwithJWT/t0022Go/pkg/middleware"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// var DbGo *sql.DB
var Db *gorm.DB

type Handler struct {
	DB *gorm.DB
}

func GetDB() *gorm.DB {
	return Db
}

func InitDb() {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	// db_name := os.Getenv("MYSQL_DATABASE")
	db_name := "migration_test" //test用
	path := fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s?charset=utf8&parseTime=true", user, pw, db_name)

	var err error
	Db, err = gorm.Open(mysql.Open(path), &gorm.Config{})
	Db = Db.Debug()
	if err != nil {
		panic("failed to connect database")
	}

	fmt.Printf("path=%s\n, err=%s\n", path, err)
	// checkConnect(1)
	// defer Db.Close()
}

func migration() {
	Db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(
		// User
		types.Listener{},
		// Like Relatoin
		types.FavoritePost{}, types.Follow{},
		// Vtuber Contents
		types.KaraokeList{}, types.Movie{}, types.Vtuber{}, types.OriginalSong{},
	)
}

// 会員登録
func CalltoSignUpHandler(c *gin.Context) {
	h := Handler{DB: Db}
	h.SignUpHandler(c)
}

func (h *Handler) SignUpHandler(c *gin.Context) {
	var user types.Listener
	err := c.ShouldBind(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたuser = %v \n", user)

	err = user.ValidateSignup()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	existingUser, _ := types.FindUserByEmail(h.DB, user.Email) //メアドが未使用ならnil
	fmt.Printf("existingUser= %v \n", existingUser)
	// ↓既存アカがあった際に、処理停止してくれるけど、c.JSONとfmt.Printはしてくれない、、、。
	if existingUser.ListenerId != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "the E-mail address already in use",
		})
		return
	}

	//passwordの照合
	user.Password = crypto.EncryptPasswordWithoutBackErr(user.Password)

	result := Db.Select("listener_name", "email", "password").Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": result.Error,
		})
		return
	}

	// IdをJWT化しCookieにセット
	trigerSetCookiebyUserAuth(c, user.ListenerId)

	c.JSON(http.StatusOK, gin.H{
		// "memberId":   newMember.ListenerId,
		// "memberName": newMember.ListenerName,
		"message": "Successfully created user, and logined",
	})
}

//ログイン
func CalltoLogInHandler(c *gin.Context) {
	h := Handler{DB: Db}
	h.LoginHandler(c)
}
func (h *Handler) LoginHandler(c *gin.Context) {
	var loginInput types.Listener
	if err := c.ShouldBind(&loginInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "Invalid request body",
		})
		return
	}

	user, err := types.FindUserByEmail(h.DB, loginInput.Email) //メアドが未登録なら err = !nil
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "the E-mail address id NOTalready in use",
		})
		return
	}

	CheckPassErr := crypto.CompareHashAndPassword(user.Password, loginInput.Password) //pass認証
	if CheckPassErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Password is invalid",
		})
		return
	}
	fmt.Printf("ChechkPassErr=%v \n", CheckPassErr)

	// IdをJWT化しCookieにセット
	trigerSetCookiebyUserAuth(c, user.ListenerId)

	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Logged In",
		"listenerId":   user.ListenerId,
		"listenerName": user.ListenerName,
	})
}

// IdをJWT化しCookieにセット。ログイン、サインイン時に呼び出される。
func trigerSetCookiebyUserAuth(c *gin.Context, ListenerId int) {
	// Token発行　＝　JWTでいいのかな？
	token, err := token.GenerateToken(ListenerId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to sign up",
		})
		return
	}
	// Cookieにトークンをセット
	cookieMaxAge := 60 * 60 * 12
	// c.SetCookie("token", token, cookieMaxAge, "/", "localhost", false, true)
	// c.SetCookie("token", token, cookieMaxAge, "/", "", false, false)

	cookie := &http.Cookie{
		Name: "auth-token",
		// Name:     "next-auth.session-token",
		Value:    token,
		Path:     "/",
		Domain:   "localhost",
		MaxAge:   cookieMaxAge,
		HttpOnly: true,
		Secure:   true, //httpsの環境ではtrueにすること。
		SameSite: http.SameSiteNoneMode,
		// 	SameSite: http.SameSiteLaxMode, //c.SetCookieでは設定不可かも。デフォだとLax。Strict, Lax, Noneの3択。

	}
	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v /n", cookie)
}

// mainにてmiddleware管理
func CallGetMemberProfile(r *gin.Engine) {
	h := &Handler{
		DB: GetDB(),
	}

	fmt.Printf("middleware直前 \n")
	users := r.Group("/users")
	users.Use(middleware.AuthMiddleware) // middlewareを設定
	{
		users.GET("/profile", h.GetListenerProfile) // ログイン中のユーザー情報を取得 動作確認ok
	}

	cud := r.Group("/cud") //CRUDのread以外
	cud.Use(middleware.AuthMiddleware)
	{
		users.POST("create", h.GetListenerProfile) // 未定
		users.POST("delete", h.GetListenerProfile) // 未定
		users.POST("update", h.GetListenerProfile) // 未定
	}
}

// JWTからlistenerIdを取得。なお、コードの理解度低い。
func TakeListenerIdFromJWT(c *gin.Context) (int, error) {
	tokenString, _ := c.Cookie("auth-token")
	// tokenString, _ := c.Cookie("next-auth.session-token")　不要

	// token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return 0, err
	}
	fmt.Printf("token= %v \n", token)

	var listenerId int
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if val, exists := claims["listener_id"]; exists {
			// JSON numbers are float64

			listenerIdFloat, ok := val.(float64)
			if !ok {
				// c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid listener_id format in token"})
				// err == nil
				return 0, fmt.Errorf("Invalid listener_id format in token")
			}
			listenerId = int(listenerIdFloat)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "listener_id not found in token"})
			return 0, err
		}
	}
	return listenerId, err
}

// /users/profile
func (h *Handler) GetListenerProfile(c *gin.Context) {
	tokenLId, err := TakeListenerIdFromJWT(c)

	ListenerInfo, err := types.FindUserByListenerId(h.DB, tokenLId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching listener info"})
		return
	}

	fmt.Printf("ListenerInfo = %v \n", ListenerInfo)

	c.JSON(http.StatusOK, gin.H{
		"ListenerId":   ListenerInfo.ListenerId,
		"ListenerName": ListenerInfo.ListenerName,
		"CreatedAt":    ListenerInfo.CreatedAt,
		"UpdatedAt":    ListenerInfo.UpdatedAt,
		"Email":        "secret",
		"Password":     "secret",
		"message":      "got urself infomation",
	})
}

// ログアウト
func LogoutHandler(c *gin.Context) {
	fmt.Print("LogoutHandlerの中")
	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Logged Out",
	})
}

// 退会 論理削除。その期限後削除、途中復活はまだ記述してない。
// ******稼働確認したら物理削除になった********
// func Withdrawal(c *gin.Context) {
// 	tokenLId, err := TakeListenerIdFromJWT(c)
// 	fmt.Printf("tokenLId = %v \n", tokenLId)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "Invalid ListenerId of token",
// 			"err":     err,
// 		})
// 		return
// 	}
// 	var dummyLi types.Listener
// 	result := Db.Model(&dummyLi).Where("Listener_id = ? ", tokenLId).Delete(dummyLi)
// 	if result.Error != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "Invalid Withdrawn",
// 			"err":     result.Error,
// 		})
// 		return
// 	}
// 	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Successfully Withdrawn",
// 	})
// }

// lister_id = 3 はゲストアカウントにつき、退会不可。
func Withdrawal(c *gin.Context) {
	tokenLId, err := TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId == 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "ゲストアカウントは退会できません。",
		})
		return
	}
	var dummyLi types.Listener
	dummyLi.ListenerId = tokenLId
	result := Db.Delete(&dummyLi)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Withdrawn",
			"err":     result.Error,
		})
		return
	}
	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn",
	})
}

// lister_id = 3, listener_name = guest
func GestlogIn(c *gin.Context) {
	trigerSetCookiebyUserAuth(c, 3)
	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Guest Logged In",
		"listenerId":   "3",
		"listenerName": "guest",
	})
}

type LineOfLog struct {
	RemoteAddr  string
	ContentType string
	Path        string
	Query       string
	Method      string
	Body        string
}

var TemplateOfLog = `
Remote address:   {{.RemoteAddr}}
Content-Type:     {{.ContentType}}
HTTP method:      {{.Method}}

path:
{{.Path}}

query string:
{{.Query}}

body:             
{{.Body}}

`

//httpリクエストの中身をログに出力しようとして、やめた残がい。
func Log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		bufbody := new(bytes.Buffer)
		bufbody.ReadFrom(r.Body)
		body := bufbody.String()

		line := LineOfLog{
			r.RemoteAddr,
			r.Header.Get("Content-Type"),
			r.URL.Path,
			r.URL.RawQuery,
			r.Method, body,
		}
		tmpl, err := template.New("line").Parse(TemplateOfLog)
		if err != nil {
			panic(err)
		}

		bufline := new(bytes.Buffer)
		err = tmpl.Execute(bufline, line)
		if err != nil {
			panic(err)
		}

		log.Printf(bufline.String())
		handler.ServeHTTP(w, r)
	})
}
