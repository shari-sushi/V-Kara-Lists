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
func (interactor *FavoriteInteractor) FindFavoriteUnscopedByFavOrUnfavRegistry(fav domain.Favorite) domain.Favorite {
	fmt.Print("useCase/favorite_interactor.go \n")
	gotFav := interactor.FavoriteRepository.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	fmt.Print("useCase/favorite_interactor.go later\n")
	return gotFav
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

// 以下、開発中
func (interactor *FavoriteInteractor) FindVtubersThisListenerIdCreated(lid domain.ListenerId) ([]domain.Vtuber, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindVtubersThisListenerIdCreated(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindMoviesThisListenerIdCreated(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindMoviesThisListenerIdCreated(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindKaraokesThisListenerIdCreated(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindKaraokesThisListenerIdCreated(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindMoviesThisListenerIdFavorited(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindMoviesThisListenerIdFavorited(lid)
	return x, err
}
func (interactor *FavoriteInteractor) FindKaraokesThisListenerIdFavorited(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	fmt.Print("useCase/favorite_interactor.go \n")
	x, err := interactor.FavoriteRepository.FindKaraokesThisListenerIdFavorited(lid)
	return x, err
}
