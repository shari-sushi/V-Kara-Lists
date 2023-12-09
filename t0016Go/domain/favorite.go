package domain

import "gorm.io/gorm"

// like_reration
type Favorite struct {
	*gorm.Model
	ListenerId ListenerId `gorm:"type:int(11);uniqueIndex:favorite_uq;not null"`
	Movie_url  string     `gorm:"type:varchar(100);uniqueIndex:favorite_uq"`
	KaraokeId  int        `gorm:"type:int(11);uniqueIndex:favorite_uq"`
}

type Follow struct {
	*gorm.Model
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_uq;not null"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_uq"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_uq"`
}

type favoriteCount struct {
	ListenerId ListenerId
	Movie      int
	Karaoke    int
}

type MovieWithFavorites struct {
	Movie
	Favorites []Favorite
}

type MovieFavoriteCount struct {
	MovieUrl string
	Count    int
}

type KaraokeWithFavorites struct {
	KaraokeList
	Favorites []Favorite
}

type KarokeFavorioteCount struct {
	KaraokeListId
	Count int
}
