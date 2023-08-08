package login

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

func Hash() {
	s := "Hello, World"
	b := getSHA256Binary(s)
	h := hex.EncodeToString(b)
	fmt.Println(b) // [3 103 90 197 63 249 205 21 53 204 199 223 205 250 44 69 140 82 24 55 31 65 141 193 54 242 209 154 193 251 232 165]
	fmt.Println(h) // 03675ac53ff9cd1535ccc7dfcdfa2c458c5218371f418dc136f2d19ac1fbe8a5
}

func getSHA256Binary(s string) []byte {
	r := sha256.Sum256([]byte(s))
	return r[:]
}
