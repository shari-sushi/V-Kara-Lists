package common

import (
	"fmt"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/gorm"
)

// 最低文字数の制限は今のところここでしかやってない、元々1, 255。8, 255だった。
// import "validation "github.com/go-ozzo/ozzo-validation"
func ValidateSignup(m *domain.Listener) error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is requred"),
			validation.Length(2, 20).Error("Name needs 2~20 cahrs"),
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			validation.Length(10, 100).Error("Email needs 4 ~ 20 chars"), //メアドは現状、これ以外の制限はしてない
		),
	)
	return err
}

func FindUserByEmail(db *gorm.DB, email string) (domain.Listener, error) {
	var user domain.Listener
	result := db.Where("email = ?", email).Find(&user)
	fmt.Printf("Emailで取得したuser= %v \n", user)
	return user, result.Error
}

func FindUserByListenerId(db *gorm.DB, listenerId int) (domain.Listener, error) {
	var user domain.Listener
	fmt.Printf("FindUserByListenerIdで受け取ったlistenerId= %v \n", listenerId)
	result := db.Where("listener_id = ?", listenerId).First(&user)
	fmt.Printf("Idで取得したuser= %v \n", user)
	return user, result.Error
}
