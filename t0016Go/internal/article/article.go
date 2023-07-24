package article

import (
	"encoding/json"
	"net/http"
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

	var items []karaokelist
	for rows.Next() {
		var k karaokelist
		if err := rows.Scan(&k.Unique_id, &k.Movie, &k.Url, &k.SingStart, &k.Song); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, k)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// Show, Create, Edit, Delete functions are to be defined in similar fashion
