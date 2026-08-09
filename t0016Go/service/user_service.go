package service

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type UserService struct {
	UserRepository repository.UserRepository
}

func (interactor *UserService) CreateUser(user domain.Listener) (newUser domain.Listener, err error) {
	newUser, err = interactor.UserRepository.CreateUser(user)
	return
}

func (interactor *UserService) LogicalDeleteUser(withdrawalUser domain.Listener) (err error) {
	err = interactor.UserRepository.LogicalDeleteUser(withdrawalUser)
	return
}

func (interactor *UserService) FindUserByEmail(email string) (foundUser domain.Listener, err error) {
	foundUser, err = interactor.UserRepository.FindUserByEmail(email)
	return
}

func (interactor *UserService) FindUserByListenerId(ListenerId domain.ListenerId) (foundUser domain.Listener, err error) {
	foundUser, err = interactor.UserRepository.FindUserByListenerId(ListenerId)
	return
}
