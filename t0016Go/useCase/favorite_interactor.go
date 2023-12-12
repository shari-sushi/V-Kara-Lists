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
func (interactor *FavoriteInteractor) FindFavoriteIdByFavOrUnfavRegistry(fav domain.Favorite) uint {
	fmt.Print("useCase/favorite_interactor.go \n")
	favId := interactor.FavoriteRepository.FindFavoriteIdByFavOrUnfavRegistry(fav)
	return favId
}

func (interactor *FavoriteInteractor) FindAllFavContensByListenerId(favs []domain.Favorite) ([]domain.VtuberMovie, []domain.VtuberMovieKaraoke, []error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	var errs []error
	favMos, err := interactor.FavoriteRepository.FindFavMoviesByListenerId(favs)
	if err != nil {
		errs = append(errs, err)
	}
	favKas, err := interactor.FavoriteRepository.FindFavKaraokesByListenerId(favs)
	if err != nil {
		errs = append(errs, err)
	}
	return favMos, favKas, errs
}

func (interactor *FavoriteInteractor) FindFavsOfUser(Lid domain.ListenerId) ([]domain.Favorite, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	favsOfUser, err := interactor.FavoriteRepository.FindFavsOfUser(Lid)
	return favsOfUser, err
}
func (interactor *FavoriteInteractor) FindFavsByListenerId(lid domain.ListenerId, fav domain.Favorite) (domain.Favorite, error) {
	foundFavOfUser, err := interactor.FavoriteRepository.FindFavsByListenerId(lid, fav)
	return foundFavOfUser, err
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

func (interactor *FavoriteInteractor) SaveMovieFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.SaveMovieFavorite(fav)
	return err
}

func (interactor *FavoriteInteractor) SaveKaraokeFavorite(fav domain.Favorite) error {
	fmt.Print("useCase/favorite_interactor.go \n")
	err := interactor.FavoriteRepository.SaveKaraokeFavorite(fav)
	return err
}
