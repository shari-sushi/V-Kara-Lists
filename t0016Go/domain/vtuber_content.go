package domain

import "time"

// VTuber Contents
type VtuberMovie struct {
	Vtuber
	Movie
}

type VtuberMovieKalaokeList struct {
	Vtuber
	Movie
	KaraokeList
}

//GORMなのに何故か `json:"~~"`が無いとスネークにならない
type VtuberId int
type Vtuber struct {
	VtuberId        VtuberId    `gorm:"primaryKey;type:int(11)"`          //`json:"vtuber_id"` //
	VtuberName      string      `gorm:"type:varchar(50);not null;unique"` //`json:"vtuver_name"`
	VtuberKana      *string     `gorm:"type:varchar(50);unique"`          //`json:"vtuber_kana"`
	IntroMovieUrl   *string     `gorm:"type:varchar(100)"`                //`json:"vtuber_intro_movie_url"`
	VtuberInputerId *ListenerId `gorm:"type:int(11);not null"`            //`json:"vtuber_inputer_id"`
}

type EntryVtuber struct {
	VtuberName      string      //`json:"vtuver_name"`
	VtuberKana      *string     //`json:"vtuber_kana"`
	IntroMovieUrl   *string     //`json:"vtuber_intro_movie_url"`
	VtuberInputerId *ListenerId //`json:"vtuber_inputer_id"`
}

type Movie struct {
	MovieUrl       string      `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	MovieTitle     *string     `gorm:"type:varchar(200);not null"`   //`json:"movie_title"`
	VtuberId       *VtuberId   `gorm:"type:int(11);not null"`        //`json:"vtuber_id"`
	MovieInputerId *ListenerId `gorm:"type:int(11);not null"`        //`json:"movie_inputer_id"` /new
}

type KaraokeListId int
type KaraokeList struct {
	MovieUrl             string        `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	KaraokeListId        KaraokeListId `gorm:"primaryKey;type:int(11)"`      //`json:"id"`
	SingStart            *string       `gorm:"type:time(0)"`                 //`json:"sing_start"` //nill可にするためのポインタ
	SongName             string        `gorm:"type:varchar(100)"`            //`json:"song_name"`
	KaraokeListInputerId ListenerId    `gorm:"type:int(11)"`                 //`json:"inputer_id"`
}

type SongId int
type OriginalSong struct {
	SongID        SongId     `gorm:"type:int(11);primaryKey:auto_increment"`
	ArtistId      int        `gorm:"type:int(11)"`
	SongName      string     `gorm:"type:varchar(100);unique"`
	MovieUrl      string     `gorm:"type:varchar(100);unique"`
	ReleseData    time.Time  `gorm:"type:datetime;default null"`
	SongInputerId ListenerId `gorm:"type:int(11);not null"` //`gorm:"not null"`
}

// var all types.AllData
// var alls []types.AllData
// var st types.Streamer
// var sts []types.Streamer
// var mo types.Movie
// var mos []types.Movie
// var ka types.KaraokeList
// var kas []types.KaraokeList

// コピペ用全カラム
type AllColumns struct {
	VtueberId            int
	VtuberName           string
	NameKana             string
	IntroMovieUrl        string
	VtuberInputerId      int
	MovieId              int
	MovieUrl             string
	MovieTitle           string
	KaraokeListId        int
	SingStart            *string
	SongName             string
	KaraokeListInputerId int
}
