package useCase

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type FavoriteInteractor struct {
	FavoriteRepository FavoriteRepository //user_repositoryのinterfaceで中身を定義
}

func (interactor *FavoriteInteractor) CreateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.CreateMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) DeleteMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.DeleteMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) CreateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.CreateKaraokeFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) DeleteKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.DeleteKaraokeFavorite(fav)
	return err
}

// func (interactor *FavoriteInteractor) CountUserFavorite(lid domain.ListenerId) (domain.Listener, error){ //何返すんだろう
// 	fmt.Print("useCase/favorite_interactor.go \n")
// 	cnt, err := interactor.FavoriteRepository.CountUserFavorite(lid)
// 	return cnt, err
// }

func (interactor *FavoriteInteractor) CountAllMovieFavorites() ([]domain.MovieFavoriteCount, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	cnt, err := interactor.FavoriteRepository.CountAllMovieFavorites()
	return cnt, err
}
func (interactor *FavoriteInteractor) CountAllKaraokeFavorites() ([]domain.KaraokeFavoriteCount, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	cnt, err := interactor.FavoriteRepository.CountAllKaraokeFavorites()
	return cnt, err
}
