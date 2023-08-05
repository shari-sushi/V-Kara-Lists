package article

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/sharin-sushi/0016go_next_relation/t0016Go/internal/utility"
)

type karaokelist struct {
	Unique_id int    `json:"unique_id"`
	Movie     string `json:"movie"`
	Url       string `json:"url"`
	SingStart string `json:"singStart"`
	Song      string `json:"song"`
}

func Index(w http.ResponseWriter, r *http.Request) {
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

func Show(w http.ResponseWriter, r *http.Request) {
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

// kList直書きテスト
func Show4(w http.ResponseWriter, r *http.Request) {
	// デバッグ用にshowをコピペしてきた。
	unique_id := r.URL.Query().Get("Unique_id")
	fmt.Printf("Editでid %sを取得←125行目\n", unique_id)
	row := utility.Db.QueryRow("SELECT * FROM karaokelist WHERE unique_id = ?", unique_id)
	fmt.Printf("Editでid %s。row%sを取得\n", unique_id, row)

	kList := karaokelist{
		Unique_id: 1,
		Movie:     "【歌枠リレー】歌う【妹望おいも】",
		Url:       "https://www.youtube.com/live/AlHRqSsF--8",
		SingStart: "51:08",
		Song:      "ファンサ",
	}

	// kList := karaokelist{}
	// err := row.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)

	// if err != nil {
	// 	if err == sql.ErrNoRows {
	// 		http.NotFound(w, r)
	// 		return
	// 	} else {
	// 		http.Error(w, http.StatusText(500), 500)
	// 		return
	// 	}
	// }

	// kList = {1, "【歌枠リレー】歌う【妹望おいも】", "https://www.youtube.com/live/AlHRqSsF--8", "51:08", "ファンサ"}
	json.NewEncoder(w).Encode(kList)
	fmt.Printf("editでid %s、row %vを返した※Enode後\n", unique_id, kList)
}

// url生成しようかと思ったけどJSやるからいいや
// func Makelink() {
// 	var ybLink *template.Template
// 	ybLink = template.Must(template.ParseFiles("show.html"))
// 	var Utube = "&t="
// 	err := ybLink.Execute(os.Stdout, Utube) // dataは渡さない
// 	if err != nil {
// 		log.Fatalln(err)
// 	}

// }

func Create(w http.ResponseWriter, r *http.Request) {
	kList := karaokelist{}
	if r.Method == "GET" {
		// tmpl.ExecuteTemplate(w, "create.html", nil)
		tmpl, err := template.ParseFiles("create.html")
		if err != nil {
			fmt.Printf("Failed to parse createtemplate: %s", err)
			log.Fatal(err)
		}

		if err := tmpl.Execute(w, kList); err != nil {
			fmt.Printf("Failed to execute createtemplate: %s", err)
			log.Fatal(err)
		}

		fmt.Println("GET受信")
	} else if r.Method == "POST" {
		fmt.Println("POST受信")
		// Unique_id := r.FormValue("Unique_id")
		//""の中の
		Movie := r.FormValue("Movie")
		Url := r.FormValue("url")
		SingStart := r.FormValue("singStart")
		Song := r.FormValue("song")
		fmt.Println("klist:", Movie, Url, SingStart, Song)
		insert, err := utility.Db.Prepare("INSERT INTO KaraokeList(movie, url, singStart, song) VALUES(?,?,?,?)")
		if err != nil {
			panic(err.Error())
		}
		insert.Exec(Movie, Url, SingStart, Song)
		fmt.Println("klist:", insert)

		http.Redirect(w, r, "/", 301)
	}
}

func Edit4(w http.ResponseWriter, r *http.Request) {
	// デバッグ用にshowをコピペしてきた。
	unique_id := r.URL.Query().Get("Unique_id")
	fmt.Printf("Editでid %sを取得←125行目\n", unique_id)
	row := utility.Db.QueryRow("SELECT * FROM karaokelist WHERE unique_id = ?", unique_id)
	fmt.Printf("Editでid %s。row%sを取得\n", unique_id, row)

	kList := karaokelist{
		Unique_id: 1,
		Movie:     "【歌枠リレー】歌う【妹望おいも】",
		Url:       "https://www.youtube.com/live/AlHRqSsF--8",
		SingStart: "51:08",
		Song:      "ファンサ",
	}

	// kList := karaokelist{}
	// err := row.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)

	// if err != nil {
	// 	if err == sql.ErrNoRows {
	// 		http.NotFound(w, r)
	// 		return
	// 	} else {
	// 		http.Error(w, http.StatusText(500), 500)
	// 		return
	// 	}
	// }

	// kList = {1, "【歌枠リレー】歌う【妹望おいも】", "https://www.youtube.com/live/AlHRqSsF--8", "51:08", "ファンサ"}
	json.NewEncoder(w).Encode(kList)
	fmt.Printf("editでid %s、row %vを返した※Enode後\n", unique_id, kList)
}

func Edit(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		unique_id := r.URL.Query().Get("Unique_id")
		//urlのuniqueid=の値を取得

		// ↓の手打ち selected, err := utility.Db.Query("SELECT * FROM KaraokeList WHERE unique_id=1")
		selected, err := utility.Db.Query("SELECT * FROM KaraokeList WHERE unique_id=?", unique_id)
		if err != nil {
			panic(err.Error())
		}
		// updata処理
		kList := karaokelist{}
		for selected.Next() {
			err = selected.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)
			if err != nil {
				panic(err.Error())
			}
			fmt.Printf("selectした値: %v", selected)
		}
		selected.Close() //メモリ解放

		json.NewEncoder(w).Encode(kList)
		fmt.Printf("Editにて取得したidは%s。rowデータは%v\n※Encode後\n", unique_id, kList)

	} else if r.Method == "POST" {
		fmt.Printf("postが通った")
		var kList karaokelist
		err := json.NewDecoder(r.Body).Decode(&kList)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		Unique_id := r.FormValue("Unique_id")
		Movie := r.FormValue("Movie")
		Url := r.FormValue("url")
		SingStart := r.FormValue("singStart")
		Song := r.FormValue("song")
		fmt.Printf("unique_id=%s, movie=%s, url=%s, singStart=%s, song=%s ", Unique_id, Movie, Url, SingStart, Song)
		fmt.Println("klist:", Unique_id, Movie, Url, SingStart, Song)
		database, err := utility.Db.Prepare("UPDATE KaraokeList SET movie=?, url=?, singStart=?, song=? WHERE unique_id=?")
		if err != nil {
			panic(err.Error())
		}
		result, err := database.Exec(Movie, Url, SingStart, Song, Unique_id)
		if err != nil {
			panic(err.Error())

		}
		fmt.Println(result)

		http.Redirect(w, r, "/", 301)
		fmt.Printf("POSTリクエストです")
	} else {
		fmt.Printf("POSTリクエストではありません")
	}
}

