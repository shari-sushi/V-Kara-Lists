package database

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type FavoriteRepository struct {
	SqlHandler
}

func (db *FavoriteRepository) CreateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) DeleteMovieFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Delete(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) CreateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) DeleteKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("interfaces/database/favorite.go\n")
	err := db.Delete(&fav).Error
	if err != nil {
		return err
	}
	return err
}

func (db *FavoriteRepository) CountMovieFavorites() ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go\n")
	// 期待するクエリ
	// SELECT movie_url COUNT(*) AS count FROM favorite_posts WHERE karaoke_id != 0 GROUP BY movie_url;
	var fav domain.Favorite
	var favCnt []domain.TransmitMovie
	err := db.Model(&fav).Select("movie_url").Where("karaoke_id = 0").Group("movie_url").
		Find(&favCnt).Error

	// 動作確認できたら削除するメモ
	// var favs []domain.Favorite
	// var moviesFavCount []domain.MovieFavoriteCount
	// var cnt int64
	// err := db.Model(&favs).Select().Group("movie_url").Count(&cnt).Error

	if err != nil {
		return favCnt, err
	}
	return favCnt, err
}

func (db *FavoriteRepository) CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	// 期待するクエリ
	// SELECT karaoke_id, COUNT(*) AS count FROM favorite_posts WHERE karaoke_id != 0 GROUP BY karaoke_id;
	var fav domain.Favorite
	var favCnt []domain.TransmitKaraoke
	err := db.Model(&fav).Select("karaoke_id").Where("where karaoke_id != 0").Group("karoke_list_id").
		Find(&favCnt).Error
	if err != nil {
		return nil, err
	}
	return favCnt, err
}

// 使ってないと思う
func (db *FavoriteRepository) GetAllFavContensByListenerId(favs []domain.Favorite) ([]domain.VtuberMovie, []domain.VtuberMovieKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var Mos []domain.Movie
	var VtsMos []domain.VtuberMovie
	var Kas []domain.Karaoke
	var errs []error
	var err error
	// selecQOfVtsMos := "vtuber_id,vtuber_kana, vtuber_name, intro_movie_url,vtuber_inputter_id, movie_url, movie_title, movie_inputter_id"
	joinsQOfVtsMos := "LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMos := fmt.Sprintf("where movies.inputter_listener_id = %v", favs[0].ListenerId)
	err = db.Model(Mos).Where(whereOfVtsMos).Joins(joinsQOfVtsMos).Scan(&VtsMos).Error
	if err != nil {
		errs = append(errs, err)
	}

	var VtsMosKas []domain.VtuberMovieKaraoke
	joinsQOfVtsMosKas := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMosKas := fmt.Sprintf("where karaoke_lists.inputter_listener_id = %v", favs[0].ListenerId)
	err = db.Model(Kas).Where(whereOfVtsMosKas).Joins(joinsQOfVtsMosKas).Scan(&VtsMosKas).Error
	if err != nil {
		errs = append(errs, err)
	}
	return VtsMos, VtsMosKas, err
}

func (db *FavoriteRepository) FindFavMoviesByListenerId(favs []domain.Favorite) ([]domain.VtuberMovie, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var Mos []domain.Movie
	var VtsMos []domain.VtuberMovie
	var errs []error
	var err error
	// selecQOfVtsMos := "vtuber_id,vtuber_kana, vtuber_name, intro_movie_url,vtuber_inputter_id, movie_url, movie_title, movie_inputter_id"
	joinsQOfVtsMos := "LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMos := fmt.Sprintf("where movies.inputter_listener_id = %v", favs[0].ListenerId)
	err = db.Model(Mos).Where(whereOfVtsMos).Joins(joinsQOfVtsMos).Scan(&VtsMos).Error
	if err != nil {
		errs = append(errs, err)
	}
	return VtsMos, err
}

