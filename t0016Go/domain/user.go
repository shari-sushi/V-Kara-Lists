package domain

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

// ErrListenerNotFound はリスナーが存在しないことを表す。DBライブラリ固有のエラーを上位層に漏らさないために使う
var ErrListenerNotFound = errors.New("listener not found")

// // User
type ListenerId int
type Listener struct {
	ListenerId   ListenerId     `gorm:"type:int(11);primaryKey"`
	ListenerName string         `gorm:"type:varchar(50);not null"`
	Email        string         `gorm:"type:varchar(255);unique;not null"`
	Password     string         `gorm:"type:varchar(100);not null"`
	CreatedAt    time.Time      `gorm:"type:datetime;default:current_timestamp"`
	UpdatedAt    time.Time      `gorm:"type:datetime"`
	DeletedAt    gorm.DeletedAt `gorm:"type:datetime;index:deleted_index"`
}
