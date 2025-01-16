package domain

import "time"

// VTuber Contents
type VtuberId int
type Vtuber struct {
	VtuberId         VtuberId   `gorm:"primaryKey;type:int(11)"`          //`json:"vtuber_id"`
	VtuberName       string     `gorm:"type:varchar(50);not null;unique"` //`json:"vtuver_name"`
	VtuberKana       string     `gorm:"type:varchar(50);not null;unique"` //`json:"vtuber_kana"`
	IntroMovieUrl    string     `gorm:"type:varchar(100)"`                //`json:"vtuber_intro_movie_url"`
	VtuberInputterId ListenerId `gorm:"type:int(11);not null"`            //`json:"vtuber_inputter_id"`
	// NOTE: 多分24で良い
	// YoutubeChannelId string     `gorm:"type:varchar(50)"`                 //`json:"youtube_channel_id"`
}

// "karoake"とoriginal_song"意外はkareaokeIdのMovieUrlを作るのは弾く
type Movie struct {
	MovieUrl string `gorm:"primaryKey;type:varchar(100)"`
	// ContentType     MovieContentType `gorm:"type:varchar(64);not null;"`
	MovieTitle      string     `gorm:"type:varchar(200);not null"`
	VtuberId        VtuberId   `gorm:"type:int(11);not null"`
	MovieInputterId ListenerId `gorm:"type:int(11);not null"`
}

type MovieContentType int

const (
	_ MovieContentType = iota
	// 一般的に、1動画複数曲とされるもの
	KARAOKE = 10
	LIVE    = 11

	// 一般的に、1動画1曲とされるもの
	ORIGINAL_SONG = 51
	COVERED_SONG  = 52

	// 上述に分類できないものが出来た時の仮分類として使用する
	OTHER = 99
)

type KaraokeId int
type Karaoke struct {
	KaraokeId         KaraokeId  `gorm:"primaryKey;type:int(11)"`                           //`json:"id"`
	MovieUrl          string     `gorm:"type:varchar(100);uniqueIndex:karaoke_uq;not null"` //`json:"movie_url"`
	SingStart         string     `gorm:"type:time(0);uniqueIndex:karaoke_uq"`               //`json:"sing_start"`
	SongName          string     `gorm:"type:varchar(100)"`                                 //`json:"song_name"`
	KaraokeInputterId ListenerId `gorm:"type:int(11)"`                                      //`json:"inputter_id"`
}

type SongId int
type OriginalSong struct {
	ID         SongId     `gorm:"type:int(11);primaryKey"`
	Url        string     `gorm:"type:varchar(100);unique"`
	Name       string     `gorm:"type:varchar(100)"`
	ArtistId   int        `gorm:"type:int(11)"`
	RelesedAt  time.Time  `gorm:"type:datetime;default null"`
	InputterId ListenerId `gorm:"type:int(11);not null"`
	CreatedAt  time.Time  `gorm:"type:datetime;not null"`
	UpdatedAt  time.Time  `gorm:"type:datetime;not null"`
	DeleteAt   time.Time  `gorm:"type:datetime;default null"`
}

type VtuberMovie struct {
	Vtuber
	Movie
}

type VtuberMovieKaraoke struct {
	Movie
	Karaoke
}
