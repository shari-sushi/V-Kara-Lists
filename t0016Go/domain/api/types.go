package api

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// NOTE: 通信用の型　今後これに移行していき、型を整理していく

type MovieUrl string

// create karaoke, create karaokes 用
type CreateKaraokeSongRequest struct {
	MovieUrl MovieUrl // `json:"movie_url"`
	KaraokeSong
}

type CreateKaraokeSongsRequest struct {
	MovieUrl MovieUrl      // `json:"movie_url"`
	Songs    []KaraokeSong // `json:"songs"`
}

type KaraokeSong struct {
	SingStart string // `json:"sing_start"`
	SongName  string // `json:"song_name"`
}

type CreateVtuberResponse struct {
	Vtuber domain.Vtuber `json:"vtuber"`
}

type CreateMovieResponse struct {
	Movie domain.Movie `json:"movie"`
}

type CreateKaraokesResponse struct {
	Karaokes []domain.Karaoke `json:"karaokes"`
}

func CreateKaraokeSongsRequestToKaraokes(req CreateKaraokeSongsRequest, requestListenerID domain.ListenerId) []domain.Karaoke {
	var resp []domain.Karaoke
	for _, karaoke := range req.Songs {
		resp = append(resp, domain.Karaoke{
			MovieUrl:  domain.MovieUrl(req.MovieUrl),
			SingStart: karaoke.SingStart,
			SongName:  karaoke.SongName,
		})
	}
	return resp
}
