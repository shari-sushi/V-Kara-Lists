package interfaces

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"
)

var vt domain.Vtuber
var vts []domain.Vtuber
var mo domain.Movie
var mos []domain.Movie
var ka domain.KaraokeList
var kas []domain.KaraokeList

var vtsmo domain.VtuberMovie
var vtsmos []*domain.VtuberMovie //Scan()するからポインタ？

var vtsmoskl domain.VtuberMovieKalaokeList
var vtsmoskls []*domain.VtuberMovieKalaokeList

var all domain.AllColumns
var alls []*domain.AllColumns

type AllDate struct {
	vts domain.Vtuber
	mos domain.Movie
	kar domain.KaraokeList
}

// Vtuberを全件取得する共通処理
func fetchVtubers() ([]domain.Vtuber, error) {
	var vts []domain.Vtuber
	resultVts := utility.Db.Find(&vts)
	return vts, resultVts.Error
}

// VtuberとMovieを全件取得する共通処理
func fetchVtubersJoinMovies(vts []domain.Vtuber) ([]*domain.VtuberMovie, error) {
	var vtsmos []*domain.VtuberMovie
	resultVtsmo := utility.Db.Model(&vts).Select("vtubers.vtuber_id, vtubers.vtuber_name, mo.movie_url, mo.movie_title").Joins("LEFT JOIN movies  mo USING(vtuber_id)").Scan(&vtsmos)
	return vtsmos, resultVtsmo.Error
}

// メインコンテンツ3種をjoinして全件取得
func fetchAllJoinData() ([]*domain.AllColumns, error) {
	var kas []*domain.KaraokeList
	var alls []*domain.AllColumns
	selectAll := "vtuber_id, vtuber_name, vtuber_kana, intro_movie_url, movie_url, movie_title, karaoke_list_id, sing_start, song_name, karaoke_list_inputer_id "
	resultAll := utility.Db.Model(&kas).Select(selectAll).Joins("LEFT JOIN movies mo USING(movie_url) LEFT JOIN vtubers vt USING(vtuber_id)").Scan(&alls)
	return alls, resultAll.Error
}

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

	alljoin, errA := fetchAllJoinData()
	if errA != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"result VTsmoのerror": errA.Error()})
		return
	}
	fmt.Printf("vts=%v, \n vtsmos=%v,\n alljoin=%v", vts, vtsmos, alljoin)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":            vts,
		"vtubers_and_movies": vtsmos,
		"alljoindata":        alljoin,
	})
}

// ↑実行結果　SELECT
// vtuber_id, vtuber_name,
// movie_url,  movie_title,
// karaoke_list_id, sing_start, song_name, karaoke_list_inputer_id
// FROM karaoke_lists
// LEFT JOIN movies  USING(movie_url)
// LEFT JOIN vtubers  USING(vtuber_id);

