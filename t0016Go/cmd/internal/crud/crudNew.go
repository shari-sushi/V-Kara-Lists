package crud

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/internal/types"
	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

// var all types.AllData
// var alls []types.AllData
var streamer types.Streamer
var streamers []types.Streamer
var mo types.Movie
var mos []types.Movie
var ka types.KaraokeList
var kas []types.KaraokeList

var stsmo types.StremerMovie
var stsmos []*types.StremerMovie //Scan()するからポインタ？

var all types.AllColumns
var alls []*types.AllColumns

// var movie Movie
// var movies []Movie
// var karaokeList KaraokeList
// var karaokelists []KaraokeList

func GetAllStreamers(c *gin.Context) {
	/////streamers 全件取得
	resultSts := utility.Db.Find(&streamers)
	if resultSts.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": resultSts.Error.Error()})
		return
	}

	////streamers, movies joinして全件取 ReadMoviesに同じ
	resultStsmo := utility.Db.Model(&streamers).Select("streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title").Joins("LEFT JOIN movies m USING(streamer_id)").Scan(&stsmos)
	// SELECT ~略~ FROM streamers LEFT JOIN movies m USING streamer_id
	if resultStsmo.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultStsmo.Error.Error()})
		return
	}
	// for resultStsmo.Next() {
	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

	// }

	c.JSON(http.StatusOK, gin.H{
		"streamers":                  streamers,
		"streamers_and_moviesmovies": stsmos,
	})
}

func PostStreamer(c *gin.Context)    {}
func PutStreamer(c *gin.Context)     {}
func DeletetStreamer(c *gin.Context) {}

func ReadMovies(c *gin.Context) {
	////推しの全動画リストを取得
	q := c.Query("streamer_id")

	resultStsmo := utility.Db.Model(&streamers).Select("streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title").Where("streamer_id = ?", q).Joins("LEFT JOIN movies m USING(streamer_id)").Scan(&stsmos)
	// SELECT ~略~ FROM streamers LEFT JOIN movies m USING streamer_id
	if resultStsmo.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultStsmo.Error.Error()})
		return
	}
	// for resultStsmo.Next() {
	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

	// }

	c.JSON(http.StatusOK, gin.H{
		"streamers_and_moviesmovies": stsmos,
	})
}

func ReadSings(c *gin.Context) {
	q := c.Query("movie_url")
	// movie_url, _ := strconv.Atoi(m)
	fmt.Printf("%v \n", q)
	utility.Db.Model(&kas).Select("streamer_id, streamer_name, movie_id,  movie_url, movie_title, song_id, sing_start, song").Where("movie_url = ?", q).Joins("LEFT JOIN movies m USING(movie_url)").Joins("LEFT JOIN streamers s USING(streamer_id)").Find(&alls)

	c.JSON(http.StatusOK, gin.H{
		"karaoke_lists": alls,
	})

	// SELECT
	// streamer_id, streamer_name,
	// movie_id,  movie_url,  movie_title,
	// song_id,  sing_start,  song
	// FROM karaoke_lists k
	// LEFT JOIN movies m USING(movie_url)
	// LEFT JOIN streamers s USING(streamer_id)
	// WHERE movie_url = 'www.youtube.com/live/AlHRqSsF--8';
}

// func ReadAllData(c *gin.Context) {
// 	/////streamers 全件取得
// 	resultSts := utility.Db.Find(&streamers)
// 	if resultSts.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": resultSts.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"streamers": streamers,
// 	})

// 	////streamers, movies joinして全件取
// 	resultStsmo := utility.Db.Model(&streamers).Select("streamers.streamer_id, streamers.streamer_name, m.movie_id, m.movie_url, m.movie_title").Joins("LEFT JOIN movies m USING streamer_id").Scan(&stsmos)
// 	// SELECT ~略~ FROM streamers LEFT JOIN movies m USING streamer_id
// 	if resultStsmo.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultSts.Error.Error()})
// 		return
// 	}
// 	// for stsmo.Next() {
// 	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

// 	// }

// 	c.JSON(http.StatusOK, gin.H{

// 		"streamers_and_moviesmovies": stsmo,
// 	})
// }

func CreateStreamer(c *gin.Context) {
	// result := utility.Db.Find(&mos)

}

//―――パターン①　tableを個別に取得して2つのjsonを送付
// func ReadAllData(c *gin.Context) {
// 	/////streamers 全件取得
// 	resultSts := utility.Db.Find(&streamers)

// 	if resultSts.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": resultSts.Error.Error()})
// 		return
// 	}

// 	////movies 全件取
// 	resultMos := utility.Db.Find(&mos)
// 	if resultSts.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": resultMos.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"streamers": streamers,
// 		"movies":    mos,
// 	})
// }

// func CreateStreamer(c *gin.Context) {
// 	// result := utility.Db.Find(&mos)

// }

// func Index2(w http.ResponseWriter, r *http.Request) {
// 	rows, err := utility.Db.Query("SELECT * FROM karaokelist")
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var items []karaokelist //長さと容量が0のスライス、karaokelist型
// 	for rows.Next() {
// 		var k karaokelist
// 		fmt.Printf("k定義直後の中身%v\n", k) // k は 0および空(nil?)
// 		if err := rows.Scan(&k.Unique_id, &k.Movie, &k.Url, &k.SingStart, &k.Song); err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		items = append(items, k)           // itmemsスライスにkを追加する
// 		fmt.Printf("append直後のkの中身%v\n", k) //kには全データが入ってる
// 	}

// 	if err := rows.Err(); err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	if err := json.NewEncoder(w).Encode(items); err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 	}
// }

// func Show2(w http.ResponseWriter, r *http.Request) {
// 	unique_id := r.URL.Query().Get("Unique_id")
// 	row := utility.Db.QueryRow("SELECT * FROM karaokelist WHERE unique_id = ?", unique_id)
// 	fmt.Printf("showにてQueryRowで取得したidは%s。rowデータは%s\n", unique_id, row) //この時点ではnill

// 	kList := karaokelist{}
// 	err := row.Scan(&kList.Unique_id, &kList.Movie, &kList.Url, &kList.SingStart, &kList.Song)

// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			http.NotFound(w, r)
// 			return
// 		} else {
// 			http.Error(w, http.StatusText(500), 500)
// 			return
// 		}
// 	}

// 	json.NewEncoder(w).Encode(kList)
// 	fmt.Printf("Enode後showにて取得したidは%s。kListは%v\n※", unique_id, kList)
// }
