package common

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"
	"sync"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var bcryptCost int

var (
	dummyPasswordHash     []byte
	dummyPasswordHashOnce sync.Once
)
var aesKey []byte
var aesIv []byte
var costString string

func InitCryptVar() {
	var err error
	fmt.Println("-----start to godotenv.Load-----")
	if err = godotenv.Load(".env", "../.env"); err != nil {
		fmt.Println("failed to godotenv at init() in cryptgo (on Cloud)", err.Error())
	}
	initAesEnv()

	if aesKey == nil {
		fmt.Println("aesKey is nil or empty")
	}

	bcryptCost, err = strconv.Atoi(costString)
	if err != nil {
		fmt.Printf("failed to convert to bcryptCost. err:%v\n", err.Error())
	}
}

func initAesEnv() {
	fmt.Println("-----start to initAesEnv-----")
	costString = os.Getenv("BCRYPT_COST")
	envAesKey := os.Getenv("AES_KEY")
	aesKey = []byte(envAesKey)
	aesIv, _ = hex.DecodeString(os.Getenv("AES_IV"))
}

// password

func EncryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	return string(hash), err
}

func CompareHashAndPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

//email

func EncryptByAES(plain string) (encrypted string, err error) {
	bytePlain := []byte(plain)

	block, err := aes.NewCipher(aesKey)
	if err != nil {
		return "", err
	}
	padded := pkcs7Pad(bytePlain)
	byteEncrypted := make([]byte, len(padded))

	cbcEncrypter := cipher.NewCBCEncrypter(block, aesIv)
	cbcEncrypter.CryptBlocks(byteEncrypted, padded)
	convertedHexString := hex.EncodeToString(byteEncrypted)
	encrypted = convertedHexString

	return encrypted, nil
}

func pkcs7Pad(data []byte) []byte {
	length := aes.BlockSize - (len(data) % aes.BlockSize)
	trailing := bytes.Repeat([]byte{byte(length)}, length)
	return append(data, trailing...)
}

func DecryptFromAES(encryptedEmail string) (string, error) {
	byteDecoded, err := hex.DecodeString(encryptedEmail)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(aesKey)
	if err != nil {
		return "", err
	}
	decrypted := make([]byte, len(byteDecoded))
	cbcDecrypter := cipher.NewCBCDecrypter(block, aesIv)
	cbcDecrypter.CryptBlocks(decrypted, byteDecoded)

	email := string(pkcs7Unpad(decrypted))
	return email, nil
}

func pkcs7Unpad(data []byte) []byte {
	dataLength := len(data)
	padLength := int(data[dataLength-1])
	return data[:dataLength-padLength]
}

// DummyPasswordHash は存在しないユーザーのログイン時に照合用として使うハッシュを返す。
// 実在ユーザーと同じくbcryptの照合を通して応答時間を揃え、応答時間から登録済みかどうかを判定させないために使う。
// 元のパスワードは乱数で、誰にも分からない
func DummyPasswordHash() (string, error) {
	var err error
	dummyPasswordHashOnce.Do(func() {
		randomPassword := make([]byte, 32)
		if _, err = rand.Read(randomPassword); err != nil {
			return
		}
		// 実在ユーザーと同じコストにするため、bcryptCostが確定した後(初回呼び出し時)に生成する
		dummyPasswordHash, err = bcrypt.GenerateFromPassword(randomPassword, bcryptCost)
	})
	if err != nil {
		return "", err
	}
	if dummyPasswordHash == nil {
		return "", fmt.Errorf("dummy password hash is not generated")
	}
	return string(dummyPasswordHash), nil
}
