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
	var signUpInput types.EntryMember
	err := c.ShouldBind(&signUpInput)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたsignUpInput = %v \n", signUpInput)

	existingUser, _ := types.FindUserByEmail(h.DB, signUpInput.Email) //メアドが未使用ならnil
	if existingUser.MemberId != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "the E-mail address already in use",
		})
		return
	}

	member := &types.Member{
		MemberName: signUpInput.MemberName,
		Password:   signUpInput.Password,
		Email:      signUpInput.Email,
	}

	err = member.Validate()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	newMember, err := member.CreateMember(h.DB) //Member構造体の型で新規発行したIDと共にユーザー情報を返す
	if err != nil {
		fmt.Printf("新規idのerr= %v \n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create user or find user after it",
		})
		return
	}
	fmt.Printf("新規id=%v \n", newMember)
	//ここまで動作確認ok

	// Token発行　＝　JWTでいいのかな？
	token, err := token.GenerateToken(newMember.MemberId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to sign up",
		})
		return
	}

	// Cookieにトークンをセット
	cookieMaxAge := 60 * 60 * 12 //12h
	c.SetCookie("token", token, cookieMaxAge, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"memberId":   newMember.MemberId,
		"memberName": newMember.MemberName,
		"message":    "Successfully created user, and logined",
	})
}

//ログイン
func CalltoLogInHandler(c *gin.Context) {
	h := Handler{DB: Db}
	h.LoginHandler(c)
}
func (h *Handler) LoginHandler(c *gin.Context) {
	var loginInput types.Member
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

	// Token発行　＝　JWTでいいのかな？
	token, err := token.GenerateToken(user.MemberId)
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
		// SameSite: http.SameSiteStrictMode,	//Secure falseと併用でダメだった
		SameSite: http.SameSiteNoneMode, //Secure falseと併用でダメだった
		// SameSite: http.SameSiteLaxMode, //Secure falseと併用でダメだった
		// 	SameSite: http.SameSiteLaxMode, //c.SetCookieでは設定不可かも。デフォだとLax。Strict, Lax, Noneの3択。

	}
	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v /n", cookie)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Successfully loggined",
		"memberId":   user.MemberId,
		"memberName": user.MemberName,
	})
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
		users.GET("/profile", h.GetMemberProfile) // ユーザー一覧を取得
	}

	cud := r.Group("/cud") //CRUDのread以外
	cud.Use(middleware.AuthMiddleware)
	{
		users.POST("create", h.GetMemberProfile) // ユーザー一覧を取得
		users.POST("delete", h.GetMemberProfile) // ユーザー一覧を取得
		users.POST("update", h.GetMemberProfile) // ユーザー一覧を取得
	}
}

// /users/profile
func (h *Handler) GetMemberProfile(c *gin.Context) {
	tokenString, _ := c.Cookie("auth-token")
	// tokenString, _ := c.Cookie("next-auth.session-token")　不要

	fmt.Printf("middleware越えたtokenString= %v \n", tokenString)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	fmt.Printf("token= %v \n", token)

	var memberId string
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		memberId = claims["user_id"].(string)
		fmt.Printf("memberId= %v \n", memberId)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "member_id not found in token"})
			return
		}
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	fmt.Printf("claims後のスコープ外のmemberId= %v \n", memberId)

	memberInfo, err := types.FindUserByMemberId(h.DB, memberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching member info"}) //これが表示された
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"MemberId":   memberInfo.MemberId,
		"MemberName": memberInfo.MemberName,
		"CreatedAt":  memberInfo.CreatedAt,
		"Email":      "secret",
		"Password":   "secret",
		"message":    "get urself infomation",
	})
}

// ログアウト
func LogoutHandler(c *gin.Context) {
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
