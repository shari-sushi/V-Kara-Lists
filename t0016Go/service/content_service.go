package service

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type ContentService struct {
	ContentRepository repository.ContentRepository
}

func (interactor *ContentService) GetVtubers() ([]domain.Vtuber, error) {
	allVts, err := interactor.ContentRepository.GetVtubers()
	return allVts, err
}

func (interactor *ContentService) GetMoviesUrlTitleByVtuber(id domain.VtuberId) ([]domain.Movie, error) {
	Mos, err := interactor.ContentRepository.GetMoviesUrlTitleByVtuber(id)
	return Mos, err
}

func (interactor *ContentService) GetMovie(url domain.MovieUrl) (domain.Movie, error) {
	mo, err := interactor.ContentRepository.GetMovieByUrl(url)
	return mo, err
}

func (interactor *ContentService) GetMovies() ([]domain.Movie, error) {
	allMos, err := interactor.ContentRepository.GetMovies()
	return allMos, err
}
func (interactor *ContentService) GetKaraokes() ([]domain.Karaoke, error) {
	allKas, err := interactor.ContentRepository.GetKaraokes()
	return allKas, err
}

func (interactor *ContentService) GetVtubersMovies() ([]domain.VtuberMovie, error) {
	VM, err := interactor.ContentRepository.GetVtubersMovies()
	return VM, err
}

func (interactor *ContentService) GetVtubersMoviesKaraokes() ([]domain.TransmitKaraoke, error) {
	allVtsMosKas, err := interactor.ContentRepository.GetVtubersMoviesKaraokes()
	return allVtsMosKas, err
}

func (interactor *ContentService) CreateVtuber(v domain.Vtuber) (domain.Vtuber, error) {
	v = common.NormalizeVtuber(v)

	if err := common.ValidateVtuber(v); err != nil {
		return domain.Vtuber{}, err
	}

	created, err := interactor.ContentRepository.CreateVtuber(v)
	return created, err
}

func (interactor *ContentService) CreateMovie(m domain.Movie) (domain.Movie, error) {
	m = common.NormalizeMovie(m)

	if err := common.ValidateMovie(m); err != nil {
		return domain.Movie{}, err
	}

	created, err := interactor.ContentRepository.CreateMovie(m)
	return created, err
}

// NOTE: 未経験時代の関数と異なり、MVCを意識しているため責務が単一
func (interactor *ContentService) CreateKaraokes(ks []domain.Karaoke) ([]domain.Karaoke, error) {
	for i, k := range ks {
		ks[i] = common.NormalizeKaraoke(k)

		if err := common.ValidateKaraoke(k); err != nil {
			return nil, err
		}
	}

	created, err := interactor.ContentRepository.CreateKaraokes(ks)
	return created, err
}

func (interactor *ContentService) UpdateVtuber(v domain.Vtuber) error {
	v = common.NormalizeVtuber(v)

	if err := common.ValidateVtuber(v); err != nil {
		return err
	}

	if err := interactor.ContentRepository.UpdateVtuber(v); err != nil {
		return err
	}
	return nil
}

func (interactor *ContentService) UpdateMovie(m domain.Movie) error {
	m = common.NormalizeMovie(m)

	if err := common.ValidateMovie(m); err != nil {
		return err
	}
	if err := interactor.ContentRepository.UpdateMovie(m); err != nil {
		return err
	}
	return nil
}
func (interactor *ContentService) UpdateKaraoke(k domain.Karaoke) error {
	k = common.NormalizeKaraoke(k)

	if err := common.ValidateKaraoke(k); err != nil {
		return err
	}
	if err := interactor.ContentRepository.UpdateKaraoke(k); err != nil {
		return err
	}
	return nil
}
func (interactor *ContentService) DeleteVtuber(v domain.Vtuber) error {
	err := interactor.ContentRepository.DeleteVtuber(v)
	return err
}

func (interactor *ContentService) DeleteMovie(m domain.Movie) error {
	err := interactor.ContentRepository.DeleteMovie(m)
	return err
}

func (interactor *ContentService) DeleteKaraoke(k domain.Karaoke) error {
	err := interactor.ContentRepository.DeleteKaraoke(k)
	return err
}

func (interactor *ContentService) VerifyUserModifyVtuber(id domain.ListenerId, v domain.Vtuber) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyVtuber(id, v)
	return isAuth, err
}
func (interactor *ContentService) VerifyUserModifyMovie(id domain.ListenerId, m domain.Movie) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyMovie(id, m)
	return isAuth, err
}
func (interactor *ContentService) VerifyUserModifyKaraoke(id domain.ListenerId, k domain.Karaoke) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyKaraoke(id, k)
	return isAuth, err
}
