package common

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func SetListenerIdintoCookie(c *gin.Context, ListenerId domain.ListenerId) (err error) {
	// Token発行　＝　JWTでいいのかな？
	var token string
	token, err = GenerateToken(int(ListenerId))
	if err != nil {
		return
	}
	cookieMaxAge := 60 * 60 * 12 * 12 //開発中につき長時間化中
	cookie := &http.Cookie{
		Name:     "auth-token",
		Value:    token,
		Path:     "/",
		Domain:   "localhost",
		MaxAge:   cookieMaxAge,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode, //本番環境ではNone禁止
	}
	http.SetCookie(c.Writer, cookie)
	fmt.Printf("発行したcookie= %v /n", cookie)
	return
}

// コードの理解度低い、要勉強
func TakeListenerIdFromJWT(c *gin.Context) (domain.ListenerId, error) {
	tokenString, _ := c.Cookie("auth-token")
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
			listenerIdFloat, ok := val.(float64) // JSON numbers are float64
			if !ok {
				return 0, fmt.Errorf("Invalid listener_id format in token")
			}
			listenerId = int(listenerIdFloat)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "token has no Listener Id"})
			return 0, err
		}
	}
	return domain.ListenerId(listenerId), err
}

func GenerateToken(ListenerId int) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	tokenLifeTime := 60 * 60 * 12 // 12hにする

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
