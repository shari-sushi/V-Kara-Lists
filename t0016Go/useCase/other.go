package useCase

import (
	"fmt"
)

type OtherInteractor struct {
	FavoriteRepository      FavoriteRepository
	VtuberContentRepository VtuberContentRepository
	UserRepository          UserRepository
	OtherRepository         OtherRepository
}

func (interactor *OtherInteractor) ExecRawQuery(sql string) error {
	fmt.Print("useCase/other_interactor.go \n")
	err := interactor.OtherRepository.ExecRawQuery(sql)
	return err
}
