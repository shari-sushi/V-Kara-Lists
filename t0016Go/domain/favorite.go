package domain

import "gorm.io/gorm"

// like_reration
type Favorite struct {
	gorm.Model
	ListenerId ListenerId `gorm:"type:int(11);uniqueIndex:favorite_uq;not null"`
	MovieUrl   string     `gorm:"type:varchar(100);uniqueIndex:favorite_uq"`
	KaraokeId  KaraokeId  `gorm:"type:int(11);uniqueIndex:favorite_uq"`
}

type Follow struct {
	gorm.Model
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_uq;not null"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_uq"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_uq"`
}

// appへ送信用
type TransmitMovie struct {
	Vtuber
	Movie
	Count int
	IsFav bool
}

// dbからCount取得用
type MovieFavoriteCount struct {
	Movie
	Count int
}

// appへ送信用
type TransmitKaraoke struct {
	Vtuber
	Movie
	Karaoke
	Count int
	IsFav bool
}

// dbからCount取得用
type KaraokeFavoriteCount struct {
	Karaoke
	Count int
}
