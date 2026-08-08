package repository

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type favoriteRepository struct {
	SqlHandler
}

func (db *favoriteRepository) CountMovieFavorites() ([]domain.TransmitMovie, error) {
	var fav domain.Favorite
	var favCnt []domain.TransmitMovie
	err := db.Model(&fav).Select("movie_url").Where("karaoke_id = 0").Group("movie_url").Find(&favCnt).Error
	if err != nil {
		return favCnt, err
	}
	return favCnt, nil
}

func (db *favoriteRepository) CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) {
	var fav domain.Favorite
	var favCnt []domain.TransmitKaraoke
	err := db.Model(&fav).Select("karaoke_id").Where("where karaoke_id != 0").Group("karoke_list_id").Find(&favCnt).Error
	if err != nil {
		return favCnt, err
	}
	return favCnt, nil
}

func (db *favoriteRepository) DeleteMovieFavorite(fav domain.Favorite) error {
	err := db.Where("listener_id = ? AND movie_url = ? AND karaoke_id = 0", fav.ListenerId, fav.MovieUrl).Delete(&fav).Error
	if err != nil {
		return err
	}

	return nil
}

func (db *favoriteRepository) DeleteKaraokeFavorite(fav domain.Favorite) error {
	err := db.Where("listener_id = ? AND movie_url = ? AND karaoke_id = ?", fav.ListenerId, fav.MovieUrl, fav.KaraokeId).Delete(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error) {
	var TmMos []domain.TransmitMovie
	var err error

	var mo domain.Movie
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "movies.movie_url, movies.movie_title, movies.movie_inputter_id"
	selectQu3 := "COUNT(f.movie_url) AS count "
	joinQu1 := "LEFT JOIN vtubers USING(vtuber_id) "
	joinQu2 := "LEFT JOIN favorites as f ON movies.movie_url = f.movie_url AND f.karaoke_id = 0 AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	groupQu := "movies.movie_url, vtubers.vtuber_id"
	err = db.Model(mo).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Group(groupQu).
		Scan(&TmMos).Error

	if err != nil {
		return TmMos, err
	}

	return TmMos, nil
}

func (db *favoriteRepository) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmKas).Error

	if err != nil {
		return TmKas, err
	}

	return TmKas, nil
}

func (db *favoriteRepository) GetVtubersMoviesKaraokesByVtuberKanaWithFavCnts(kana string) ([]domain.TransmitKaraoke, error) {
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "vtubers.vtuber_kana = ? AND m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu, kana).Group(groupQu).
		Scan(&TmKas).Error

	if err != nil {
		return TmKas, err
	}

	return TmKas, nil
}

func (db *favoriteRepository) GetLatest50VtubersMoviesKaraokesWithFavCnts(guestId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQuA := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQuB := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQuC := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu1 := fmt.Sprint(joinQuA, joinQuB)
	joinQu2 := fmt.Sprint(joinQuC)
	whereQu1 := "k.karaoke_inputter_id != ?"
	whereQu2 := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	groupQu := "k.karaoke_id"
	orderQu := "`k`.`karaoke_id` DESC"
	limitQu := 50
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu1).Where(whereQu1, guestId).Joins(joinQu2).Where(whereQu2).Group(groupQu).Order(orderQu).Limit(limitQu).
		Scan(&TmKas).Error

	if err != nil {
		return TmKas, err
	}

	return TmKas, nil
}

func (db *favoriteRepository) FindFavoritesCreatedByListenerId(lId domain.ListenerId) ([]domain.ReceivedFavorite, error) {
	var favs []domain.Favorite
	var receivedFavs []domain.ReceivedFavorite

	result := db.Select("id, listener_id, movie_url, karaoke_id").Where("listener_id=?", lId).Model(&favs).Scan(&receivedFavs)
	return receivedFavs, result.Error
}

func (db *favoriteRepository) FindFavoriteUnscopedByFavOrUnfavRegistry(fav domain.Favorite) domain.Favorite {
	err := db.Unscoped().Where("listener_id = ? AND movie_url = ? AND karaoke_id = ?", fav.ListenerId, fav.MovieUrl, fav.KaraokeId).First(&fav).Error
	if err != nil {
		fmt.Printf("FindFavoriteUnscopedByFavOrUnfavRegistry got err=%v\n", err)
	}

	return fav
}

func (db *favoriteRepository) CreateMovieFavorite(fav domain.Favorite) error {
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) CreateKaraokeFavorite(fav domain.Favorite) error {
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) UpdateMovieFavorite(fav domain.Favorite) error {
	err := db.Unscoped().Model(fav).Update("deleted_at", nil).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) UpdateKaraokeFavorite(fav domain.Favorite) error {
	err := db.Unscoped().Model(fav).Where("listener_id = ? AND movie_url = ? AND karaoke_id = ?", fav.ListenerId, fav.MovieUrl, fav.KaraokeId).Update("deleted_at", nil).Error
	if err != nil {
		return err
	}
	return nil
}

// 使ってない？
func (db *favoriteRepository) FindVtubersCreatedByListenerId(lId domain.ListenerId) ([]domain.Vtuber, error) {
	var vts []domain.Vtuber
	err := db.Where("vtuber_inputter_id = ?", lId).Find(&vts).Error
	if err != nil {
		return vts, err
	}
	return vts, nil
}

func (db *favoriteRepository) FindMoviesCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitMovie, error) {
	var TmMos []domain.TransmitMovie
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id"
	selectQu3 := "COUNT(f.movie_url) AS count "
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id)"
	joinQu2 := "LEFT JOIN favorites as f ON m.movie_url = f.movie_url AND f.karaoke_id = 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	whereQu := "m.movie_url IS NOT NULL AND m.movie_inputter_id = ?"
	groupQu := "m.movie_url, vtubers.vtuber_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Where(whereQu, lId).Group(groupQu).
		Scan(&TmMos).Error

	if err != nil {
		return TmMos, err
	}

	return TmMos, nil
}

func (db *favoriteRepository) FindKaraokesCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id "
	selectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id "
	selectQu4 := "COUNT(f.karaoke_id) AS count"
	joinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	joinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	joinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0  AND f.deleted_at IS NULL"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 AND k.karaoke_inputter_id = ?"
	groupQu := "k.karaoke_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu, lId).Group(groupQu).
		Scan(&TmKas).Error
	if err != nil {
		return TmKas, err
	}

	return TmKas, nil
}
func (db *favoriteRepository) FindMoviesFavoritedByListenerId(lId domain.ListenerId) ([]domain.TransmitMovie, error) {
	var Mos []domain.Movie
	var tmMos []domain.TransmitMovie
	var err error
	joinsQOfVtsMos := "LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMos := "where movies.inputter_listener_id = ?"
	err = db.Model(Mos).Where(whereOfVtsMos, lId).Joins(joinsQOfVtsMos).Scan(&tmMos).Error
	if err != nil {
		return tmMos, err
	}

	return tmMos, nil
}
func (db *favoriteRepository) FindKaraokesFavoritedByListenerId(lId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	var err error
	var tmKas []domain.TransmitKaraoke
	var Kas []domain.Karaoke
	var VtsMosKas []domain.VtuberMovieKaraoke
	joinsQOfVtsMosKas := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMosKas := "where karaoke_lists.inputter_listener_id = ?"
	err = db.Model(Kas).Where(whereOfVtsMosKas, lId).Joins(joinsQOfVtsMosKas).Scan(&VtsMosKas).Error
	if err != nil {
		return tmKas, err
	}

	return tmKas, nil
}
