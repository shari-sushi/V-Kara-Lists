package useCase

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type UserInteractor struct {
	UserRepository  UserRepository
	OtherRepository OtherRepository
}

func (interactor *UserInteractor) CreateUser(user domain.Listener) (newUser domain.Listener, err error) {
	newUser, err = interactor.UserRepository.CreateUser(user)
	return
}

func (interactor *UserInteractor) LogicalDeleteUser(withdrawalUser domain.Listener) (err error) {
	err = interactor.UserRepository.LogicalDeleteUser(withdrawalUser)
	return
}

func (interactor *UserInteractor) FindUserByEmail(email string) (foundUser domain.Listener, err error) {
	foundUser, err = interactor.UserRepository.FindUserByEmail(email)
	return
}

func (interactor *UserInteractor) FindUserByListenerId(ListenerId domain.ListenerId) (foundUser domain.Listener, err error) {
	foundUser, err = interactor.UserRepository.FindUserByListenerId(ListenerId)
	return
}
