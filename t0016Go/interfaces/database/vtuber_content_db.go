package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type VtuberContentRepository struct {
	SqlHandler
}

func (db *VtuberContentRepository) GetVtubers() ([]domain.Vtuber, error) {
	var vts []domain.Vtuber
	err := db.Find(&vts).Error
	if err != nil {
		return []domain.Vtuber{}, err
	}
	return vts, nil
}

func (db *VtuberContentRepository) GetMovieByUrl(url domain.MovieUrl) (domain.Movie, error) {
	var mo domain.Movie
	err := db.Where("movie_url = ?", url).Find(&mo).Error
	if err != nil {
		return domain.Movie{}, err
	}
	return mo, nil
}

func (db *VtuberContentRepository) GetMovies() ([]domain.Movie, error) {
	var mos []domain.Movie
	err := db.Find(&mos).Error
	if err != nil {
		return nil, err
	}
	return mos, nil
}

func (db *VtuberContentRepository) GetKaraokes() ([]domain.Karaoke, error) {
	var Kas []domain.Karaoke
	err := db.Find(&Kas).Error
	if err != nil {
		return nil, err
	}
	return Kas, nil
}

func (db *VtuberContentRepository) GetMoviesUrlTitleByVtuber(id domain.VtuberId) ([]domain.Movie, error) {
	var mos []domain.Movie
	selectQ := "movie_url, movie_title"
	whereQ := fmt.Sprint("vtuber_id = ", id)
	err := db.Select(selectQ).Where(whereQ).Find(&mos).Error
	if err != nil {
		return nil, err
	}
	return mos, nil
}

func (db *VtuberContentRepository) GetVtubersMovies() ([]domain.VtuberMovie, error) {
	var mos []domain.Movie
	var VtsMos []domain.VtuberMovie
	selectQ := "vtuber_id, vtuber_name,  movie_url, movie_title"
	joinsQ := "LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(mos).Select(selectQ).Joins(joinsQ).Scan(&VtsMos).Error
	if err != nil {
		return nil, err
	}
	return VtsMos, nil
}

func (db *VtuberContentRepository) GetVtubersMoviesKaraokes() ([]domain.TransmitKaraoke, error) {
	var kas []domain.Karaoke
	var vtsMosKas []domain.TransmitKaraoke
	joinsQ := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	err := db.Model(kas).Joins(joinsQ).Scan(&vtsMosKas).Error
	if err != nil {
		return nil, err
	}
	return vtsMosKas, nil
}

func (db *VtuberContentRepository) CreateVtuber(V domain.Vtuber) error {
	result := db.Omit("vtuber_id").Create(&V) //vtuber_idのみAUTO INCREMENT
	return result.Error
}

func (db *VtuberContentRepository) CreateMovie(M domain.Movie) error {
	var v domain.Vtuber
	v.VtuberId = M.VtuberId
	if result := db.First(&v); result.Error != nil {
		fmt.Printf("V:%v", v)
		return result.Error
	}
	result := db.Create(&M)
	return result.Error
}

func (db *VtuberContentRepository) CreateKaraokes(ks []domain.Karaoke) error {
	var Mo domain.Movie
	Mo.MovieUrl = ks[0].MovieUrl
	if result := db.First(&Mo); result.Error != nil {
		return result.Error
	}

	result := db.Create(&ks)
	return result.Error
}

func (db *VtuberContentRepository) UpdateVtuber(V domain.Vtuber) error {
	result := db.Model(&V).Where("vtuber_id = ?", V.VtuberId).Updates(&V)
	return result.Error
}

func (db *VtuberContentRepository) UpdateMovie(M domain.Movie) error {
	var Mo domain.Vtuber
	result := db.Model(&Mo).Where("Movie_url = ?", M.MovieUrl).Updates(&M)

	return result.Error
}

func (db *VtuberContentRepository) UpdateKaraoke(K domain.Karaoke) error {
	var Ka domain.Karaoke
	result := db.Model(&Ka).Where("karaoke_id = ?", K.KaraokeId).Updates(&K)

	return result.Error
}

func (db *VtuberContentRepository) DeleteVtuber(V domain.Vtuber) error {
	var Mo domain.Movie
	db.Where("vtuber_id = ? ", V.VtuberId).First(&Mo)
	if Mo.MovieUrl != "" {
		return fmt.Errorf("delete Vtuber after its Movie ")
	}
	result := db.Where("vtuber_name = ?", V.VtuberName).Delete(V) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteMovie(M domain.Movie) error {
	var Ka domain.Karaoke
	Ka.MovieUrl = M.MovieUrl
	db.First(&Ka)
	if Ka.KaraokeId != 0 {
		return fmt.Errorf("delete Vtuber after its Movie ")
	}
	result := db.Where("movie_title = ?", M.MovieTitle).Delete(M) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) DeleteKaraoke(K domain.Karaoke) error {
	result := db.Where("song_name = ?", K.SongName).Delete(K) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyVtuber(id domain.ListenerId, V domain.Vtuber) (bool, error) {
	result := db.Where("vtuber_Inputter_id=?", id).First(&V)
	return V.VtuberInputterId == id, result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyMovie(id domain.ListenerId, M domain.Movie) (bool, error) {
	result := db.Where("movie_Inputter_id=?", id).First(&M, M.MovieUrl)
	return M.MovieInputterId == id, result.Error
}

func (db *VtuberContentRepository) VerifyUserModifyKaraoke(id domain.ListenerId, K domain.Karaoke) (bool, error) {
	result := db.Where("karaoke_Inputter_id=?", id).First(&K)
	return K.KaraokeInputterId == id, result.Error
}
