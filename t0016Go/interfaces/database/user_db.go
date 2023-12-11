package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type UserRepository struct {
	SqlHandler
}

func (db *UserRepository) CreateUser(user domain.Listener) (domain.Listener, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	err := db.Create(&user).Error
	if err != nil {
		return user, err
	}
	return user, nil
}

func (db *UserRepository) FindUserByEmail(email string) (domain.Listener, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var user domain.Listener
	query := "email = '" + email + "'"
	err := db.Where(query).First(&user).Error
	if err != nil {
		return user, err
	}
	return user, err
}
func (db *UserRepository) LogIn(user domain.Listener) (domain.Listener, error) {
	if err := db.First(&user, user.ListenerId).Error; err != nil {
		return user, err
	}
	return user, nil
}
func (db *UserRepository) LogicalDeleteUser(user domain.Listener) error {
	err := db.Delete(&user, &user.ListenerId).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *UserRepository) FindUserByListenerId(ListenerId domain.ListenerId) (domain.Listener, error) {
	var user domain.Listener
	query := fmt.Sprintf("listener_id = %v", ListenerId)
	err := db.Where(query).First(&user).Error
	if err != nil {
		return user, err
	}
	return user, err
}
