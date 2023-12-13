package useCase

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type VtuberContentInteractor struct {
	VtuberContentRepository VtuberContentRepository
	UserRepository          UserRepository
	FavoriteRepository      FavoriteRepository
}

func (interactor *VtuberContentInteractor) GetVtubers() ([]domain.Vtuber, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	allVts, err := interactor.VtuberContentRepository.GetVtubers()
	return allVts, err
}
func (interactor *VtuberContentInteractor) GetMovies() ([]domain.Movie, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	allMos, err := interactor.VtuberContentRepository.GetMovies()
	return allMos, err
}
func (interactor *VtuberContentInteractor) GetKaraokes() ([]domain.Karaoke, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	allKas, err := interactor.VtuberContentRepository.GetKaraokes()
	return allKas, err
}

func (interactor *VtuberContentInteractor) GetVtubersMovies() ([]domain.VtuberMovie, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	VM, err := interactor.VtuberContentRepository.GetVtubersMovies()
	return VM, err
}

func (interactor *VtuberContentInteractor) GetVtubersMoviesKaraokes() ([]domain.VtuberMovieKaraoke, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	allVtsMosKas, err := interactor.VtuberContentRepository.GetVtubersMoviesKaraokes()
	return allVtsMosKas, err
}

func (interactor *VtuberContentInteractor) CreateVtuber(v domain.Vtuber) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.CreateVtuber(v)
	return err
}
func (interactor *VtuberContentInteractor) CreateMovie(m domain.Movie) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.CreateMovie(m)
	return err
}
func (interactor *VtuberContentInteractor) CreateKaraokeSing(k domain.Karaoke) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.CreateKaraokeSing(k)
	return err
}

func (interactor *VtuberContentInteractor) UpdateVtuber(v domain.Vtuber) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.UpdateVtuber(v)
	return err
}
func (interactor *VtuberContentInteractor) UpdateMovie(m domain.Movie) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.UpdateMovie(m)
	return err
}
func (interactor *VtuberContentInteractor) UpdateKaraokeSing(k domain.Karaoke) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.UpdateKaraokeSing(k)
	return err
}
func (interactor *VtuberContentInteractor) DeleteVtuber(v domain.Vtuber) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.DeleteVtuber(v)
	return err
}

func (interactor *VtuberContentInteractor) DeleteMovie(m domain.Movie) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.DeleteMovie(m)
	return err
}
func (interactor *VtuberContentInteractor) DeleteKaraokeSing(k domain.Karaoke) error {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	err := interactor.VtuberContentRepository.DeleteKaraokeSing(k)
	return err
}

func (interactor *VtuberContentInteractor) VerifyUserModifyVtuber(id int, v domain.Vtuber) (bool, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyVtuber(id, v)
	return isAuth, err
}
func (interactor *VtuberContentInteractor) VerifyUserModifyMovie(id int, m domain.Movie) (bool, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyMovie(id, m)
	return isAuth, err
}
func (interactor *VtuberContentInteractor) VerifyUserModifyKaraoke(id int, k domain.Karaoke) (bool, error) {
	fmt.Print("useCase/vtuber_content_interactor.go \n")
	isAuth, err := interactor.VtuberContentRepository.VerifyUserModifyKaraoke(id, k)
	return isAuth, err
}
