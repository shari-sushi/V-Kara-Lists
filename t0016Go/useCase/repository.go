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
	GetAllKaraokes() ([]domain.KaraokeList, error)
	GetAllVtubersMovies() ([]domain.VtuberMovie, error)
	GetEssentialJoinVtubersMoviesKaraokes() ([]domain.EssentialOfVtMoKa, error)
	GetAllVtubersMoviesKaraokes() ([]domain.VtuberMovieKaraoke, error)

	CreateVtuber(domain.Vtuber) error
	CreateMovie(domain.Movie) error
	CreateKaraokeSing(domain.KaraokeList) error
	// // CreateOrinalSong() (error) //実装予定
	UpdateVtuber(domain.Vtuber) error
	UpdateMovie(domain.Movie) error
	UpdateKaraokeSing(domain.KaraokeList) error
	// // UpdateSong() (error) //実装予定
	DeleteVtuber(domain.Vtuber) error
	DeleteMovie(m domain.Movie) error
	DeleteKaraokeSing(domain.KaraokeList) error
	// // DeleteSong() (domain.OriginalSong, error) //実装予定

	// データ登録者の確認
	VerifyUserModifyVtuber(int, domain.Vtuber) (bool, error)
	VerifyUserModifyMovie(int, domain.Movie) (bool, error)
	VerifyUserModifyKaraoke(int, domain.KaraokeList) (bool, error)

	//自分が登録したコンテンツデータの取得(マイページ用)
	// GetAllMyRecord(domain.ListenerId)(domain.Vtuber, domain.Movie, domain.KaraokeList, error)

}

type FavoriteRepository interface {
	CreateMovieFavorite(domain.Favorite) error
	DeleteMovieFavorite(domain.Favorite) error
	CreateKaraokeFavorite(domain.Favorite) error
	DeleteKaraokeFavorite(domain.Favorite) error

	// CountUserFavorite(domain.ListenerId) ([]domain.Favorite, error)
	CountAllMovieFavorites() ([]domain.MovieFavoriteCount, error)
	CountAllKaraokeFavorites() ([]domain.KaraokeFavoriteCount, error)
}
