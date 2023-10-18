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

type AllDate struct {
	vts types.Vtuber
	mos types.Movie
	kar types.KaraokeList
}

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

// VtuberとMovieを全件取得する共通処理
func fetchVtubersJoinMovies(vts []types.Vtuber) ([]*types.VtuberMovie, error) {
	var vtsmos []*types.VtuberMovie
	resultVtsmo := utility.Db.Model(&vts).Select("vtubers.vtuber_id, vtubers.vtuber_name, mo.movie_url, mo.movie_title").Joins("LEFT JOIN movies  mo USING(vtuber_id)").Scan(&vtsmos)
	return vtsmos, resultVtsmo.Error
}

// SELECT
// vtubers.vtuber_id, vtubers.vtuber_name,
// mo.movie_url, mo.movie_title
// FROM `vtubers`
// LEFT JOIN movies  mo USING(vtuber_id)

///　/top
func ReadAllVtubersAndMovies(c *gin.Context) {
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

// ↑　SELECT
// vtuber_id, vtuber_name,
// movie_url,  movie_title,
// karaoke_list_id, sing_start, song_name, karaoke_list_inputer_id
// FROM karaoke_lists
// LEFT JOIN movies  USING(movie_url)
// LEFT JOIN vtubers  USING(vtuber_id);

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

// ↑　SELECT
// vtuber_id, vtuber_name,
// movie_id,  movie_url,  movie_title,
// song_id,  sing_start,  song
// FROM karaoke_lists k
// LEFT JOIN movies m USING(movie_url)
// LEFT JOIN vtubers s USING(vtuber_id)
// WHERE movie_url = 'www.youtube.com/live/AlHRqSsF--8';

//	/create/vtuber
// test用　INSERT INTO `vtubers` (vtuber_id, `vtuber_name`,`vtuber_kana`,`intro_movie_url`,`vtuber_inputer_id`) VALUES (4, '宝鐘マリン','houshou_marin',NULL,1)
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
	// isRegisteredAsV := utility.Db.Where("vtuber_name = ?", vts.VtuberName).Find(&vts)
	utility.Db.Where("vtuber_name = ?", vts.VtuberName).Find(&vts)

	fmt.Printf("既存登録確認　isRegisteredAsV = %d \n", *&vts.VtuberId)
	if *&vts.VtuberId != 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "そのVTuber名は登録済みです"})
		return
	}
	fmt.Printf("Find後vts = %v \n", vts)

	utility.Db.Omit("vtuber_id").Create(&vts)
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

//	/create/movie
func CreateMovie(c *gin.Context) {
	var mo types.Movie
	var vt types.Vtuber

	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", mo)

	// _idのvtuberがいるか確認
	vt.VtuberId = *mo.VtuberId
	utility.Db.Find(&vt)
	if vt.VtuberName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "未登録のVTuberIdです",
		})
		return
	}

	// 既存チェック(movieにmovie_urlが登録済みならエラーを返す)だけど、不要な気がする
	// var dummy types.Movie
	// result := utility.Db.Where("movie_url = ?", mo.MovieUrl).Find(&dummy)
	// if result.Error != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "その動画urlは登録済みです",
	// 		"Error":   result.Error,
	// 	})
	// 	return
	// }

	result := utility.Db.Create(&mo)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "動画の登録に失敗しました。既存URLは登録できません。未登録URLであれば、時間を空けてリトライするか、開発者へお問い合わせください。",
			"開発者":     "@sharin_prog = https://twitter.com/sharin_prog",
			"Error":   result.Error,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "動画を登録しました",
		// "countMessage": fmt.Sprintf("%d人目のVTuberです。", mo.),
	})
}

