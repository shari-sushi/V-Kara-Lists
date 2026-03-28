package repository

import (
	"fmt"
)

type otherRepository struct {
	SqlHandler
}

func (db *otherRepository) ExecRawQuery(query string) error {
	fmt.Print("interfaces/database/other.go\n")
	err := db.Raw(query).Error
	if err != nil {
		return err
	}
	return nil
}