func Delete(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		unique_id := r.URL.Query().Get("Unique_id")

		selected, err := utility.Db.Query("SELECT * FROM KaraokeList WHERE unique_id=?", unique_id)
		if err != nil {
			panic(err.Error())
		}
		kList := karaokelist{}
		for selected.Next() {
			err = selected.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)
			if err != nil {
				panic(err.Error())
			}
		}
		selected.Close()
		tableDate, err := template.ParseFiles("delete.html")
		if err != nil {
			fmt.Printf("Failed to edit'parse template: %s", err)
			log.Fatal(err)
		}

		if err := tableDate.Execute(w, kList); err != nil {
			fmt.Printf("Failed to edit'execute template: %s", err)
			log.Fatal(err)
		}

		// tmpl.ExecuteTemplate(w, "delete.html", kList)
	} else if r.Method == "POST" {
		Unique_id := r.FormValue("Unique_id")
		insert, err := utility.Db.Prepare("DELETE FROM KaraokeList WHERE unique_id=?")
		if err != nil {
			panic(err.Error())
		}
		insert.Exec(Unique_id)
		//検索結果を取得しない場合（create, insert, update, delete）
		http.Redirect(w, r, "/", 301)
	}
}

// SQLのロールバック ROLLBACK;
// なお、コミットcommit; 後は不可能
