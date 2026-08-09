package service

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type ActivityService struct {
	FavoriteRepository repository.FavoriteRepository
	ContentRepository  repository.ContentRepository
}

// CreateVideoFavorite は既に登録済みなら何もしない(冪等)。
func (interactor *ActivityService) CreateVideoFavorite(fav domain.FavoriteVideo) error {
	existing, err := interactor.FavoriteRepository.FindFavoriteVideoByListenerAndVideo(fav.ListenerId, fav.VideoId)
	if err == nil && existing.Id != 0 {
		return nil
	}
	return interactor.FavoriteRepository.CreateVideoFavorite(fav)
}

func (interactor *ActivityService) CreateVideoSongFavorite(fav domain.FavoriteVideoSong) error {
	existing, err := interactor.FavoriteRepository.FindFavoriteVideoSongByListenerAndVideoSong(fav.ListenerId, fav.VideoSongId)
	if err == nil && existing.Id != 0 {
		return nil
	}
	return interactor.FavoriteRepository.CreateVideoSongFavorite(fav)
}

func (interactor *ActivityService) DeleteVideoFavorite(fav domain.FavoriteVideo) error {
	err := interactor.FavoriteRepository.DeleteVideoFavorite(fav)
	return err
}

func (interactor *ActivityService) DeleteVideoSongFavorite(fav domain.FavoriteVideoSong) error {
	err := interactor.FavoriteRepository.DeleteVideoSongFavorite(fav)
	return err
}

func (interactor *ActivityService) FindFavoriteVideosCreatedByListenerId(lid domain.ListenerId) ([]domain.ReceivedFavoriteVideo, error) {
	foundFavs, err := interactor.FavoriteRepository.FindFavoriteVideosCreatedByListenerId(lid)
	return foundFavs, err
}

func (interactor *ActivityService) FindFavoriteVideoSongsCreatedByListenerId(lid domain.ListenerId) ([]domain.ReceivedFavoriteVideoSong, error) {
	foundFavs, err := interactor.FavoriteRepository.FindFavoriteVideoSongsCreatedByListenerId(lid)
	return foundFavs, err
}

func (interactor *ActivityService) GetVtubersVideosWithFavCnts() ([]domain.TransmitVideo, error) {
	VtsVsWithFav, err := interactor.FavoriteRepository.GetVtubersVideosWithFavCnts()
	return VtsVsWithFav, err
}

func (interactor *ActivityService) GetVtubersVideosVideoSongsWithFavCnts() ([]domain.TransmitVideoSong, error) {
	VtsVsVssWithFav, err := interactor.FavoriteRepository.GetVtubersVideosVideoSongsWithFavCnts()
	return VtsVsVssWithFav, err
}

func (interactor *ActivityService) GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(kana string) ([]domain.TransmitVideoSong, error) {
	VtsVsVssWithFav, err := interactor.FavoriteRepository.GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(kana)
	return VtsVsVssWithFav, err
}

func (interactor *ActivityService) GetLatest50VtubersVideosVideoSongsWithFavCnts(guestId domain.ListenerId) ([]domain.TransmitVideoSong, error) {
	VtsVsVssWithFav, err := interactor.FavoriteRepository.GetLatest50VtubersVideosVideoSongsWithFavCnts(guestId)
	return VtsVsVssWithFav, err
}

func (interactor *ActivityService) FindVtubersCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, error) {
	x, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindVideosCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitVideo, error) {
	x, err := interactor.FavoriteRepository.FindVideosCreatedByListenerId(lid)
	return x, err
}
func (interactor *ActivityService) FindVideoSongsCreatedByListenerId(lid domain.ListenerId) ([]domain.TransmitVideoSong, error) {
	x, err := interactor.FavoriteRepository.FindVideoSongsCreatedByListenerId(lid)
	return x, err
}

func (interactor *ActivityService) FindEachRecordsCreatedByListenerId(lid domain.ListenerId) ([]domain.Vtuber, []domain.TransmitVideo, []domain.TransmitVideoSong, []error) {
	var errs []error
	vts, err := interactor.FavoriteRepository.FindVtubersCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	vs, err := interactor.FavoriteRepository.FindVideosCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	vss, err := interactor.FavoriteRepository.FindVideoSongsCreatedByListenerId(lid)
	if err != nil {
		errs = append(errs, err)
	}
	return vts, vs, vss, errs
}
