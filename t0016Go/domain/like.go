package domain

// like_reration
type FavoritePost struct {
	Id         int        `gorm:"primaryKey;type:int(11)"`
	ListenerId ListenerId `gorm:"type:int(11);uniqueIndex:favorite;not null"`
	Movie_url  string     `gorm:"type:varchar(100);uniqueIndex:favorite"`
	KaraokeId  int        `gorm:"type:int(11);uniqueIndex:favorite"`
}

type Follow struct {
	Id               int `gorm:"primaryKey;type:int(11)"`
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_followed;not null"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_followed"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_followed"`
}

type LikeCount struct {
	ListenrId ListenerId
	Movie     int
	Karaoke   int
}

///////////////////////////////////////
//////フロントの実装イメージをつける////
/////////////////////////////////////

// 代入のイメージ
// type A struct {
// 	Id   int
// 	Name int
// }

// type AA struct {
// 	A      A
// 	status bool
// }

// func AintoAA() {
// 	var a A
// 	var aa AA
// 	a.Id = 1
// 	aa.A = a
// }
