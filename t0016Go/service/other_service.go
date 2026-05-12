package service

import (
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type OtherService struct {
	OtherRepository repository.OtherRepository
}

func (interactor *OtherService) ExecRawQuery(sql string) error {
	err := interactor.OtherRepository.ExecRawQuery(sql)
	return err
}
