package domain

import "time"

// VTuber Contents
type VtuberId int
type Vtuber struct {
	VtuberId         VtuberId    `gorm:"primaryKey;type:int(11)"`          //`json:"vtuber_id"`
	VtuberName       string      `gorm:"type:varchar(50);not null;unique"` //`json:"vtuver_name"`
	VtuberKana       *string     `gorm:"type:varchar(50);unique"`          //`json:"vtuber_kana"`
	IntroMovieUrl    *string     `gorm:"type:varchar(100)"`                //`json:"vtuber_intro_movie_url"`
	VtuberInputterId *ListenerId `gorm:"type:int(11);not null"`            //`json:"vtuber_inputter_id"`
}

type EntryVtuber struct {
	VtuberName       string      //`json:"vtuver_name"`
	VtuberKana       *string     //`json:"vtuber_kana"`
	IntroMovieUrl    *string     //`json:"vtuber_intro_movie_url"`
	VtuberInputterId *ListenerId //`json:"vtuber_inputter_id"`
}

type Movie struct {
	MovieUrl        string      `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	MovieTitle      *string     `gorm:"type:varchar(200);not null"`   //`json:"movie_title"`
	VtuberId        *VtuberId   `gorm:"type:int(11);not null"`        //`json:"vtuber_id"`
	MovieInputterId *ListenerId `gorm:"type:int(11);not null"`        //`json:"movie_inputter_id"` /new
}

type KaraokeListId int
type KaraokeList struct {
	KaraokeListId         KaraokeListId `gorm:"primaryKey;type:int(11);"`   //`json:"id"`
	MovieUrl              string        `gorm:"type:varchar(100);not null"` //`json:"movie_url"`
	SingStart             *string       `gorm:"type:time(0)"`               //`json:"sing_start"`
	SongName              string        `gorm:"type:varchar(100)"`          //`json:"song_name"`
	KaraokeListInputterId *ListenerId   `gorm:"type:int(11)"`               //`json:"inputter_id"`
}

type SongId int
type OriginalSong struct {
	SongID         SongId     `gorm:"type:int(11);primaryKey:auto_increment"`
	ArtistId       int        `gorm:"type:int(11)"`
	SongName       string     `gorm:"type:varchar(100);unique"`
	MovieUrl       string     `gorm:"type:varchar(100);unique"`
	ReleseData     time.Time  `gorm:"type:datetime;default null"`
	SongInputterId ListenerId `gorm:"type:int(11);not null"`
}

type EssentialOfVtMoKa struct {
	VtuberId              VtuberId
	VtuberName            string
	NameKana              string
	IntroMovieUrl         string
	VtuberInputterId      ListenerId
	MovieUrl              string
	MovieTitle            string
	MovieInputterId       ListenerId
	KaraokeListId         int
	SingStart             *string
	SongName              string
	KaraokeListInputterId ListenerId
}

type VtuberMovie struct {
	Vtuber
	Movie
}

type VtuberMovieKaraoke struct {
	Vtuber
	Movie
	KaraokeList
}
