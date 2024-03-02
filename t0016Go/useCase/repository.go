package useCase

import "github.com/sharin-sushi/0016go_next_relation/domain"

// user_interactorと同じだけある
type UserRepository interface {
	CreateUser(domain.Listener) (domain.Listener, error)
	LogicalDeleteUser(domain.Listener) error
	FindUserByEmail(string) (domain.Listener, error)
	FindUserByListenerId(domain.ListenerId) (domain.Listener, error)
}

type VtuberContentRepository interface {
	// 基本的なCRUd
	GetVtubers() ([]domain.Vtuber, error)            //
	GetMovies() ([]domain.Movie, error)              //
	GetKaraokes() ([]domain.Karaoke, error)          //
	GetVtubersMovies() ([]domain.VtuberMovie, error) //
	GetMoviesUrlTitleByVtuber(domain.VtuberId) ([]domain.Movie, error)
	// GetVtubersMoviesKaraokes() ([]domain.VtuberMovieKaraoke, error) //
	GetVtubersMoviesKaraokes() ([]domain.TransmitKaraoke, error) //
	CreateVtuber(domain.Vtuber) error                            //
	CreateMovie(domain.Movie) error                              //
	CreateKaraoke(domain.Karaoke) error                          //
	// // CreateOrinalSong() (error) //実装予定
	UpdateVtuber(domain.Vtuber) error   //
	UpdateMovie(domain.Movie) error     //
	UpdateKaraoke(domain.Karaoke) error //
	// // UpdateSong() (error) //実装予定
	DeleteVtuber(domain.Vtuber) error   //
	DeleteMovie(m domain.Movie) error   //
	DeleteKaraoke(domain.Karaoke) error //
	// // DeleteSong() (domain.OriginalSong, error) //実装予定

	// データ登録者の確認lId
	VerifyUserModifyVtuber(domain.ListenerId, domain.Vtuber) (bool, error)   //
	VerifyUserModifyMovie(domain.ListenerId, domain.Movie) (bool, error)     //
	VerifyUserModifyKaraoke(domain.ListenerId, domain.Karaoke) (bool, error) //

}

type FavoriteRepository interface {
	CountKaraokeFavorites() ([]domain.TransmitKaraoke, error) //
	CountMovieFavorites() ([]domain.TransmitMovie, error)     //

	CreateMovieFavorite(domain.Favorite) error   //
	CreateKaraokeFavorite(domain.Favorite) error //
	UpdateMovieFavorite(domain.Favorite) error   //
	UpdateKaraokeFavorite(domain.Favorite) error //
	DeleteMovieFavorite(domain.Favorite) error   //
	DeleteKaraokeFavorite(domain.Favorite) error //

	FindVtubersCreatedByListenerId(domain.ListenerId) ([]domain.Vtuber, error)
	FindMoviesCreatedByListenerId(domain.ListenerId) ([]domain.TransmitMovie, error)
	FindKaraokesCreatedByListenerId(domain.ListenerId) ([]domain.TransmitKaraoke, error)
	FindFavoriteUnscopedByFavOrUnfavRegistry(domain.Favorite) domain.Favorite              //
	FindFavoritesCreatedByListenerId(domain.ListenerId) ([]domain.ReceivedFavorite, error) //

	GetVtubersMoviesWithFavCnts() ([]domain.TransmitMovie, error)           //
	GetVtubersMoviesKaraokesWithFavCnts() ([]domain.TransmitKaraoke, error) //
	GetVtubersMoviesKaraokesByVtuerKanaWithFavCnts(string) ([]domain.TransmitKaraoke, error)
	GetLatest50VtubersMoviesKaraokesWithFavCnts(domain.ListenerId) ([]domain.TransmitKaraoke, error) //
	// 以下、開発中
	FindMoviesFavoritedByListenerId(domain.ListenerId) ([]domain.TransmitMovie, error)
	FindKaraokesFavoritedByListenerId(domain.ListenerId) ([]domain.TransmitKaraoke, error)
}

type OtherRepository interface {
	ExecRawQuery(string) error
}