//  /sings
func ReadAllSings(c *gin.Context) {
	var vtsmoskls []*domain.VtuberMovieKalaokeList
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

// ↑実行結果　SELECT
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
	fmt.Print("CreateVtuber")
	var vts domain.Vtuber

	err := c.ShouldBind(&vts)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", &vts)

	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId=%v", tokenLId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "会員登録・ログインしてませんね？"})
		return
	}
	fmt.Printf("tokenLId=%v", tokenLId)
	//JWTの認証情報、最初の登録者が一致していればupdateへ進む

	vts.VtuberInputerId = &tokenLId

	var anotherVts domain.Vtuber
	anotherVts.VtuberInputerId = &tokenLId //vtuber_idが空のものを用意→データが有るとand検索になってしまう。
	utility.Db.Where("vtuber_name = ?", vts.VtuberName).Find(&anotherVts)
	fmt.Printf(" vtuber_id= %d に登録されています\n", *&anotherVts.VtuberId)
	if *&vts.VtuberId != 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "そのVTuber名は登録済みです"})
		return
	}

	utility.Db.Omit("vtuber_id").Create(&vts) //vtuber_idのみAUTO INCREMENT
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
	var mo domain.Movie
	var vt domain.Vtuber

	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId=%v", tokenLId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "会員登録・ログインしてませんね？"})
		return
	}
	mo.MovieInputerId = &tokenLId

	errBind := c.ShouldBind(&mo)
	if errBind != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmo = %v \n", &mo)

	// _idのvtuberがいるか確認
	// vt.VtuberId = *mo.VtuberId
	// utility.Db.Find(&vt)
	utility.Db.Model(&vt).Where("vtuber_id = ?", mo.VtuberId).First(&vt)
	if vt.VtuberName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "未登録のVTuberIdです",
		})
		return
	}

	// 既存チェック(movieにmovie_urlが登録済みならエラーを返す)だけど、不要な気がする。PKだから。
	// var dummy domain.Movie
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
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId=%v", tokenLId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "会員登録・ログインしてませんね？"})
		return
	}

	var ka domain.KaraokeList
	errBind := c.ShouldBind(&ka)
	if errBind != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	ka.KaraokeListInputerId = tokenLId
	fmt.Printf("bindしたka = %v \n", ka)

	// 申請(movie_url)がmoviesに未登録であれば処理停止
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
	var vt domain.Vtuber
	err := c.ShouldBind(&vt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvts = %v \n", vt)

	//JWTの認証情報とデータ登録者が一致していること
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	}
	vt.VtuberInputerId = &tokenLId

	var dummyVt domain.Vtuber
	inquiryResult := utility.Db.Where("vtuber_id = ? AND vtuber_inputer_id = ?", vt.VtuberId, vt.VtuberInputerId).First(&dummyVt)
	fmt.Printf("dummyVt.VtuberInputerId = %v,\n   vt.VtuberInputerId= %v \n", dummyVt, vt)
	if inquiryResult == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データ登録した本人のみ編集・削除が可能です。データ信頼性性の向上のための他者から編集申請できるシステムも開発中です。",
		})
		return
	}

	fmt.Print("vt = ", vt)

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
	var mo domain.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if mo.MovieUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "MovieUrlが空欄になっています。これはシステムエラーです。",
		})
		fmt.Print("MovieUrlが空欄のデータを受け取りました。\n")
	}
	// fmt.Printf("bindしたmoの url=%v, inputerId=%d, motitle=%v, VtId=%d \n", mo.MovieUrl, *mo.MovieInputerId, *mo.MovieTitle, *mo.VtuberId)

	// JWTの認証情報、movieデータの登録者が一致していればupdateへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else {
		mo.MovieInputerId = &tokenLId
	}

	var dummyMo domain.Movie
	inquiryResult := utility.Db.Where("movie_url = ? AND movie_inputer_id ", mo.MovieUrl, mo.MovieInputerId).First(&dummyMo)
	fmt.Printf("dummyMo = %v\n", dummyMo)
	if inquiryResult == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(domain.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
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
	var ka domain.KaraokeList
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
	} else {
		ka.KaraokeListInputerId = tokenLId
	}

	var dummyKa domain.KaraokeList
	inquiryResult := utility.Db.Where("karaoke_list_id = ? AND karaoke_inputer_id = ? ", ka.KaraokeListId, ka.KaraokeListInputerId).First(&dummyKa)
	fmt.Printf("dummyKo = %v\n", dummyKa)
	// fmt.Printf("dummyKo.KaraokeListInputerId = %d,\n ka.KaraokeListInputerId= %d \n", *&dummyKa.KaraokeListInputerId, *&ka.KaraokeListInputerId)
	if inquiryResult == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// result := utility.Db.Model(&vt).Where("vtuber_id = ?", vt.VtuberId).Updates(domain.Vtuber{"vtuber_name:?, vtuber_kana:?, intro_movie_url:?", vt.VtuberName, vt.VtuberKana, vt.IntroMovieUrl})
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
	var vt domain.Vtuber
	err := c.ShouldBind(&vt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたvt = %v \n", vt)

	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	}
	vt.VtuberInputerId = &tokenLId

	var dummyVt domain.Vtuber
	//JWTの認証情報と、Vtuberの登録者が一致していればdeleteへ進む
	inquiryResult := utility.Db.Select("vtuber_inputer_id").Where("vtuber_id = ? AND vtuber_inputer_id = ?", vt.VtuberId, &tokenLId).First(&dummyVt)
	fmt.Printf("inquiryResult = %v\n", inquiryResult)
	if inquiryResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// vtuber_idだけでいいんだけど、フロント側の表示バグ等怖いので
	result := utility.Db.Where("vtuber_name = ?", vt.VtuberName).Delete(vt)
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

