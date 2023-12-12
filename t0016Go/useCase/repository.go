package useCase

import "github.com/sharin-sushi/0016go_next_relation/domain"

// user_interactorと同じだけある
type UserRepository interface {
	CreateUser(domain.Listener) (domain.Listener, error)
	LogicalDeleteUser(domain.Listener) error
	FindUserByEmail(string) (domain.Listener, error)
	// LogIn(domain.Listener) (domain.Listener, error)
	FindUserByListenerId(domain.ListenerId) (domain.Listener, error)
}

type VtuberContentRepository interface {
	// 基本的なCRUd
	GetAllVtubers() ([]domain.Vtuber, error)
	GetAllMovies() ([]domain.Movie, error)
	GetAllKaraokes() ([]domain.Karaoke, error)
	GetAllVtubersMovies() ([]domain.VtuberMovie, error)
	GetEssentialJoinVtubersMoviesKaraokes() ([]domain.EssentialOfVtMoKa, error)
	GetAllVtubersMoviesKaraokes() ([]domain.VtuberMovieKaraoke, error)
	CreateVtuber(domain.Vtuber) error
	CreateMovie(domain.Movie) error
	CreateKaraokeSing(domain.Karaoke) error
	// // CreateOrinalSong() (error) //実装予定
	UpdateVtuber(domain.Vtuber) error
	UpdateMovie(domain.Movie) error
	UpdateKaraokeSing(domain.Karaoke) error
	// // UpdateSong() (error) //実装予定
	DeleteVtuber(domain.Vtuber) error
	DeleteMovie(m domain.Movie) error
	DeleteKaraokeSing(domain.Karaoke) error
	// // DeleteSong() (domain.OriginalSong, error) //実装予定

	// データ登録者の確認
	VerifyUserModifyVtuber(int, domain.Vtuber) (bool, error)
	VerifyUserModifyMovie(int, domain.Movie) (bool, error)
	VerifyUserModifyKaraoke(int, domain.Karaoke) (bool, error)

	//自分が登録したコンテンツデータの取得(マイページ用)

	// 追加中
	GetAllRecordOfUserInput(domain.ListenerId) ([]domain.Vtuber, []domain.VtuberMovie, []domain.VtuberMovieKaraoke, error)
}

type FavoriteRepository interface {
	FindFavoriteIdByFavOrUnfavRegistry(domain.Favorite) uint
	SaveMovieFavorite(domain.Favorite) error
	DeleteMovieFavorite(domain.Favorite) error
	SaveKaraokeFavorite(domain.Favorite) error
	DeleteKaraokeFavorite(domain.Favorite) error

	// CountUserFavorite(domain.ListenerId) ([]domain.Favorite, error) //使ってたのか分からなくなっちゃった。エラー解消したら消す。
	CountKaraokeFavorites() ([]domain.TransmitKaraoke, error)
	CountMovieFavorites() ([]domain.TransmitMovie, error)

	// 追加中
	GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error)
	GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error)

	// FindAllFavContensByListenerId([]domain.Favorite) ([]domain.VtuberMovie, []domain.VtuberMovieKaraoke, []error)
	FindFavMoviesByListenerId([]domain.Favorite) ([]domain.VtuberMovie, error)
	FindFavKaraokesByListenerId([]domain.Favorite) ([]domain.VtuberMovieKaraoke, error)

	FindFavsOfUser(domain.ListenerId) ([]domain.Favorite, error)
	FindFavsByListenerId(domain.ListenerId, domain.Favorite) (domain.Favorite, error)
}
