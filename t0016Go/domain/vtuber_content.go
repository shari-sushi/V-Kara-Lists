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

type MovieUrl string

// VideoCategory は動画の種別を表す。10/30は将来の大分類拡張用に予約している。
type VideoCategory int

const (
	_ VideoCategory = iota

	// 1動画1曲(単曲)とされるもの
	ORIGINAL_SONG_CATEGORY VideoCategory = 11
	COVERED_SONG_CATEGORY  VideoCategory = 12

	// 1動画複数曲とされるもの
	KARAOKE_CATEGORY VideoCategory = 31
	LIVE_CATEGORY    VideoCategory = 32
)

// SingleSongCategories は動画1本につき歌唱行を必ず1件しか持たないカテゴリ。
// これらのカテゴリでは VideoSong.SingStart にセンチネル値(SingleSongSentinelSingStart)を入れる。
var SingleSongCategories = map[VideoCategory]bool{
	ORIGINAL_SONG_CATEGORY: true,
	COVERED_SONG_CATEGORY:  true,
}

// SingleSongSentinelSingStart は単曲カテゴリでの sing_start の固定値。
// UNIQUE(video_id, sing_start) 制約はNULL同士を別物と扱うため、NULLではなく固定値を入れることで
// 単曲の重複作成を防ぐ。設計判断の詳細は V-Kara-Lists.wiki/設計判断ログ.md を参照。
const SingleSongSentinelSingStart = "00:00:00"

func (c VideoCategory) IsSingleSong() bool {
	return SingleSongCategories[c]
}

// ValidVideoCategories は Video.Category として許容される値の集合。
var ValidVideoCategories = map[VideoCategory]bool{
	ORIGINAL_SONG_CATEGORY: true,
	COVERED_SONG_CATEGORY:  true,
	KARAOKE_CATEGORY:       true,
	LIVE_CATEGORY:          true,
}

// IsValid は許容される4値のいずれかであるかを返す。
func (c VideoCategory) IsValid() bool {
	return ValidVideoCategories[c]
}

// Video は「動画」を表す。歌枠・ライブ・オリ曲・歌ってみたの4カテゴリを Category で区別する。
type VideoId int
type Video struct {
	VideoId     VideoId       `gorm:"primaryKey;type:int(11);column:id"`
	Category    VideoCategory `gorm:"type:tinyint;not null"`
	MovieUrl    MovieUrl      `gorm:"type:varchar(100);not null;unique"`
	Title       string        `gorm:"type:varchar(200);not null"`
	VtuberId    VtuberId      `gorm:"type:int(11);not null"`
	PublishedAt *time.Time    `gorm:"type:datetime;default:null"`
	InputterId  ListenerId    `gorm:"type:int(11);not null"`
	CreatedAt   time.Time     `gorm:"type:datetime;not null"`
	UpdatedAt   time.Time     `gorm:"type:datetime;not null"`
}

// VideoSong は動画内で歌われた各曲(旧karaokesの正規化版)。単曲カテゴリでも必ず1行作る。
type VideoSongId int
type VideoSong struct {
	VideoSongId VideoSongId `gorm:"primaryKey;type:int(11);column:id"`
	VideoId     VideoId     `gorm:"type:int(11);not null;uniqueIndex:video_song_uq"`
	SingStart   string      `gorm:"type:time(0);not null;uniqueIndex:video_song_uq"`
	SongName    string      `gorm:"type:varchar(100);not null"`
	InputterId  ListenerId  `gorm:"type:int(11);not null"`
	CreatedAt   time.Time   `gorm:"type:datetime;not null"`
	UpdatedAt   time.Time   `gorm:"type:datetime;not null"`
}
