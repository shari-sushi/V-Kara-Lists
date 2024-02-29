package common

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/sharin-sushi/0016go_next_relation/domain"

	validation "github.com/go-ozzo/ozzo-validation"
)

var hostDomain string

func getEnvHostDomain() {
	goEnv := os.Getenv("GO_ENV") //ローカルpc上でのみ設定
	isDockerCompose := os.Getenv("IS_DOCKER_COMPOSE")
	if goEnv == "" && isDockerCompose == "" {
		//クラウド環境
		hostDomain = "v-karaoke.com"
	} else if goEnv == "" && isDockerCompose == "true" {
		// ローカルのdocker上(compose使用)
		hostDomain = "localhost"
	} else if goEnv == "development" && isDockerCompose == "" {
		//VSCodeで起動
		hostDomain = "localhost"
	}
}

func SetListenerIdintoCookie(c *gin.Context, ListenerId domain.ListenerId) (err error) {
	var token string
	token, err = GenerateToken(int(ListenerId))
	if err != nil {
		return
	}
	cookieMaxAge := 60 * 60 * 12 * 12 //開発中につき長時間化中
	getEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    token,
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   cookieMaxAge,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode, //本番環境ではNone禁止
	}

	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v \n", cookie)
	return
}

func UnsetAuthCookie(c *gin.Context) (err error) {
	getEnvHostDomain()
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    "",
		Path:     "/",
		Domain:   hostDomain,
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode, //本番環境ではNone禁止
	}

	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v \n", cookie)
	return
}

// コードの理解度低い、要勉強
func TakeListenerIdFromJWT(c *gin.Context) (domain.ListenerId, error) {
	tokenString, _ := c.Cookie("auth-token")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		// c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return 0, err
	}
	fmt.Printf("token= %v \n", token)

	var listenerId int
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if val, exists := claims["listener_id"]; exists {
			listenerIdFloat, ok := val.(float64) // JSON numbers are float64
			if !ok {
				return 0, fmt.Errorf("Invalid listener_id format in token")
			}
			listenerId = int(listenerIdFloat)
		} else {
			// c.JSON(http.StatusBadRequest, gin.H{"error": "token has no Listener Id"})
			return 0, fmt.Errorf("token has no Listener Id")
		}
	}
	return domain.ListenerId(listenerId), err
}

func GenerateToken(ListenerId int) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	tokenLifeTime := 60 * 60 * 12

	claims := jwt.MapClaims{
		"listener_id": ListenerId,
		"exp":         time.Now().Add(time.Hour * time.Duration(tokenLifeTime)).Unix(),
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

func ValidateSignup(m *domain.Listener) error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is requred"),
			validation.Length(2, 20).Error("Name needs 2~20 cahrs"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			validation.Length(10, 100).Error("Email needs 10 ~ 100 chars"), //メアドは現状、これ以外の制限はしてない
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
	)
	return err
}
