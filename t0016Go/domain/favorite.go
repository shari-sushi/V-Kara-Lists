package domain

import "time"

// FavoriteVideo は「配信/動画全体」へのお気に入り。video への実FKを張る。
// 旧Favoriteは MovieUrl + KaraokeId のゼロ値で「動画のみのお気に入り」を暗黙に表現していたが、
// video/video_songs のテーブル分割によりその必要が無くなった。
// deleted_atは付けない(お気に入り解除は物理削除)。
type FavoriteVideo struct {
	Id         int        `gorm:"primaryKey;type:int(11)"`
	ListenerId ListenerId `gorm:"type:int(11);uniqueIndex:favorite_video_uq;not null"`
	VideoId    VideoId    `gorm:"type:int(11);uniqueIndex:favorite_video_uq;not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
}

type ReceivedFavoriteVideo struct {
	Id         int
	ListenerId ListenerId
	VideoId    VideoId
}

// FavoriteVideoSong は「配信内の1曲」へのお気に入り。video_songs への実FKを張る。
type FavoriteVideoSong struct {
	Id          int         `gorm:"primaryKey;type:int(11)"`
	ListenerId  ListenerId  `gorm:"type:int(11);uniqueIndex:favorite_video_song_uq;not null"`
	VideoSongId VideoSongId `gorm:"type:int(11);uniqueIndex:favorite_video_song_uq;not null"`
	CreatedAt   time.Time   `gorm:"type:datetime;not null"`
}

type ReceivedFavoriteVideoSong struct {
	Id          int
	ListenerId  ListenerId
	VideoSongId VideoSongId
}

type Follow struct {
	Id               int `gorm:"primaryKey;type:int(11)"`
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_uq;not null"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_uq"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_uq"`
}

// appへ送信用 現状ではCount, IsFavの利用方法はない
type TransmitVtuber struct {
	Vtuber
	Count int
	IsFav bool
}

// appへ送信用(動画単位)
// videos/video_songs は共に inputter_id 等の同名カラムを持つため、JOIN結果を構造体に
// anonymous embed すると同名フィールドが衝突する。フィールドをフラットに持たせ、
// SQL側でも同名カラムを明示的にエイリアスして対応させる。
type TransmitVideo struct {
	VtuberId         VtuberId
	VtuberName       string
	VtuberKana       string
	IntroMovieUrl    string
	VtuberInputterId ListenerId

	VideoId         VideoId
	Category        VideoCategory
	MovieUrl        MovieUrl
	Title           string
	PublishedAt     *time.Time
	VideoInputterId ListenerId

	Count int
	IsFav bool
}

// appへ送信用(動画内の1曲単位)
type TransmitVideoSong struct {
	VtuberId         VtuberId
	VtuberName       string
	VtuberKana       string
	IntroMovieUrl    string
	VtuberInputterId ListenerId

	VideoId         VideoId
	Category        VideoCategory
	MovieUrl        MovieUrl
	Title           string
	PublishedAt     *time.Time
	VideoInputterId ListenerId

	VideoSongId         VideoSongId
	SingStart           string
	SongName            string
	VideoSongInputterId ListenerId

	Count int
	IsFav bool
}
