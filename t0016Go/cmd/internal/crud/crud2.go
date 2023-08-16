package crud

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

// type karaokelist struct {
// 	Unique_id int    `json:"unique_id"`
// 	Movie     string `json:"movie"`
// 	Url       string `json:"url"`
// 	SingStart string `json:"singStart"`
// 	Song      string `json:"song"`
// }

//入力順
type allColumns struct {
	streamer_id       int //`json:" "s.streamer_id"`
	streamer_name     string
	name_kana         string
	self_intro_url    string
	stream_inputer_id string
	movie_id          int
	movie_url         string
	movie_title       string
	song_id           int
	sing_start        *string //nill可にするためのポインタ
	song              string
	song_inputer_id   string
}

func Join(w http.ResponseWriter, r *http.Request) {
	// s := "s.streamer_id, s.streamer_name, s.name_kana, s.self_intro_url, s.stream_inputer_id "
	// m := "m.movie_id, m.movie_url, m.movie_title, "
	// k := "k.song_id, k.sing_start, k.song, k.song_inputer_id "
	// joinSM := "FROM streamers s LEFT JOIN movies m USING(streamer_id) "
	// joinK := "LEFT JOIN karaoke_lists k	USING(movie_url)"
	// rows, err := utility.Db.Query("SELECT ? ? ? ? ?", s, m, k, joinSM, joinK)
	// rows, err := utility.Db.Query("SELECT ?, ?, ? FROM streamers s LEFT JOIN movies m USING(streamer_id) LEFT JOIN karaoke_lists k USING(movie_url);", s, m, k)

	rows, err := utility.Db.Query("SELECT s.streamer_id, s.streamer_name, s.name_kana, s.self_intro_url, s.stream_inputer_id, m.movie_id, m.movie_url, m.movie_title, k.song_id, k.sing_start, k.song, k.song_inputer_id FROM streamers s LEFT JOIN movies m USING(streamer_id) LEFT JOIN karaoke_lists k USING(movie_url);")

	fmt.Printf("実行したクエリは%v", rows)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []allColumns //長さと容量が0のスライス、karaokelist型
	fmt.Printf("itemの中身(空であることを期待)%v\n", items)
	for rows.Next() {
		var smk allColumns
		fmt.Printf("smk定義直後の中身%v\n", smk) // smk は 0および空(nil?)
		if err := rows.Scan(&smk.streamer_id, &smk.streamer_name, &smk.name_kana, &smk.self_intro_url, &smk.stream_inputer_id, &smk.movie_id, &smk.movie_url, &smk.movie_title, &smk.song_id, &smk.sing_start, &smk.song, &smk.song_inputer_id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, smk) // itmemsスライスにsmkを追加する
		fmt.Printf("append直後のitemの中身は%v\n", items)
		fmt.Printf("append直後のsmkの中身%v\n", smk) //smには全データが入ってる
		fmt.Printf("\n")
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

func Index2(w http.ResponseWriter, r *http.Request) {
	rows, err := utility.Db.Query("SELECT * FROM karaokelist")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []karaokelist //長さと容量が0のスライス、karaokelist型
	for rows.Next() {
		var k karaokelist
		fmt.Printf("k定義直後の中身%v\n", k) // k は 0および空(nil?)
		if err := rows.Scan(&k.Unique_id, &k.Movie, &k.Url, &k.SingStart, &k.Song); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, k)           // itmemsスライスにkを追加する
		fmt.Printf("append直後のkの中身%v\n", k) //kには全データが入ってる
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func Show2(w http.ResponseWriter, r *http.Request) {
	unique_id := r.URL.Query().Get("Unique_id")
	row := utility.Db.QueryRow("SELECT * FROM karaokelist WHERE unique_id = ?", unique_id)
	fmt.Printf("showにてQueryRowで取得したidは%s。rowデータは%s\n", unique_id, row) //この時点ではnill

	kList := karaokelist{}
	err := row.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)

	if err != nil {
		if err == sql.ErrNoRows {
			http.NotFound(w, r)
			return
		} else {
			http.Error(w, http.StatusText(500), 500)
			return
		}
	}

	json.NewEncoder(w).Encode(kList)
	fmt.Printf("Enode後showにて取得したidは%s。kListは%v\n※", unique_id, kList)
}
