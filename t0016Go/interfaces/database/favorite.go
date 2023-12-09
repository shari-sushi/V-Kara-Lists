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

func (db *FavoriteRepository) CountAllMovieFavorites() ([]domain.MovieFavoriteCount, error) {
	fmt.Print("interfaces/database/favorite.go\n")
	// 期待するクエリ
	// SELECT movie_url COUNT(*) AS count FROM favorite_posts WHERE karaoke_id != 0 GROUP BY movie_url;
	var fav domain.Favorite
	var favCnt []domain.MovieFavoriteCount
	err := db.Model(&fav).Select("movie_url").Where("karaoke_list_id = 0").Group("movie_url").
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
func (db *FavoriteRepository) CountAllKaraokeFavorites() ([]domain.KarokeFavoriteCount, error) {
	fmt.Print("interfaces/database/favorite.go \n")
	// 期待するクエリ
	// SELECT karaoke_id, COUNT(*) AS count FROM favorite_posts WHERE karaoke_id != 0 GROUP BY karaoke_id;
	var fav domain.Favorite
	var favCnt []domain.KarokeFavoriteCount
	err := db.Model(&fav).Select("karaoke_id").Where("where karaoke_list_id != 0").Group("karoke_list_id").
		Find(&favCnt).Error
	if err != nil {
		return favCnt, err
	}
	return favCnt, err
}
