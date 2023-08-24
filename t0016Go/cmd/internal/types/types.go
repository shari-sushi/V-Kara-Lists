package types

type AllColumns struct {
	Streamer
	Movie
	KaraokeList
}

type Streamer struct {
	StreamerId      int     `gorm:"primaryKey"` //`json:"streamer_id"`
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
	MovieUrl      string  `gorm:"primaryKey"` //`json:"movie_url"`
	SongId        int     `gorm:"primaryKey"` //`json:"song_id"`
	SingStart     *string //`json:"sing_start"` //nill可にするためのポインタ
	Song          string  //`json:"song"`
	SongInputerId string  //`json:"song_inputer_id"`
}

type Member struct {
	MemberId   string `gorm:"primaryKey"` //`json:"member_id  "`
	MemberName string //`json:"member_name "`
	Email      string //`json:"email  "`
	Password   string //`json:"password"`
	CreatedAt  string //`json:"created_at "`
}

// join後の全カラム
// type AllColumns struct {
// 	Streamer_id       int     `json:"streamer_id"`
// 	Streamer_name     string  `json:"streamer_name"`
// 	Name_kana         string  `json:"name_kana"`
// 	Self_intro_url    string  `json:"self_intro_url"`
// 	Stream_inputer_id string  `json:"stream_inputer_id"`
// 	Movie_id          int     `json:"movie_id"`
// 	Movie_url         string  `json:"movie_url"`
// 	Movie_title       string  `json:"movie_title"`
// 	Song_id           int     `json:"song_id"`
// 	Sing_start        *string `json:"sing_start"` //nill可にするためのポインタ
// 	Song              string  `json:"song"`
// 	Song_inputer_id   string  `json:"song_inputer_id"`
// }
