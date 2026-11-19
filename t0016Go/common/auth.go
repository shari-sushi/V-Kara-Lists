package common

import (
	"fmt"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/sharin-sushi/0016go_next_relation/domain"

	validation "github.com/go-ozzo/ozzo-validation"
)

func SetListenerIdIntoCookie(c *gin.Context, ListenerId domain.ListenerId) (err error) {
	var token string
	token, err = GenerateToken(int(ListenerId))
	if err != nil {
		return
	}
	hostDomain := GetEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    token,
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   int(authTokenLifetime.Seconds()),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(c.Writer, cookie)
	return
}

func UnsetAuthCookie(c *gin.Context) (err error) {
	hostDomain := GetEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    "",
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(c.Writer, cookie)
	return
}

func TakeListenerIdFromJWT(c *gin.Context) (domain.ListenerId, error) {
	// TODO err処理
	tokenString, _ := c.Cookie("auth-token")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		return 0, err
	}

	var listenerId int
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if val, exists := claims["listener_id"]; exists {
			listenerIdFloat, ok := val.(float64) // JSON numbers are float64
			if !ok {
				return 0, fmt.Errorf("Invalid listener_id format in token")
			}
			listenerId = int(listenerIdFloat)
		} else {
			return 0, fmt.Errorf("token has no Listener Id")
		}
	}
	// TODO err分岐処理する

	// TODO 早期リターンさせる
	return domain.ListenerId(listenerId), err
}

// JWTとCookieの有効期限を揃えるため共通で使う
const authTokenLifetime = 7 * 24 * time.Hour

func GenerateToken(ListenerId int) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	claims := jwt.MapClaims{
		"listener_id": ListenerId,
		"exp":         time.Now().Add(authTokenLifetime).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

const (
	signupPasswordMinLength = 8
	loginPasswordMinLength  = 4
	// bcryptは72バイトを超えるとエラーになるため、それ以下に収める
	passwordMaxLength = 64
)

// スペース(0x20)〜チルダ(0x7E)。制御文字・マルチバイト文字を除外する
var printableASCIIPattern = regexp.MustCompile(`^[\x20-\x7E]+$`)

func ValidateSignup(m *domain.Listener) error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is required"),
			validation.Length(2, 20).Error("Name needs 2 ~ 20 chars"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			// TODO: ちゃんとしたメアドのバリデーションを実装する
			validation.Length(10, 100).Error("Email needs 10 ~ 100 chars"),
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(signupPasswordMinLength, passwordMaxLength).Error("Password needs 8 ~ 64 chars"),
			validation.Match(printableASCIIPattern).Error("Password must consist of printable ASCII characters"),
		),
	)
	return err
}

// 旧ルール(4〜20文字)で登録済みのユーザーもログインできるよう、下限は新規登録より緩くする
func ValidateLogin(m *domain.Listener) error {
	return validation.ValidateStruct(m,
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(loginPasswordMinLength, passwordMaxLength).Error("Password needs 4 ~ 64 chars"),
		),
	)
}
