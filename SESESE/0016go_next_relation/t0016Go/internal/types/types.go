package types

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/sharin-sushi/002216go_next_relation/t0022Go/internal/controller/crypto"

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

type StreamerMovie struct {
	Streamer
	Movie
}

//GORMなのに何故か `json:"~~"`が無いとスネークにならない

type Streamer struct {
	StreamerId      int     `gorm:"primaryKey"` //`json:"streamer_id"` //
	StreamerName    string  //`json:"streamer_name"`
	NameKana        *string //`json:"name_kana"`
	SelfIntroUrl    *string //`json:"self_intro_url"`
	StreamInputerId *string //`json:"stream_inputer_id"`
}

type Movie struct {
	StreamerId *int    //`json:"streamer_id"`
	MovieId    *int    //`json:"movie_id"`
	MovieUrl   string  `gorm:"primaryKey"` //`json:"movie_url"`
	MovieTitle *string //`json:"movie_title"`
}

type KaraokeList struct {
	MovieUrl      string  `gorm:"primaryKey"` //
	SongId        int     `gorm:"primaryKey"` //`json:"song_id"`
	SingStart     *string //`json:"sing_start"` //nill可にするためのポインタ
	Song          string  //`json:"song"`
	SongInputerId string  //`json:"song_inputer_id"`
}

// コピペ用全カラム
// ーーキャメル
type AllColumns struct {
	StreamerId       int
	StreamerName     string
	NameKana         string
	SelfIntro_url    string
	StreamInputer_id string
	MovieId          int
	MovieUrl         string
	MovieTitle       string
	SongId           int
	SingStart        *string
	Song             string
	SongInputerId    string
}

//ーーースネーク
// streamer_id
// streamer_name
// name_kana
// self_intro_url
// stream_inputer_id
// movie_id
// movie_url
// movie_title
// song_id
// sing_start
// song
// song_inputer_id

//最初、シンボル変更できなかったので、どこかで変更残りがあるかも User→Member
type Member struct { //dbに対してはtable名 小文字かつ複数形に自動変換
	//gorm.Model CreatedAtは機能無し
	MemberId   string `gorm:"primaryKey"`
	MemberName string
	Email      string
	Password   string
	CreatedAt  time.Time
}

type EntryMember struct {
	//gorm.Model CreatedAtは機能無し
	// MemberId   string
	MemberName string
	Email      string
	Password   string
}

type UserInfoFromFront struct { //dbに対してはtable名 小文字かつ複数形に自動変換
	//gorm.Model CreatedAtは機能無し
	MemberId   string
	MemberName string
	Email      string
	Password   string
}

func (m *Member) CreateMember(db *gorm.DB) (Member, error) { //Member構造体の型で新規発行したIDと共にユーザー情報を返す
	fmt.Printf("CreateMemberで使用されるm= %v \n", m)

	user := Member{
		MemberName: m.MemberName,
		Email:      m.Email,
		Password:   crypto.PasswordEncryptNoBackErr(m.Password),
	}
	// ここまで動作確認

	newId, err := CreateNewUserId(db) //最新ユーザーのidから新規ユーザーidを発行
	if err != nil {
		fmt.Printf("Failed create a new id")
		return user, err
	}
	fmt.Println(2.3)
	user.MemberId = newId
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
func (m *Member) Validate() error {
	err := validation.ValidateStruct(m,
		validation.Field(&m.MemberName,
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

// members
// +-------------+--------------+------+-----+-------------------+-------------------+
// | Field       | Type         | Null | Key | Default           | Extra             |
// +-------------+--------------+------+-----+-------------------+-------------------+
// | member_id   | varchar(4)   | NO   | PRI | NULL              |                   |
// | member_name | varchar(20)  | NO   | MUL | NULL              |                   |
// | email       | varchar(100) | NO   | UNI | NULL              |                   |
// | password    | varchar(100) | NO   |     | NULL              |                   |
// | created_at  | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +-------------+--------------+------+-----+-------------------+-------------------+

func FindUserByEmail(db *gorm.DB, email string) (Member, error) {
	var user Member
	result := db.Where("email = ?", email).First(&user)
	fmt.Printf("Emailで取得したuser= %v \n", user)
	return user, result.Error
}

func FindUserByMemberId(db *gorm.DB, memberId string) (Member, error) {
	var user Member
	fmt.Printf("FindUserByMemberIdで受け取ったmemberId= %v \n", memberId)
	result := db.Where("member_id = ?", memberId).First(&user)
	fmt.Printf("Idで取得したuser= %v \n", user)
	return user, result.Error
}

func CreateNewUserId(db *gorm.DB) (string, error) { //最新ユーザーのIDを取得し、+1して返す
	var lastUser Member
	result := db.Select("member_id ").Last(&lastUser)
	// SELECT member_id From members  ORDER BY member_id DESC LIMIT 1;
	if result.Error != nil {
		fmt.Println("最新ユーザーのid取得に失敗しました。error:", result.Error)
	}
	fmt.Printf("lastUser= %v", lastUser)

	fmt.Printf("lastUser.MemberId= %v", lastUser.MemberId)

	parts := strings.Split(lastUser.MemberId, "L") //　"", "1"に分ける(Lは消える)
	fmt.Printf("parts= %v", parts)

	if len(parts) != 2 { // Lで分割し\、要素数が2でなければエラー
		return "", errors.New("invalid MemberId format")
	}
	fmt.Println(3.2)

	lastUserIdNum := parts[1]
	fmt.Println(3.3)
	s, _ := strconv.Atoi(lastUserIdNum)
	s++
	fmt.Printf("newIdNum= %v \n", s)
	i := strconv.Itoa(s)
	fmt.Println(3.4)
	newId := "L" + i
	fmt.Printf("newId= %v \n", newId)

	return newId, nil
}
