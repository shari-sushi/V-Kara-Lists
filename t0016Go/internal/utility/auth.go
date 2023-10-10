package utility

//"github.com/sharin-sushi/0022loginwithJWT/internal/utility"

import (
	// "database/sql"

	"fmt"
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

func init() {
	user := os.Getenv("MYSQL_USER")
	pw := os.Getenv("MYSQL_PASSWORD")
	db_name := os.Getenv("MYSQL_DATABASE")

	var path string = fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s?charset=utf8&parseTime=true", user, pw, db_name)
	// sqlへ接続するための文字列の生成
	var err error

	// fmt.Printf("%s\n%s\n", path, err)

	Db, err = gorm.Open(mysql.Open(path), &gorm.Config{})
	Db = Db.Debug()
	if err != nil {
		panic("failed to connect database")

	}
	if Db == nil {
		panic("failed to connect database")

	} //このif Db文消したい意味的に重複してる

	fmt.Printf("path=%s\n, err=%s\n", path, err)
	// checkConnect(1)
	// defer Db.Close()
}

// 会員登録
// func CalltoSignUpHandler(){
// 	h := Handler()
// 	a := h.Handler(c)
// }

// func CalltoSignUpHandler(r *gin.RouterGroup, h *controllers.Handler) {
//     auth := r.group("/auth")
//     {
//         auth.POST("/signup", h.SignUpHandler)
//     }
// }
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
		"message":      "Successfully loggined",
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
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid listener_id format in token"})
				return 0, err
			}
			listenerId = int(listenerIdFloat)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "listener_id not found in token"})
			return 0, err
		}
	}
	return listenerId, err
	// tokenString, err := c.Cookie("auth-token")
	// if err != nil {
	// 	return 0, err
	// }

	// token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
	// 	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
	// 		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	// 	}
	// 	return []byte(os.Getenv("SECRET_KEY")), nil
	// })
	// if err != nil {
	// 	return 0, err
	// }

	// if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
	// 	idValue := claims["id"] // ここはJWTのペイロード構造に応じて適切に変更する必要があります
	// 	if id, ok := idValue.(int); ok {
	// 		return id, nil
	// 	}
	// 	return 0, errors.New("ID is not an integer in the token")
	// }

	// return 0, errors.New("Invalid token")
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
		"message": "Successfully Logout",
	})
}

// var signUpInput types.EntryMember
// var signUpInput types.EntryMember
// tokenString, err := c.Cookie("token")

// memberInfo := Member{
// 	MemberName: m.MemberName,
// 	Email:      m.Email,
// 	Password:   crypto.PasswordEncryptNoBackErr(m.Password),
// }
// signUpInput =
// memberInfo, _ = types.FindUserByMemberId(h.DB, signUpInput.MemberId) //メアドが未使用ならnil

// cookieのtokenからIdを取得
// idからmemberInfo Member型を取得
// responsにぶちこんで返す