//httpリクエストbodyでVtuberId, MovieUrlが渡される
func DeleteMovie(c *gin.Context) {
	var mo domain.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの url=%v, VtId=%d \n", mo.MovieUrl, *mo.VtuberId)

	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	}

	var dummyMo domain.Movie
	//JWTの認証情報と、Movieの登録者が一致していればdeleteへ進む
	inquiryResult := utility.Db.Where("movie_url = ? AND movie_inputer_id = ?", mo.MovieUrl, &tokenLId).First(&dummyMo)
	fmt.Printf("dummyMo = %v\n", dummyMo)
	if inquiryResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		return
	}

	// 正直movie_urlのみでよいが、フロント側の表示バグとか怖いので
	result := utility.Db.Model(&mo).Where("vtuber_id = ?", mo.VtuberId).Delete(mo)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "データを登録した人しか編集・削除は許可されていません。データ信頼性性の向上のための他者から申請できるシステムも開発中です。"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Movieの情報を削除しました。",
	})
}

//フロントからMovieUrl, KaraokeListId, SongNameを受け取る
func DeleteKaraokeSing(c *gin.Context) {
	var ka domain.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	//JWTの認証情報と、DBへの最初の登録者が一致していればdeleteへ進む
	tokenLId, err := utility.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	}

	var dummyKa domain.KaraokeList
	inquiryResult := utility.Db.Where("movie_url = ? AND karaoke_list_id = ? AND karaoke_list_inputer_id = ?", ka.MovieUrl, ka.KaraokeListId, tokenLId).First(&dummyKa)
	fmt.Printf("dummyKo = %v\n", &dummyKa)
	if inquiryResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "karaokeデータを登録した人のみ編集・削除が可能です。データ信頼性性の向上のための他者から申請できるシステムも開発中です。",
		})
		fmt.Print("karaoke登録者と不一致")
		return
	}

	// 正直movie_url, karaoke_list_id のみでよいが、フロント側で表示バグとか怖いので
	result := utility.Db.Where("song_name = ?", ka.SongName).Delete(&ka)
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
	var mo domain.Movie
	err := c.ShouldBind(&mo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの VtId=%d \n", *mo.VtuberId)

	var returnMoOftheV []domain.Movie
	utility.Db.Where("vtuber_id = ?", mo.VtuberId).Find(&returnMoOftheV)

	for _, mo := range returnMoOftheV {
		fmt.Printf("returnMo = %v, %v\n", mo.MovieTitle, mo.MovieUrl)
	}
	c.JSON(http.StatusOK, gin.H{
		"movies": returnMoOftheV,
	})
}
func ReadKaraokeListsOfTheMovie(c *gin.Context) {
	var ka domain.KaraokeList
	err := c.ShouldBind(&ka)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたmoの VtId=%d \n", &ka.MovieUrl)

	var returnKaOfTheMo []domain.KaraokeList
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
	var vts []domain.Vtuber
	var mos []domain.Movie
	var kas []domain.KaraokeList
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
