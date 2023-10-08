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
var vt types.Vtuber
var vts []types.Vtuber
var mo types.Movie
var mos []types.Movie
var ka types.KaraokeList
var kas []types.KaraokeList

var vtsmo types.VtuberMovie
var vtsmos []*types.VtuberMovie //Scan()するからポインタ？

var vtsmoskl types.VtuberMovieKalaokeList
var vtsmoskls []*types.VtuberMovieKalaokeList

var all types.AllColumns
var alls []*types.AllColumns

// var movie Movie
// var movies []Movie
// var karaokeList KaraokeList
// var karaokelists []KaraokeList

// Vtuberを全件取得する共通処理
func fetchVtubers() ([]types.Vtuber, error) {
	var vts []types.Vtuber
	resultVts := utility.Db.Find(&vts)
	return vts, resultVts.Error
}

// Vtuberを全件取得する共通処理
func fetchVtubersJoinMovies(vts []types.Vtuber) ([]*types.VtuberMovie, error) {
	var vtsmos []*types.VtuberMovie
	resultVtsmo := utility.Db.Model(&vts).Select("vtubers.vtuber_id, vtubers.vtuber_name, mo.movie_url, mo.movie_title").Joins("LEFT JOIN movies  mo USING(vtuber_id)").Scan(&vtsmos)
	return vtsmos, resultVtsmo.Error
	// SELECT
	// vtubers.vtuber_id, vtubers.vtuber_name,
	// mo.movie_url, mo.movie_title
	// FROM `vtubers`
	// LEFT JOIN movies  mo USING(vtuber_id)
}

///　/top
func ReadAllVtubers(c *gin.Context) {
	vts, errV := fetchVtubers()
	if errV != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": errV.Error()})
		return
	}

	vtsmos, errVM := fetchVtubersJoinMovies(vts)
	if errVM != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"result VTsmoのerror": errVM.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers":            vts,
		"vtubers_and_movies": vtsmos,
	})
}

//  /sings
func ReadAllSings(c *gin.Context) {
	var vtsmoskls []*types.VtuberMovieKalaokeList
	resultVtsmo := utility.Db.Model(&kas).Select("vtubers.vtuber_id, vtubers.vtuber_name, mo.movie_url, mo.movie_title, karaoke_list_id, sing_start, song_name, karaoke_list_inputer_id").Joins("LEFT JOIN movies  mo USING(movie_url) LEFT JOIN vtubers  USING(vtuber_id)").Scan(&vtsmoskls)
	if resultVtsmo.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"resultStsのerror": resultVtsmo.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers_movies_karaokelists": vtsmoskls,
	})
	// SELECT
	// vtuber_id, vtuber_name,
	// movie_url,  movie_title,
	// karaoke_list_id, sing_start, song_name, karaoke_list_inputer_id
	// FROM karaoke_lists
	// LEFT JOIN movies  USING(movie_url)
	// LEFT JOIN vtubers  USING(vtuber_id);
}
func CreateVtuber(c *gin.Context) {
	var vts types.Vtuber

	err := c.ShouldBind(&vts)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", vts)
	isRegisteredAsV := utility.Db.Where("vtuber_name = ?", vts.VtuberName).Find(&vts)
	if isRegisteredAsV == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "そのVTuber名は登録済みです"})
		return
	}
	fmt.Printf("Find後vts = %v \n", vts)

	utility.Db.Omit("vtuber_id").Create(&vts) // pass pointer of data to Create
	if vts.VtuberId == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "VTuberの登録に失敗しました。ただし、未登録のVTuber名でした。時間を空けてリトライするか、開発者へお問い合わせください。",
			"開発者":     "X(旧twitter)ID : @sharin_prog",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "VTuberを登録しました",
		// "countMessage": fmt.Sprintf("%d人目のVTuberです。", result.RowsAffected),
	})
}

func CreateMovie(c *gin.Context) {
	var mo types.Movie

	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", mo)
	isRegisteredAsV := utility.Db.Where("movie_url = ?", mo.MovieUrl).Find(&mo)
	if isRegisteredAsV == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "その動画urlは登録済みです"})
		return
	}
	fmt.Printf("Find後vts = %v \n", mo)

	utility.Db.Omit("vtuber_id").Create(&mo) // pass pointer of data to Create
	if mo.MovieTitle == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "動画の登録に失敗しました。ただし、未登録のﾀｲﾄﾙでした。時間を空けてリトライするか、開発者へお問い合わせください。",
			"開発者":     "X(旧twitter)ID : @sharin_prog",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "動画を登録しました",
		// "countMessage": fmt.Sprintf("%d人目のVTuberです。", mo.),
	})
}
func DeletetVtuber(c *gin.Context) {}

func ReadMovies(c *gin.Context) {
	////推しの全動画リストを取得
	q := c.Query("vtuber_id")

	resultStsmo := utility.Db.Model(&vts).Select("vtubers.vtuber_id, vtubers.vtuber_name,m.movie_url, m.movie_title").Where("vtuber_id = ?", q).Joins("LEFT JOIN movies m USING(vtuber_id)").Scan(&vtsmos)
	// SELECT ~略~ FROM vtubers LEFT JOIN movies m USING vtuber_id
	if resultStsmo.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsmoのerror": resultStsmo.Error.Error()})
		return
	}
	// for resultStsmo.Next() {
	// 	stsmos.Scan(&stsmo.Streamer.StreamerId, &stsmo.Streamer.StreamerName, &stsmo.Streamer.NameKana, &stsmo.Movie.MovieId, &stsmo.Movie.MovieUrl, &stsmo.Movie.MovieTitle)

	// }

	c.JSON(http.StatusOK, gin.H{
		"vtubers_and_moviesmovies": vtsmos,
	})
}

func ReadSings(c *gin.Context) {
	q := c.Query("movie_url")
	// movie_url, _ := strconv.Atoi(m)
	fmt.Printf("%v \n", q)
	utility.Db.Model(&kas).Select("vtuber_id, vtuber_name, movie_id,  movie_url, movie_title, song_id, sing_start, song").Where("movie_url = ?", q).Joins("LEFT JOIN movies m USING(movie_url)").Joins("LEFT JOIN vtubers s USING(vtuber_id)").Find(&alls)

	c.JSON(http.StatusOK, gin.H{
		"karaoke_lists": alls,
	})
}

// SELECT
// vtuber_id, vtuber_name,
// movie_id,  movie_url,  movie_title,
// song_id,  sing_start,  song
// FROM karaoke_lists k
// LEFT JOIN movies m USING(movie_url)
// LEFT JOIN vtubers s USING(vtuber_id)
// WHERE movie_url = 'www.youtube.com/live/AlHRqSsF--8';

// func ReadAllData(c *gin.Context) {
// 	/////vtubers 全件取得
// 	resultSts := utility.Db.Find(&vtubers)
// 	if resultSts.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": resultSts.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"vtubers": vtubers,
// 	})

func CreateKaraokeSing(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "",
	})
}
func CreateSong(c *gin.Context) {
}

//データ編集
func EditVtuber(c *gin.Context) {
}
func EditMovie(c *gin.Context) {
}
func EditKaraokeSing(c *gin.Context) {
}
func EditSong(c *gin.Context) {
}

// データ削除(論理)
func DeleteVtuber(c *gin.Context) {
}
func DeleteMovie(c *gin.Context) {
}
func DeleteKaraokeSing(c *gin.Context) {
}
func DeleteSong(c *gin.Context) {
}
