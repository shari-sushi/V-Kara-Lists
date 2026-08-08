package repository

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type userRepository struct {
	SqlHandler
}

func (db *userRepository) CreateUser(user domain.Listener) (domain.Listener, error) {
	err := db.Create(&user).Error
	if err != nil {
		return user, err
	}

	return user, nil
}

func (db *userRepository) FindUserByEmail(email string) (domain.Listener, error) {
	var user domain.Listener
	err := db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return user, err
	}

	return user, nil
}

func (db *userRepository) LogIn(user domain.Listener) (domain.Listener, error) {
	if err := db.First(&user, user.ListenerId).Error; err != nil {
		return user, err
	}

	return user, nil
}

func (db *userRepository) LogicalDeleteUser(user domain.Listener) error {
	err := db.Delete(&user, &user.ListenerId).Error
	if err != nil {
		return err
	}

	return nil
}

func (db *userRepository) FindUserByListenerId(ListenerId domain.ListenerId) (domain.Listener, error) {
	var user domain.Listener
	query := fmt.Sprintf("listener_id = %v", ListenerId)
	err := db.Where(query).First(&user).Error
	if err != nil {
		return user, err
	}

	return user, nil
}
