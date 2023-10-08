package postrequest

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// 引数がもともとuserID unit64だった。変えて良かったのか分かってない。
func GenerateToken(memberId string) (string, error) {
	secretKey := os.Getenv("SECRET_KEY_JWTtoken") // 暗号化、復号化するためのキー
	// 接続するたびに時間が更新されるなら1h、されないなら6hにする。→要確認
	tokenLifeTime := 60 * 60

	// tokenLifeTime, err := strconv.Atoi(os.Getenv("TOKEN_LIFETIME"))
	// if err != nil {
	// 	return "", err
	// }

	claims := jwt.MapClaims{
		"member_id": memberId,
		"exp":       time.Now().Add(time.Hour * time.Duration(tokenLifeTime)).Unix(),
	}
	// HS256署名アルゴリズムを使用して新しいJWTを生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// 署名
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
