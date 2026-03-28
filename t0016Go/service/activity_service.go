package service

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type ActivityService struct {
	FavoriteRepository repository.FavoriteRepository
	ContentRepository  repository.ContentRepository
}

func (interactor *ActivityService) CountMovieFavorites() ([]domain.TransmitMovie, error) {
	cnt, err := interactor.FavoriteRepository.CountMovieFavorites()
	return cnt, err
}

func (interactor *ActivityService) CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) {
	cnt, err := interactor.FavoriteRepository.CountKaraokeFavorites()
	return cnt, err
}

func (interactor *ActivityService) CreateMovieFavorite(fav domain.Favorite) error {
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.CreateMovieFavorite(fav)
	return err
}

func (interactor *ActivityService) CreateKaraokeFavorite(fav domain.Favorite) error {
	err := interactor.FavoriteRepository.CreateKaraokeFavorite(fav)
	return err
}

func (interactor *ActivityService) DeleteMovieFavorite(fav domain.Favorite) error {
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.DeleteMovieFavorite(fav)
	return err
}

func (interactor *ActivityService) DeleteKaraokeFavorite(fav domain.Favorite) error {
	err := interactor.FavoriteRepository.DeleteKaraokeFavorite(fav)
	return err
}

func (interactor *ActivityService) FindFavoriteUnscopedByFavOrUnfavRegistry(fav domain.Favorite) domain.Favorite {
	gotFav := interactor.FavoriteRepository.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	return gotFav
}

func (interactor *ActivityService) FindFavoritesCreatedByListenerId(lid domain.ListenerId) ([]domain.ReceivedFavorite, error) {
	foundFavs, err := interactor.FavoriteRepository.FindFavoritesCreatedByListenerId(lid)
	return foundFavs, err
}

func (interactor *ActivityService) GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error) {
	VtsMosWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesWithFavCnts()
	return VtsMosWitFav, err
}

func (interactor *ActivityService) GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) {
	VtsMosKasWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesKaraokesWithFavCnts()
	return VtsMosKasWitFav, err
}

func (interactor *ActivityService) GetVtubersMoviesKaraokesByVtuberKanaWithFavCnts(kana string) ([]domain.TransmitKaraoke, error) {
	VtsMosKasWitFav, err := interactor.FavoriteRepository.GetVtubersMoviesKaraokesByVtuberKanaWithFavCnts(kana)
	return VtsMosKasWitFav, err
}

func (interactor *ActivityService) GetLatest50VtubersMoviesKaraokesWithFavCnts(guestId domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	VtsMosKasWitFav, err := interactor.FavoriteRepository.GetLatest50VtubersMoviesKaraokesWithFavCnts(guestId)
	return VtsMosKasWitFav, err
}

func (interactor *ActivityService) UpdateMovieFavorite(fav domain.Favorite) error {
	fav.KaraokeId = 0 //保険
	err := interactor.FavoriteRepository.UpdateMovieFavorite(fav)
	return err
}

func (interactor *ActivityService) UpdateKaraokeFavorite(fav domain.Favorite) error {
	err := interactor.FavoriteRepository.UpdateKaraokeFavorite(fav)
	return err
}

// 使ってない？
func (interactor *ActivityService) FindVtubersCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, error) {
	x, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindMoviesCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	x, err := interactor.FavoriteRepository.FindMoviesCreatedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindKaraokesCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	x, err := interactor.FavoriteRepository.FindKaraokesCreatedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindMoviesFavoritedByListenerId(lid domain.ListenerId) ([]domain.TransmitMovie, error) {
	x, err := interactor.FavoriteRepository.FindMoviesFavoritedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindKaraokesFavoritedByListenerId(lid domain.ListenerId) ([]domain.TransmitKaraoke, error) {
	x, err := interactor.FavoriteRepository.FindKaraokesFavoritedByListenerId(lid)
	return x, err
}

func (interactor *ActivityService) FindEachRecordsCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, []domain.TransmitMovie, []domain.TransmitKaraoke, []error) {
	var errs []error
	vts, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	mos, err := interactor.FavoriteRepository.FindMoviesCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	kas, err := interactor.FavoriteRepository.FindKaraokesCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	return vts, mos, kas, errs
}
