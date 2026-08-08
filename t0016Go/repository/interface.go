package repository

import "github.com/sharin-sushi/0016go_next_relation/domain"

// user_interactorと同じだけある
type UserRepository interface {
	CreateUser(domain.Listener) (domain.Listener, error)
	LogicalDeleteUser(domain.Listener) error
	FindUserByEmail(string) (domain.Listener, error)
	FindUserByListenerId(domain.ListenerId) (domain.Listener, error)
}

type ContentRepository interface {
	// 基本的なCRUd
	GetVtubers() ([]domain.Vtuber, error)
	GetVideoById(domain.VideoId) (domain.Video, error)
	GetVideoByUrl(url domain.MovieUrl) (domain.Video, error)
	GetVideos() ([]domain.Video, error)
	GetVideoSongs() ([]domain.VideoSong, error)
	GetVideosByVtuber(domain.VtuberId) ([]domain.Video, error)
	CreateVtuber(domain.Vtuber) (domain.Vtuber, error)
	CreateVideo(domain.Video) (domain.Video, error)
	CreateVideoSongs([]domain.VideoSong) ([]domain.VideoSong, error)
	UpdateVtuber(domain.Vtuber) error
	UpdateVideo(domain.Video) error
	UpdateVideoSong(domain.VideoSong) error
	DeleteVtuber(domain.Vtuber) error
	DeleteVideo(domain.Video) error
	DeleteVideoSong(domain.VideoSong) error

	// データ登録者の確認
	VerifyUserModifyVtuber(domain.ListenerId, domain.Vtuber) (bool, error)
	VerifyUserModifyVideo(domain.ListenerId, domain.Video) (bool, error)
	VerifyUserModifyVideoSong(domain.ListenerId, domain.VideoSong) (bool, error)
}

type FavoriteRepository interface {
	CreateVideoFavorite(domain.FavoriteVideo) error
	CreateVideoSongFavorite(domain.FavoriteVideoSong) error
	DeleteVideoFavorite(domain.FavoriteVideo) error
	DeleteVideoSongFavorite(domain.FavoriteVideoSong) error

	FindVtubersCreatedByListenerId(domain.ListenerId) ([]domain.Vtuber, error)
	FindVideosCreatedByListenerId(domain.ListenerId) ([]domain.TransmitVideo, error)
	FindVideoSongsCreatedByListenerId(domain.ListenerId) ([]domain.TransmitVideoSong, error)
	FindFavoriteVideoByListenerAndVideo(domain.ListenerId, domain.VideoId) (domain.FavoriteVideo, error)
	FindFavoriteVideoSongByListenerAndVideoSong(domain.ListenerId, domain.VideoSongId) (domain.FavoriteVideoSong, error)
	FindFavoriteVideosCreatedByListenerId(domain.ListenerId) ([]domain.ReceivedFavoriteVideo, error)
	FindFavoriteVideoSongsCreatedByListenerId(domain.ListenerId) ([]domain.ReceivedFavoriteVideoSong, error)

	GetVtubersVideosWithFavCnts() ([]domain.TransmitVideo, error)
	GetVtubersVideosVideoSongsWithFavCnts() ([]domain.TransmitVideoSong, error)
	GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(string) ([]domain.TransmitVideoSong, error)
	GetLatest50VtubersVideosVideoSongsWithFavCnts(domain.ListenerId) ([]domain.TransmitVideoSong, error)
}

type OtherRepository interface {
	ExecRawQuery(string) error
}
