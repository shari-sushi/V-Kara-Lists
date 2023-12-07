package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type VtuberContentRepository struct {
	SqlHandler
}

func (db *VtuberContentRepository) GetAllVtubers() ([]domain.Vtuber, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Vts []domain.Vtuber
	err := db.Find(&Vts).Error
	if err != nil {
		return nil, err
	}
	return Vts, nil
}
func (db *VtuberContentRepository) GetAllMovies() ([]domain.Movie, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mos []domain.Movie
	err := db.Find(&Mos).Error
	if err != nil {
		return nil, err
	}
	return Mos, nil
}
func (db *VtuberContentRepository) GetAllKaraokes() ([]domain.KaraokeList, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Kas []domain.KaraokeList
	err := db.Find(&Kas).Error
	if err != nil {
		return nil, err
	}
	return Kas, nil
}

// func ReadSings(c *gin.Context) {
// 	q := c.Query("movie_url")
// 	utility.Db.Model(&kas).
// 		Select("vtuber_id, vtuber_name, movie_id,  movie_url, movie_title, song_id, sing_start, song").
// 		Where("movie_url = ?", q).Joins("LEFT JOIN movies m USING(movie_url)").
// 		Joins("LEFT JOIN vtubers s USING(vtuber_id)").
// 		Find(&alls)

// }

///////////////////
func (db *VtuberContentRepository) GetAllVtubersMovies() ([]domain.VtuberMovie, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mos []domain.Movie
	var VtsMos []domain.VtuberMovie
	selectQ := "vtuber_id, vtuber_name,  movie_url, movie_title"
	joinsQ := "LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(Mos).Select(selectQ).Joins(joinsQ).Scan(&VtsMos).Error
	if err != nil {
		return nil, err
	}
	return VtsMos, nil
}
func (db *VtuberContentRepository) GetAllVtubersMoviesKaraokes() ([]domain.VtuberMovieKaraoke, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Kas []domain.KaraokeList
	var VtsMosKas []domain.VtuberMovieKaraoke
	joinsQ := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(Kas).Joins(joinsQ).Scan(&VtsMosKas).Error
	if err != nil {
		return nil, err
	}
	return VtsMosKas, nil
}
func (db *VtuberContentRepository) GetEssentialJoinVtubersMoviesKaraokes() ([]domain.EssentialOfVtMoKa, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Kas []domain.KaraokeList
	var allVtsMoskas []domain.EssentialOfVtMoKa
	selectQ := "vtuber_id, vtuber_name, vtuber_inputter_id  movie_url, movie_title, movie_inputter_id,  karaoke_list_id, sing_start, song_name, karaoke_list_inputter_id"
	joinsQ := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(Kas).Select(selectQ).Joins(joinsQ).Scan(&allVtsMoskas).Error
	if err != nil {
		return nil, err
	}
	return allVtsMoskas, nil
}

func (db *VtuberContentRepository) CreateVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Omit("vtuber_id").Create(&V) //vtuber_idのみAUTO INCREMENT
	return result.Error
}

func (db *VtuberContentRepository) CreateMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var V domain.Vtuber
	V.VtuberId = *M.VtuberId
	fmt.Printf("2-1:%v \n", V.VtuberId)
	if result := db.First(&V); result.Error != nil {
		fmt.Printf("V:%v", V)
		return result.Error
	}
	result := db.Create(&M)
	fmt.Printf("2-2:%v \n", M)
	return result.Error
}

func (db *VtuberContentRepository) CreateKaraokeSing(K domain.KaraokeList) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mo domain.Movie
	Mo.MovieUrl = K.MovieUrl
	if result := db.First(&Mo); result.Error != nil {
		return result.Error
	}
	result := db.Create(&K)
	return result.Error
}

func (db *VtuberContentRepository) UpdateVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	// これで行けるなら、Modelに渡す構造体は空じゃなくて良い。
	result := db.Model(&V).Where("vtuber_id = ?", V.VtuberId).Updates(&V)
	return result.Error
	// var Vt domain.Vtuber
	// fmt.Printf("Vt(nil値)=%v\n", Vt)
	// result := db.Model(&Vt).Where("vtuber_id = ?", V.VtuberId).Updates(&V)
	// return result.Error
}
func (db *VtuberContentRepository) UpdateMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mo domain.Vtuber
	result := db.Model(&Mo).Where("Movie_title = ?", M.MovieTitle).Updates(&M)
	return result.Error
}

func (db *VtuberContentRepository) UpdateKaraokeSing(K domain.KaraokeList) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Ka domain.Vtuber
	result := db.Model(&Ka).Where("karaoke_list_id = ?", K.KaraokeListId).Updates(&K)
	return result.Error
}

func (db *VtuberContentRepository) DeleteVtuber(V domain.Vtuber) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Mo domain.Movie
	Mo.VtuberId = &V.VtuberId
	db.First(&Mo)
	if Mo.MovieUrl != "" {
		return fmt.Errorf("Delete Vtuber after its Movie ")
	}
	result := db.Where("vtuber_name = ?", V.VtuberName).Delete(V) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteMovie(M domain.Movie) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	var Ka domain.KaraokeList
	Ka.MovieUrl = M.MovieUrl
	db.First(&Ka)
	if Ka.KaraokeListId != 0 {
		return fmt.Errorf("Delete Vtuber after its Movie ")
	}
	result := db.Where("movie_title = ?", M.MovieTitle).Delete(M) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteKaraokeSing(K domain.KaraokeList) error {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("song_name = ?", K.SongName).Delete(K) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyVtuber(id int, V domain.Vtuber) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("vtuber_Inputter_id=?", id).First(V, V.VtuberId)
	return V.VtuberInputterId != nil, result.Error
}
func (db *VtuberContentRepository) VerifyUserModifyMovie(id int, M domain.Movie) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("movie_Inputter_id=?", id).First(M, M.MovieUrl)
	return M.MovieInputterId != nil, result.Error
}
func (db *VtuberContentRepository) VerifyUserModifyKaraoke(id int, K domain.KaraokeList) (bool, error) {
	fmt.Print("interfaces/database/vtuber_content_db.go \n")
	result := db.Where("karaoke_Inputter_id=?", id).First(K, K.KaraokeListId)
	return K.KaraokeListInputterId != nil, result.Error
}
