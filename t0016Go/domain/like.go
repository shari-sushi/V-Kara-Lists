package domain

// like_reration
type FavoritePost struct {
	ListenerId int    `gorm:"primaryKey;type:int(11)"`
	Movie_url  string `gorm:"primaryKey;type:varchar(100)"`
	KaraokeId  int    `gorm:"primaryKey;type:int(11)"`
}

type Follow struct {
	FollowId         int `gorm:"primaryKey;type:int(11)"`
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_followed"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_followed"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_followed"`
}