//	/create/songs
func CreateKaraokeSing(c *gin.Context) {
	var ka types.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたka = %v \n", ka)

	//申請(movie_url)がmoviesに未登録であれば処理停止
	// mo.MovieUrl = ka.MovieUrl
	utility.Db.Model(&mo).Where("movie_url = ?", ka.MovieUrl).First(&mo)
	if mo.VtuberId == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "先に動画を登録してください",
		})
		return
	}

	// 申請(url, sing_start)が重複していれば処理停止
	utility.Db.Model(&ka).Select("karaoke_list_id").Where("movie_url = ? AND sing_start= ?", ka.MovieUrl, ka.SingStart).Order("karaoke_list_id desc").Limit(1).Pluck("karaoke_list_id", &ka.KaraokeListId)
	if ka.KaraokeListId != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "その「動画URLと歌い出し時間」の組み合わせは登録済みです",
		})
		return
	}
	//SELECT `karaoke_list_id` FROM `karaoke_lists` WHERE movie_url = 'www.youtube.com/watch?v=5WzeYsoGCZc' and sing_start = '00:58:19' ORDER BY karaoke_list_id desc LIMIT 1 ;
	//SELECT `karaoke_list_id` FROM `karaoke_lists` WHERE movie_url = 'www.youtube.com/watch?v=5WzeYsoGCZc' AND sing_start '00:58:19' ORDER BY karaoke_list_id desc LIMIT 1
	fmt.Printf("url-sing_startの重複チェックで取得したka.KaraokeListId= %v \n", ka.KaraokeListId)

	// karaoke_listsに登録されてるwher movie_url=における最大idを取得。次の行で+1する
	utility.Db.Model(&ka).Select("karaoke_list_id").Where("movie_url = ?", ka.MovieUrl).Order("karaoke_list_id desc").Limit(1).Pluck("karaoke_list_id", &ka.KaraokeListId)
	fmt.Printf("取得したka.KaraokeListId= %v \n", ka.KaraokeListId)
	ka.KaraokeListId = ka.KaraokeListId + 1
	// ka.KaraokeListId ++ +=できない??
	fmt.Printf("ka.KaraokeListId+1= %v \n", ka.KaraokeListId)
	// utility.Db.Omit("").Create(&ka)
	result := utility.Db.Create(&ka)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "歌登録エラー",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "歌枠の曲を登録しました。",
	})
}
func CreateSong(c *gin.Context) {}

//データ編集
func EditVtuber(c *gin.Context) {
	var vt types.Vtuber
	err := c.ShouldBind(&vt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", vt)

	//JWTの認証情報、今回の申請者、最初の登録者が一致していればupdateへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *vt.VtuberInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}
	var dummyVt types.Vtuber
	utility.Db.Select("vtuber_inputer_id").Where("vtuber_id = ?", vt.VtuberId).First(&dummyVt)
	fmt.Printf("dummyVt.VtuberInputerId = %v,\n   vt.VtuberInputerId= %d \n", *dummyVt.VtuberInputerId, *vt.VtuberInputerId)
	if *dummyVt.VtuberInputerId != *vt.VtuberInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	fmt.Print("bindしたvts = ", vt.VtuberName, *vt.VtuberKana, *vt.VtuberInputerId, vt.VtuberId, *vt.IntroMovieUrl)

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(types.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
	result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(vt)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "編集に失敗しました。vtuber_idと名前が位置していない可能性があります(間違ったvtuber_id、同じnameで申請するとnameのuniqueで引っ掛かる)",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "VTuberの情報を更新しました。",
	})
}
func EditMovie(c *gin.Context) {
	var mo types.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの url=%v, inputerId=%d, motitle=%v, VtId=%d \n", mo.MovieUrl, *mo.MovieInputerId, *mo.MovieTitle, *mo.VtuberId)

	// JWTの認証情報、今回の申請者(httpリクエストの情報)、最初の登録者
	// の３つの情報が全て一致していればupdateへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *mo.MovieInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}

	var dummyMo types.Movie
	utility.Db.Select("movie_inputer_id").Where("movie_url = ?", mo.MovieUrl).First(&dummyMo)
	fmt.Printf("dummyMo = %v\n", dummyMo)
	fmt.Printf("dummyMo.MovieInputerId = %d,\n mo.MovieInputerId= %d \n", *dummyMo.MovieInputerId, *mo.MovieInputerId)
	if *dummyMo.MovieInputerId != *mo.MovieInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(types.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
	result := utility.Db.Model(&mo).Where("movie_url = ?", mo.MovieUrl).Updates(mo)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Movieの情報を更新しました。",
	})
}
func EditKaraokeSing(c *gin.Context) {
	var ka types.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	// JWTの認証情報、今回の申請者(httpリクエストの情報)、最初の登録者
	// の３つの情報が全て一致していればupdateへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *&ka.KaraokeListInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}

	var dummyKa types.KaraokeList
	utility.Db.Select("karaoke_list_inputer_id").Where("karaoke_list_id = ?", ka.KaraokeListId).First(&dummyKa)
	fmt.Printf("dummyKo = %v\n", dummyKa)
	fmt.Printf("dummyKo.KaraokeListInputerId = %d,\n ka.KaraokeListInputerId= %d \n", *&dummyKa.KaraokeListInputerId, *&ka.KaraokeListInputerId)
	if *&dummyKa.KaraokeListInputerId != *&ka.KaraokeListInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(types.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
	result := utility.Db.Model(&ka).Where("karaoke_list_id = ?", ka.KaraokeListId).Updates(ka)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "編集に失敗しました。vtuber_idと名前が位置していない可能性があります(間違ったvtuber_id、同じnameで申請するとnameのuniqueで引っ掛かる)",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "karaoke_listの情報を更新しました。",
	})
}
func EditSong(c *gin.Context) {}

