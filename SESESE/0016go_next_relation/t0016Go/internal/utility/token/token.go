package token

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(MemberId string) (string, error) {
	secretKey := os.Getenv("SECRET_KEY")
	// tokenLifeTime, err := strconv.Atoi(os.Getenv("TOKEN_LIFETIME"))　//これ環境変数で設定するの？
	// if err != nil {
	// 	return "", err
	// }
	tokenLifeTime := 60 * 60 * 12 // 12hにする

	claims := jwt.MapClaims{
		"user_id": MemberId,
		"exp":     time.Now().Add(time.Hour * time.Duration(tokenLifeTime)).Unix(),
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
