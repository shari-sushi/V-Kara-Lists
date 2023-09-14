package crud

//
//DBからデータ取得してjsonデータをフロントへ送信する時の違い
//

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/t0016Gointernal/utility"
)

var m = "www.youtube.com/live/AlHRqSsF--8"

// 狙い：下の9つのfieldをjsonで送る
// streamer_id,
// streamer_name,
// movie_id,
// movie_url,
// movie_title,
// song_id,
// sing_start,
// song

//以下のクエリは同じ：3つのtableをleft joinし、9つのcolumnをselect、whereで指定したデータを取得
//.Find()の中身が異なる
func A(c *gin.Context) {
	// 最後が.Find(&alls)
	utility.Db.Model(&kas).Select("streamer_id, streamer_name, movie_id,  movie_url, movie_title, song_id, sing_start, song").Where("movie_url = ?", m).Joins("LEFT JOIN movies m USING(movie_url)").Joins("LEFT JOIN streamers s USING(streamer_id)").Find(&alls)

	c.JSON(http.StatusOK, gin.H{
		"karaoke_lists": alls,
		//構造体AllDataのそのままの形だが、selectしたデータ以外はnill。
		// {"StreamerId":1,
		// "StreamerName":"妹望おいも",
		// "NameKana":"",
		// "SelfIntro_url":"",
		// "StreamInputer_id":"",
		// "MovieId":1,
		// "MovieUrl":"www.youtube.com/live/AlHRqSsF--8",
		// "MovieTitle":"【歌枠リレー】歌う【妹望おいも】",
		// "SongId":2,
		// "SingStart":null,
		// "Song":"HAPPYBIRTHDAY",
		// "SongInputerId":""}]}
	})
}

func B(c *gin.Context) {
	// 最後が.Find(&kas)
	utility.Db.Model(&kas).Select("streamer_id, streamer_name, movie_id,  movie_url, movie_title, song_id, sing_start, song").Where("movie_url = ?", m).Joins("LEFT JOIN movies m USING(movie_url)").Joins("LEFT JOIN streamers s USING(streamer_id)").Find(&kas)

	c.JSON(http.StatusOK, gin.H{
		"karaoke_lists": kas,
	})
	// 構造体KaraokeListのそままの形。（selectではもっと多くのデータを取得してはいる。）
	// "MovieUrl":"www.youtube.com/live/AlHRqSsF--8",
	// "SongId":2,
	// "SingStart":null,
	// "Song":"HAPPYBIRTHDAY",
	// "SongInputerId":""}]}
}