// データ削除(物理)

// vtuber_id、vtuber_nameの両方がDBと一致していれば削除
func DeleteVtuber(c *gin.Context) {
	var vt types.Vtuber
	err := c.ShouldBind(&vt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvt = %v \n", vt)

	//JWTの認証情報、今回の申請者、最初の登録者が一致していればdeleteへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *vt.VtuberInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}
	var dummyVt types.Vtuber
	utility.Db.Select("vtuber_inputer_id").Where("vtuber_id = ?", vt.VtuberId).First(&dummyVt)
	fmt.Printf("dummyVt.VtuberInputerId = %v,\n   vt.VtuberInputerId= %d \n", *dummyVt.VtuberInputerId, *vt.VtuberInputerId)
	if *dummyVt.VtuberInputerId != *vt.VtuberInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	fmt.Printf("bindしたvtのvt.VtuberName= %v, *vt.VtuberInputerId = %d, vt.VtuberId =%d \n ", vt.VtuberName, *vt.VtuberInputerId, vt.VtuberId)

	result := utility.Db.Model(&vt).Where("vtuber_id = ? AND vtuber_name = ?", vt.VtuberId, vt.VtuberName).Delete(vt)
	// utility.Db.Where("vtuber_id = ?", vt.VtuberId).Delete(vt)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "削除に失敗しました。vtuber_idとvtuber_nameがDBと一致していない可能性があります(Where tuber_id=  AND vtuber_name= )",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "VTuberの情報を削除しました。",
	})
}
func DeleteMovie(c *gin.Context) {
	var mo types.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの url=%v, inputerId=%d, VtId=%d \n", mo.MovieUrl, *mo.MovieInputerId, *mo.VtuberId)

	// JWTの認証情報、今回の申請者(httpリクエストの情報)、最初の登録者
	// の３つの情報が全て一致していればdeleteへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *mo.MovieInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}
	var dummyMo types.Movie
	utility.Db.Select("movie_inputer_id").Where("movie_url = ?", mo.MovieUrl).First(&dummyMo)
	fmt.Printf("dummyMo = %v\n", dummyMo)
	fmt.Printf("dummyMo.MovieInputerId = %d,\n mo.MovieInputerId= %d \n", *dummyMo.MovieInputerId, *mo.MovieInputerId)
	if *dummyMo.MovieInputerId != *mo.MovieInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(types.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
	result := utility.Db.Model(&mo).Where("movie_url = ? AND vtuber_id = ?", mo.MovieUrl, mo.VtuberId).Delete(mo)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Movieの情報を削除しました。",
	})
}
func DeleteKaraokeSing(c *gin.Context) {
	var ka types.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	// JWTの認証情報、今回の申請者(httpリクエストの情報)、最初の登録者
	// の３つの情報が全て一致していればupdateへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId != *&ka.KaraokeListInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "入力者の認証情報が不正です",
		})
		return
	}

	var dummyKa types.KaraokeList
	utility.Db.Select("karaoke_list_inputer_id").Where("karaoke_list_id = ?", ka.KaraokeListId).First(&dummyKa)
	fmt.Printf("dummyKo = %v\n", dummyKa)
	fmt.Printf("dummyKo.KaraokeListInputerId = %d,\n ka.KaraokeListInputerId= %d \n", *&dummyKa.KaraokeListInputerId, *&ka.KaraokeListInputerId)
	if *&dummyKa.KaraokeListInputerId != *&ka.KaraokeListInputerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(types.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
	result := utility.Db.Model(&ka).Where("karaoke_list_id = ? AND  song_name = ?", ka.KaraokeListId, ka.SongName).Delete(ka)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "編集に失敗しました。vtuber_idと名前が位置していない可能性があります(間違ったvtuber_id、同じnameで申請するとnameのuniqueで引っ掛かる)",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "karaoke_listの情報を削除しました。",
	})
}
func DeleteSong(c *gin.Context) {}

