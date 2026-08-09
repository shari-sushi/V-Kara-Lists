package common

import (
	"strings"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func NormalizeVtuber(v domain.Vtuber) domain.Vtuber {
	// v.VtuberId = strings.TrimSpace(v.VtuberId)
	v.VtuberName = strings.TrimSpace(v.VtuberName)
	v.IntroMovieUrl = strings.TrimSpace(v.IntroMovieUrl)
	v.VtuberKana = strings.TrimSpace(v.VtuberKana)
	// v.VtuberInputterId = strings.TrimSpace(v.VtuberInputterId)
	return v
}

func ValidateVtuber(v domain.Vtuber) error {
	return validation.ValidateStruct(&v,
		validation.Field(&v.VtuberName,
			validation.Required.Error("vtuber name is required"),
			validation.Length(2, 50).Error("vtuber name needs 2 ~ 50 chars"),
		))
}

func NormalizeVideo(v domain.Video) domain.Video {
	v.Title = strings.TrimSpace(v.Title)
	v.MovieUrl = domain.MovieUrl(strings.TrimSpace(string(v.MovieUrl)))
	return v
}

func ValidateVideo(v domain.Video) error {
	return validation.ValidateStruct(&v,
		validation.Field(&v.Category,
			validation.Required.Error("category is required"),
		),
		validation.Field(&v.MovieUrl,
			validation.Required.Error("movie url is required"),
			validation.Length(4, 100).Error("movie url needs 4 ~ 100 chars"),
		),
		validation.Field(&v.Title,
			validation.Required.Error("title is required"),
		),
	)
}

func NormalizeVideoSong(vs domain.VideoSong) domain.VideoSong {
	vs.SingStart = strings.TrimSpace(vs.SingStart)
	vs.SongName = strings.TrimSpace(vs.SongName)
	return vs
}

func ValidateVideoSong(vs domain.VideoSong) error {
	return validation.ValidateStruct(&vs,
		validation.Field(&vs.VideoId,
			validation.Required.Error("video id is required"),
		),
		validation.Field(&vs.SingStart,
			validation.Required.Error("sing start is required"),
			validation.Length(4, 20).Error("sing start needs 4 ~ 20 chars"),
		),
		validation.Field(&vs.SongName,
			validation.Required.Error("song name is required"),
		),
	)
}