func (db *FavoriteRepository) FindFavKaraokesByListenerId(favs []domain.Favorite) ([]domain.VtuberMovieKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var Kas []domain.Karaoke
	var errs []error
	var err error
	var VtsMosKas []domain.VtuberMovieKaraoke
	joinsQOfVtsMosKas := "LEFT JOIN movies USING(movie_url) LEFT JOIN vtubers USING(vtuber_id)"
	whereOfVtsMosKas := fmt.Sprintf("where karaoke_lists.inputter_listener_id = %v", favs[0].ListenerId)
	err = db.Model(Kas).Where(whereOfVtsMosKas).Joins(joinsQOfVtsMosKas).Scan(&VtsMosKas).Error
	if err != nil {
		errs = append(errs, err)
	}
	return VtsMosKas, err
}

func (db *FavoriteRepository) FindFavsOfUser(Lid domain.ListenerId) ([]domain.Favorite, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	// 期待するクエリ
	// Select * FROM favorites Where listener_id = ?
	var favsOfUser []domain.Favorite
	whereQuery := fmt.Sprintf("where listener_id = %v", Lid)
	err := db.Where(whereQuery).Find(&favsOfUser).Error
	if err != nil {
		return nil, err
	}
	return favsOfUser, err
}

func (db *FavoriteRepository) FindFavsByListenerId(lid domain.ListenerId, fav domain.Favorite) (domain.Favorite, error) {
	fmt.Print("interfaces/database/favorite_db.go \n")
	result := db.Where("listener_id=?", lid).Find(fav)
	return fav, result.Error
}

func (db *FavoriteRepository) GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmMos []domain.TransmitMovie
	var err error

	var vt domain.Vtuber
	SelectQu1 := "vtuber.vtuber_id, vtuber.vtuber_name, vtuber.vtuber_kana, vtuber.intro_movie_url, vtuber.vtuber_inputter_id, "
	SelectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id, "
	SelectQu3 := "COUNT(favorites.movie_url) AS count "
	JoinQu := "LEFT JOIN movies as m USING(vtuber_id) LEFT JOIN favorites ON m.movie_url = favorites.movie_url AND favorites.karaoke_id = 0 "
	WhereQu := "m.movie_url IS NOT NULL "
	GroupQu := "m.movie_url "
	err = db.Model(vt).Select(SelectQu1, SelectQu2, SelectQu3).
		Joins(JoinQu).Where(WhereQu).Group(GroupQu).
		Scan(&TmMos).Error
	if err != nil {
		return nil, err
	}
	return TmMos, nil
}

func (db *FavoriteRepository) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	var TmKas []domain.TransmitKaraoke
	var err error

	var vt domain.Vtuber
	SelectQu1 := "vtuber.vtuber_id, vtuber.vtuber_name, vtuber.vtuber_kana, vtuber.intro_movie_url, vtuber.vtuber_inputter_id, "
	SelectQu2 := "m.movie_url, m.movie_title, m.movie_inputter_id, "
	SelectQu3 := "k.karaoke_id, k.sing_start, k.song_name, k.karaoke_inputter_id, "
	SelectQu4 := "COUNT(k.karaoke_id) AS count"
	JoinQu1 := "LEFT JOIN movies as m USING(vtuber_id) "
	JoinQu2 := "LEFT JOIN karaokes as k ON m.movie_url = k.movie_url "
	JoinQu3 := "LEFT JOIN favorites as f ON k.karaoke_id = f.karaoke_id AND f.karaoke_id != 0 "
	WhereQu := "m.movie_url IS NOT NULL AND k.karaoke_id != 0 "
	GroupQu := "m.movie_url "
	err = db.Model(vt).Select(SelectQu1, SelectQu2, SelectQu3, SelectQu4).
		Joins(JoinQu1, JoinQu2, JoinQu3).Where(WhereQu).Group(GroupQu).
		Scan(&TmKas).Error
	if err != nil {
		return nil, err
	}
	return TmKas, nil
}