// プルダウンメニューに使用
func ReadAllVtubersName(c *gin.Context) {
	vts, errV := fetchVtubers()
	if errV != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": errV.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers": vts,
	})
}
func ReadMovieTitlesOfTheVTuber(c *gin.Context) {
	var mo types.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの VtId=%d \n", *mo.VtuberId)

	var returnMoOftheV []types.Movie
	utility.Db.Where("vtuber_id = ?", mo.VtuberId).Find(&returnMoOftheV)

	for _, mo := range returnMoOftheV {
		fmt.Printf("returnMo = %v, %v\n", mo.MovieTitle, mo.MovieUrl)
	}
	c.JSON(http.StatusOK, gin.H{
		"movies": returnMoOftheV,
	})
}
func ReadKaraokeListsOfTheMovie(c *gin.Context) {
	var ka types.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの VtId=%d \n", &ka.MovieUrl)

	var returnKaOfTheMo []types.KaraokeList
	utility.Db.Where("movie_url = ?", ka.MovieUrl).Find(&returnKaOfTheMo)
	for _, ka := range returnKaOfTheMo {
		fmt.Printf("returnMo = %v, %v\n", ka.SongName, ka.MovieUrl)
	}

	c.JSON(http.StatusOK, gin.H{
		"karaoke_lists": returnKaOfTheMo,
	})
}
func ReadAllSongs(c *gin.Context) {}

// vtuber, mobie, karaokeをjoinせずに取得
func ReadAllDate(c *gin.Context) {
	var vts []types.Vtuber
	var mos []types.Movie
	var kas []types.KaraokeList
	var err error
	resultVts := utility.Db.Find(&vts)
	if resultVts.Error != nil {
		// return nil, resultVts.Error
		err = resultVts.Error
	}
	resultMos := utility.Db.Find(&mos)
	if resultMos.Error != nil {
		// return "", resultMos.Error
		err = resultMos.Error
	}
	resultKas := utility.Db.Find(&kas)
	if resultKas != nil {
		// return "", resultKas
		err = resultVts.Error
	}

	// var alldate []AllDate
	// alldate = vts, mos, kas

	c.JSON(http.StatusOK, gin.H{
		"message":  "メインコンテンツの全データをjoinせずに取得。の結果",
		"err":      err,
		"vtubers":  vts,
		"movies":   mos,
		"karaokes": kas,
	})
}

// 20231017 3:40のメモ
