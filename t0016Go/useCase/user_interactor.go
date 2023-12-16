package useCase

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type UserInteractor struct {
	UserRepository          UserRepository
	VtuberContentRepository VtuberContentRepository
	FavoriteRepository      FavoriteRepository
}

func (interactor *UserInteractor) CreateUser(user domain.Listener) (newUser domain.Listener, err error) {
	fmt.Print("useCase/user_interactor.go \n")
	newUser, err = interactor.UserRepository.CreateUser(user)
	return
}
func (interactor *UserInteractor) LogicalDeleteUser(withdrawalUser domain.Listener) (err error) {
	fmt.Print("useCase/user_interactor.go \n")
	err = interactor.UserRepository.LogicalDeleteUser(withdrawalUser)
	return
}

func (interactor *UserInteractor) FindUserByEmail(email string) (foundUser domain.Listener, err error) {
	fmt.Print("useCase/user_interactor.go \n")
	foundUser, err = interactor.UserRepository.FindUserByEmail(email)
	return
}
func (interactor *UserInteractor) FindUserByListenerId(ListenerId domain.ListenerId) (foundUser domain.Listener, err error) {
	fmt.Print("useCase/user_interactor.go \n")
	foundUser, err = interactor.UserRepository.FindUserByListenerId(ListenerId)
	return
}
