package domain

import (
	"database/sql"
	"time"

	"gorm.io/gorm"
)

//// User
type ListenerId int
type Listener struct {
	ListenerId   ListenerId     `gorm:"type:int(11);primaryKey"`
	ListenerName string         `gorm:"type:varchar(50);not null"`
	Email        string         `gorm:"type:varchar(255);unique;not null"`
	Password     string         `gorm:"type:varchar(100);not null"`
	CreatedAt    time.Time      `gorm:"type:datetime;default:current_timestamp"`
	UpdatedAt    sql.NullTime   `gorm:"type:datetime"`                     //new time.Timeのままで良かったかも
	DeletedAt    gorm.DeletedAt `gorm:"type:datetime;index:deleted_index"` //new
	// DeletedAt    sql.NullTime //new これだと物理削除になってまう
}

type EntryListener struct {
	ListenerName string
	Email        string
	Password     string
}

type UserInfoFromFront struct {
	ListenerId   ListenerId
	ListenerName string
	Email        string
	Password     string
}
