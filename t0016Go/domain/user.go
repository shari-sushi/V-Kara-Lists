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
	UpdatedAt    sql.NullTime   `gorm:"type:datetime"`
	DeletedAt    gorm.DeletedAt `gorm:"type:datetime;index:deleted_index"`
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

// SELECT CONCAT('SHOW CREATE TABLE ', table_name, ';') AS show_create_table_query
// FROM information_schema.tables
// WHERE table_schema = 'MYSQL_DATABASE';
// +-----------------------------------+
// | show_create_table_query           |
// +-----------------------------------+
// | SHOW CREATE TABLE favorite_posts; |
// | SHOW CREATE TABLE follows;        |
// | SHOW CREATE TABLE karaoke_lists;  |
// | SHOW CREATE TABLE listeners;      |
// | SHOW CREATE TABLE movies;         |
// | SHOW CREATE TABLE original_songs; |
// | SHOW CREATE TABLE vtubers;        |
// +-----------------------------------+
