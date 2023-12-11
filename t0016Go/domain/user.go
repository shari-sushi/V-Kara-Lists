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
// | SHOW CREATE TABLE favorites;      |
// | SHOW CREATE TABLE follows;        |
// | SHOW CREATE TABLE karaoke;        |
// | SHOW CREATE TABLE listeners;      |
// | SHOW CREATE TABLE movies;         |
// | SHOW CREATE TABLE original_songs; |
// | SHOW CREATE TABLE vtubers;        |
// +-----------------------------------+

// vt
// mo
// INSERT INTO karaoke (movie_url, sing_start, song_name, karaoke_list_inputter_id)VALUES('https://www.youtube.com/shorts/vKcMX3OYjOI', '00:10:41', 'a', 1),('https://www.youtube.com/shorts/vKcMX3OYjOI', '00:10:40', 'a', 1);
// INSERT INTO favorite (listener_id, movie_url, karaoke_id) VALUES (1, 'aaa', 0),(1, 'aaa', 1),(1, 'bbb', 0),(2, 'aaa', 2),(2, 'aaa', 3);
// INSERT INTO listeners (listener_name, email, password, created_at, updated_at, deleted_at)VALUES('車輪', 'imomochi_oimo@sora4bba.com', '$2a$10$jCheU3ee5miYfB.hz0KfWeidPgGx3fRIsLd6Ka7r6vxOQSbuBcj0u', '2023-12-08 14:59:21', '2023-12-08 14:59:22', NULL);
