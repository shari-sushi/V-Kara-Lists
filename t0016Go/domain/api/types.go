package api

import (
	"time"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// NOTE: 通信用の型　今後これに移行していき、型を整理していく

type MovieUrl string

// create video 用
type CreateVideoRequest struct {
	VtuberId    domain.VtuberId      // `json:"vtuber_id"`
	Category    domain.VideoCategory // `json:"category"`
	MovieUrl    MovieUrl             // `json:"movie_url"`
	Title       string               // `json:"title"`
	PublishedAt *time.Time           // `json:"published_at"`
}

// create video song, create video songs 用
type VideoSongInput struct {
	SingStart string // `json:"sing_start"`
	SongName  string // `json:"song_name"`
}

type CreateVideoSongsRequest struct {
	VideoId domain.VideoId   // `json:"video_id"`
	Songs   []VideoSongInput // `json:"songs"`
}

type CreateVtuberResponse struct {
	Vtuber domain.Vtuber `json:"vtuber"`
}

type CreateVideoResponse struct {
	Video domain.Video `json:"video"`
}

type CreateVideoSongsResponse struct {
	VideoSongs []domain.VideoSong `json:"video_songs"`
}

// edit, delete 用のレスポンス。CreateXResponseと同様に、成功時は実際のデータを返す(#326, #257)。
type EditVtuberResponse struct {
	Vtuber domain.Vtuber `json:"vtuber"`
}

type EditVideoResponse struct {
	Video domain.Video `json:"video"`
}

type EditVideoSongResponse struct {
	VideoSong domain.VideoSong `json:"video_song"`
}

type DeleteVtuberResponse struct {
	Vtuber domain.Vtuber `json:"vtuber"`
}

type DeleteVideoResponse struct {
	Video domain.Video `json:"video"`
}

type DeleteVideoSongResponse struct {
	VideoSong domain.VideoSong `json:"video_song"`
}

// PublicVideo は不特定多数の閲覧者に返して良い動画情報。
// domain.Video の InputterId/CreatedAt/UpdatedAt は登録者本人以外に見せる必要が無いため含めない。
// どのフィールドをappへ返すかはこの変換関数(domain/api層)の責務とし、
// リポジトリのクエリでSELECT列を絞る形では担保しない。
type PublicVideo struct {
	VideoId     domain.VideoId       `json:"video_id"`
	Category    domain.VideoCategory `json:"category"`
	MovieUrl    domain.MovieUrl      `json:"movie_url"`
	Title       string               `json:"title"`
	VtuberId    domain.VtuberId      `json:"vtuber_id"`
	PublishedAt *time.Time           `json:"published_at"`
}

func VideosToPublicVideos(vs []domain.Video) []PublicVideo {
	resp := make([]PublicVideo, 0, len(vs))
	for _, v := range vs {
		resp = append(resp, PublicVideo{
			VideoId:     v.VideoId,
			Category:    v.Category,
			MovieUrl:    v.MovieUrl,
			Title:       v.Title,
			VtuberId:    v.VtuberId,
			PublishedAt: v.PublishedAt,
		})
	}
	return resp
}

func CreateVideoRequestToVideo(req CreateVideoRequest, requestListenerID domain.ListenerId) domain.Video {
	return domain.Video{
		Category:    req.Category,
		MovieUrl:    domain.MovieUrl(req.MovieUrl),
		Title:       req.Title,
		VtuberId:    req.VtuberId,
		PublishedAt: req.PublishedAt,
		InputterId:  requestListenerID,
	}
}

// CreateVideoSongsRequestToVideoSongs はリクエストからVideoSongを組み立てる。
// 単曲カテゴリでの SingStart センチネル値の適用は、Video.Category を参照する必要があるため
// service層(ContentService.CreateVideoSongs)で行う。
func CreateVideoSongsRequestToVideoSongs(req CreateVideoSongsRequest, requestListenerID domain.ListenerId) []domain.VideoSong {
	var resp []domain.VideoSong
	for _, song := range req.Songs {
		resp = append(resp, domain.VideoSong{
			VideoId:    req.VideoId,
			SingStart:  song.SingStart,
			SongName:   song.SongName,
			InputterId: requestListenerID,
		})
	}
	return resp
}
