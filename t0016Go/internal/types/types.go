package types

import (
	"database/sql"
	"fmt"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/sharin-sushi/0016go_next_relation/internal/controller/crypto"

	"gorm.io/gorm"
)

//"github.com/sharin-sushi/0016go_next_relation/internal/types"
// types.

// var all types.AllData
// var alls []types.AllData
// var st types.Streamer
// var sts []types.Streamer
// var mo types.Movie
// var mos []types.Movie
// var ka types.KaraokeList
// var kas []types.KaraokeList

// マイグレーションに使う型
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

type Vtuber struct {
	VtuberId        int     `gorm:"primaryKey;type:int(11);auto_increment"` //`json:"vtuber_id"` //
	VtuberName      string  `gorm:"type:varchar(50);not null;unique"`       //`json:"vtuver_name"`
	VtuberKana      *string `gorm:"type:varchar(50);unique"`                //`json:"vtuber_kana"`
	IntroMovieUrl   *string `gorm:"type:varchar(100)"`                      //`json:"vtuber_intro_movie_url"`
	VtuberInputerId *int    `gorm:"type:int(11);not null"`                  //`json:"vtuber_inputer_id"`
}

type EntryVtuber struct {
	VtuberName      string  //`json:"vtuver_name"`
	VtuberKana      *string //`json:"vtuber_kana"`
	IntroMovieUrl   *string //`json:"vtuber_intro_movie_url"`
	VtuberInputerId *int    //`json:"vtuber_inputer_id"`
}

type Movie struct {
	MovieUrl       string  `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	MovieTitle     *string `gorm:"type:varchar(200);not null"`   //`json:"movie_title"`
	VtuberId       *int    `gorm:"type:int(11);not null"`        //`json:"vtuber_id"`
	MovieInputerId *int    `gorm:"type:int(11);not null"`        //`json:"movie_inputer_id"` /new
}

type KaraokeList struct {
	MovieUrl             string  `gorm:"primaryKey;type:varchar(100)"` //`json:"movie_url"`
	KaraokeListId        int     `gorm:"primaryKey;type:int(11)"`      //`json:"id"`
	SingStart            *string `gorm:"type:time(0)"`                 //`json:"sing_start"` //nill可にするためのポインタ
	SongName             string  `gorm:"type:varchar(100)"`            //`json:"song_name"`
	KaraokeListInputerId int     `gorm:"type:int(11)"`                 //`json:"inputer_id"`
}

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

//// User
type Listener struct {
	ListenerId   int            `gorm:"type:int(11);primaryKey;auto_increment"`
	ListenerName string         `gorm:"type:varchar(50);not null"`
	Email        string         `gorm:"type:varchar(255);unique;not null"`
	Password     string         `gorm:"type:varchar(100);not null"`
	CreatedAt    time.Time      `gorm:"type:datetime;default:current_timestamp"`
	UpdatedAt    sql.NullTime   `gorm:"type:datetime"`                     //new time.Timeのままで良かったかも
	DeletedAt    gorm.DeletedAt `gorm:"type:datetime;index:deleted_index"` //new
	// DeletedAt    sql.NullTime //new これだと物理削除になってまう
}

type EntryListener struct {
	ListenerName string
	Email        string
	Password     string
}

type UserInfoFromFront struct {
	ListenerId   string
	ListenerName string
	Email        string
	Password     string
}

// like_reration
type FavoritePost struct {
	ListenerId int    `gorm:"primaryKey;type:int(11)"`
	Movie_url  string `gorm:"primaryKey;type:varchar(100)"`
	KaraokeId  int    `gorm:"primaryKey;type:int(11)"`
}

type Follow struct {
	FollowId         int `gorm:"primaryKey;type:int(11)"`
	FollowListener   int `gorm:"not null;type:int(11);uniqueIndex:follow_folloed"`
	FollowedVtuber   int `gorm:"type:int(11);uniqueIndex:follow_folloed"`
	FollowedListener int `gorm:"type:int(11);uniqueIndex:follow_folloed"`
} // ポリモーフィック

type OriginalSong struct {
	SongID        int       `gorm:"type:int(11);primaryKey:auto_increment"`
	ArtistId      int       `gorm:"type:int(11)"`
	SongName      string    `gorm:"type:varchar(100);unique"`
	MovieUrl      string    `gorm:"type:varchar(100);unique"`
	ReleseData    time.Time `gorm:"type:datetime;default null"`
	SongInputerId int       `gorm:"type:int(11);not null"` //`gorm:"not null"`
}

//listener構造体の型で新規発行したIDと共にユーザー情報を返す
func (m *Listener) CreateMember(db *gorm.DB) (Listener, error) {
	fmt.Printf("CreateMemberで使用されるm= %v \n", m)

	user := Listener{
		ListenerName: m.ListenerName,
		Email:        m.Email,
		Password:     crypto.EncryptPasswordWithoutBackErr(m.Password),
	}
	// ここまで動作確認

	//最新ユーザーのidから新規ユーザーidを発行 id = L01 (string)だったときのコード
	// newId, err := CreateNewUserId(db)
	// if err != nil {
	// 	fmt.Printf("Failed create a new id")
	// 	return user, err
	// }

	// user.Id = newId
	fmt.Printf("新規id込みでuser= %v \n", user)
	result := db.Create(&user)
	if result != nil {
		return user, result.Error
	}
	fmt.Println(2.4)
	user, _ = FindUserByEmail(db, m.Email) //user情報取得
	return user, result.Error
}

// 最低文字数の制限は今のところここでしかやってない、元々1, 255。8, 255だった。
// import "validation "github.com/go-ozzo/ozzo-validation"
func (m *Listener) ValidateSignup() error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is requred"),
			validation.Length(2, 20).Error("Name needs 2~20 cahrs"),
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			validation.Length(10, 100).Error("Email needs 4 ~ 20 chars"), //メアドは現状、これ以外の制限はしてない
		),
	)
	return err
}

func (m *EntryListener) Validate() error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.ListenerName,
			validation.Required.Error("Name is requred"),
			validation.Length(2, 20).Error("Name needs 2~20 cahrs"),
		),
		validation.Field(&m.Password,
			validation.Required.Error("Password is required"),
			validation.Length(4, 20).Error("Password needs 4 ~ 20 chars"),
		),
		validation.Field(&m.Email,
			validation.Required.Error("Email is required"),
			validation.Length(10, 100).Error("Email needs 4 ~ 20 chars"), //メアドは現状、これ以外の制限はしてない
		),
	)
	return err
}

func FindUserByEmail(db *gorm.DB, email string) (Listener, error) {
	var user Listener
	result := db.Where("email = ?", email).Find(&user) //FirstからFindに変えた
	fmt.Printf("Emailで取得したuser= %v \n", user)
	return user, result.Error
}

func FindUserByListenerId(db *gorm.DB, listenerId int) (Listener, error) {
	var user Listener
	fmt.Printf("FindUserByListenerIdで受け取ったlistenerId= %v \n", listenerId)
	result := db.Where("listener_id = ?", listenerId).First(&user)
	fmt.Printf("Idで取得したuser= %v \n", user)
	return user, result.Error
}
