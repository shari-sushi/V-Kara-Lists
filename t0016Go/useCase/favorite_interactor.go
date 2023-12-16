package useCase

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type FavoriteInteractor struct {
	FavoriteRepository      FavoriteRepository
	VtuberContentRepository VtuberContentRepository
	UserRepository          UserRepository
}

func (interactor *FavoriteInteractor) CountMovieFavorites() ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	cnt, err := interactor.FavoriteRepository.CountMovieFavorites()
	return cnt, err
}
func (interactor *FavoriteInteractor) CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	cnt, err := interactor.FavoriteRepository.CountKaraokeFavorites()
	return cnt, err
}

func (interactor *FavoriteInteractor) CreateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.CreateMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) CreateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.CreateKaraokeFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) DeleteMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.DeleteMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) DeleteKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.DeleteKaraokeFavorite(fav)
	return err
}
func (interactor *FavoriteInteractor) FindFavoriteUnscopedByFavOrUnfavRegistry(fav domain.Favorite) domain.Favorite {
	fmt.Print("useCase/favorite_interactor.go \n")
	gotFav := interactor.FavoriteRepository.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	fmt.Print("useCase/favorite_interactor.go later\n")
	return gotFav
}

func (interactor *FavoriteInteractor) FindFavoritesCreatedByListenerId(lid domain.ListenerId) ([]domain.Favorite, error) {
	foundFavs, err := interactor.FavoriteRepository.FindFavoritesCreatedByListenerId(lid)
	return foundFavs, err
}
func (interactor *FavoriteInteractor) GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	VtsMosWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesWithFavCnts()
	return VtsMosWitFav, err
}

func (interactor *FavoriteInteractor) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	VtsMosKasWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesKaraokesWithFavCnts()
	return VtsMosKasWitFav, err
}

func (interactor *FavoriteInteractor) UpdateMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.UpdateMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) UpdateKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.UpdateKaraokeFavorite(fav)
	return err
}

// 以下、開発中
func (interactor *FavoriteInteractor) FindVtubersCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindMoviesCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindMoviesCreatedByListenerId(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindKaraokesCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindKaraokesCreatedByListenerId(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindMoviesFavoritedByListenerId(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindMoviesFavoritedByListenerId(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindKaraokesFavoritedByListenerId(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindKaraokesFavoritedByListenerId(lid)
	return x, err
}

func (interactor *FavoriteInteractor) FindEachRecordsCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, []domain.TransmitMovie, []domain.TransmitKaraoke, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	vts, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	mos, err := interactor.FavoriteRepository.FindMoviesCreatedByListenerId(lid)
	kas, err := interactor.FavoriteRepository.FindKaraokesCreatedByListenerId(lid)

	return vts, mos, kas, err
}
