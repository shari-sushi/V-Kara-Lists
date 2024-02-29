package database

import (
	"fmt"
)

type OtherRepository struct {
	SqlHandler
}

func (db *OtherRepository) ExecRawQuery(query string) error {
	fmt.Print("interfaces/database/other.go\n")
	err := db.Raw(query).Error
	if err != nil {
		return err
	}
	return nil
}
