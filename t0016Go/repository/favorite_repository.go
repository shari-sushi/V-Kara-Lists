package repository

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

type favoriteRepository struct {
	SqlHandler
}

func (db *favoriteRepository) CreateVideoFavorite(fav domain.FavoriteVideo) error {
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) CreateVideoSongFavorite(fav domain.FavoriteVideoSong) error {
	err := db.Create(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) DeleteVideoFavorite(fav domain.FavoriteVideo) error {
	err := db.Where("listener_id = ? AND video_id = ?", fav.ListenerId, fav.VideoId).Delete(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) DeleteVideoSongFavorite(fav domain.FavoriteVideoSong) error {
	err := db.Where("listener_id = ? AND video_song_id = ?", fav.ListenerId, fav.VideoSongId).Delete(&fav).Error
	if err != nil {
		return err
	}
	return nil
}

func (db *favoriteRepository) FindFavoriteVideoByListenerAndVideo(lId domain.ListenerId, videoId domain.VideoId) (domain.FavoriteVideo, error) {
	var fav domain.FavoriteVideo
	err := db.Where("listener_id = ? AND video_id = ?", lId, videoId).First(&fav).Error
	return fav, err
}

func (db *favoriteRepository) FindFavoriteVideoSongByListenerAndVideoSong(lId domain.ListenerId, videoSongId domain.VideoSongId) (domain.FavoriteVideoSong, error) {
	var fav domain.FavoriteVideoSong
	err := db.Where("listener_id = ? AND video_song_id = ?", lId, videoSongId).First(&fav).Error
	return fav, err
}

func (db *favoriteRepository) FindFavoriteVideosCreatedByListenerId(lId domain.ListenerId) ([]domain.ReceivedFavoriteVideo, error) {
	var favs []domain.FavoriteVideo
	var received []domain.ReceivedFavoriteVideo

	result := db.Select("id, listener_id, video_id").Where("listener_id = ?", lId).Model(&favs).Scan(&received)
	return received, result.Error
}

func (db *favoriteRepository) FindFavoriteVideoSongsCreatedByListenerId(lId domain.ListenerId) ([]domain.ReceivedFavoriteVideoSong, error) {
	var favs []domain.FavoriteVideoSong
	var received []domain.ReceivedFavoriteVideoSong

	result := db.Select("id, listener_id, video_song_id").Where("listener_id = ?", lId).Model(&favs).Scan(&received)
	return received, result.Error
}

func (db *favoriteRepository) GetVtubersVideosWithFavCnts() ([]domain.TransmitVideo, error) {
	var TmVs []domain.TransmitVideo
	var err error

	var v domain.Video
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "videos.id AS video_id, videos.category, videos.movie_url, videos.title, videos.published_at, videos.inputter_id AS video_inputter_id"
	selectQu3 := "COUNT(fv.id) AS count"
	joinQu1 := "LEFT JOIN vtubers USING(vtuber_id) "
	joinQu2 := "LEFT JOIN favorite_videos AS fv ON videos.id = fv.video_id"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	groupQu := "videos.id, vtubers.vtuber_id"
	err = db.Model(v).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Group(groupQu).
		Scan(&TmVs).Error

	if err != nil {
		return TmVs, err
	}

	return TmVs, nil
}

func (db *favoriteRepository) GetVtubersVideosVideoSongsWithFavCnts() ([]domain.TransmitVideoSong, error) {
	var TmVss []domain.TransmitVideoSong
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "v.id AS video_id, v.category, v.movie_url, v.title, v.published_at, v.inputter_id AS video_inputter_id "
	selectQu3 := "vs.id AS video_song_id, vs.sing_start, vs.song_name, vs.inputter_id AS video_song_inputter_id "
	selectQu4 := "COUNT(fvs.id) AS count"
	joinQu1 := "LEFT JOIN videos AS v USING(vtuber_id) "
	joinQu2 := "LEFT JOIN video_songs AS vs ON v.id = vs.video_id "
	joinQu3 := "LEFT JOIN favorite_video_songs AS fvs ON vs.id = fvs.video_song_id"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "v.id IS NOT NULL AND vs.id IS NOT NULL"
	groupQu := "vs.id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu).Group(groupQu).
		Scan(&TmVss).Error

	if err != nil {
		return TmVss, err
	}

	return TmVss, nil
}

func (db *favoriteRepository) GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(kana string) ([]domain.TransmitVideoSong, error) {
	var TmVss []domain.TransmitVideoSong
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "v.id AS video_id, v.category, v.movie_url, v.title, v.published_at, v.inputter_id AS video_inputter_id "
	selectQu3 := "vs.id AS video_song_id, vs.sing_start, vs.song_name, vs.inputter_id AS video_song_inputter_id "
	selectQu4 := "COUNT(fvs.id) AS count"
	joinQu1 := "LEFT JOIN videos AS v USING(vtuber_id) "
	joinQu2 := "LEFT JOIN video_songs AS vs ON v.id = vs.video_id "
	joinQu3 := "LEFT JOIN favorite_video_songs AS fvs ON vs.id = fvs.video_song_id"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "vtubers.vtuber_kana = ? AND v.id IS NOT NULL AND vs.id IS NOT NULL"
	groupQu := "vs.id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu, kana).Group(groupQu).
		Scan(&TmVss).Error

	if err != nil {
		return TmVss, err
	}

	return TmVss, nil
}

func (db *favoriteRepository) GetLatest50VtubersVideosVideoSongsWithFavCnts(guestId domain.ListenerId) ([]domain.TransmitVideoSong, error) {
	var TmVss []domain.TransmitVideoSong
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "v.id AS video_id, v.category, v.movie_url, v.title, v.published_at, v.inputter_id AS video_inputter_id "
	selectQu3 := "vs.id AS video_song_id, vs.sing_start, vs.song_name, vs.inputter_id AS video_song_inputter_id "
	selectQu4 := "COUNT(fvs.id) AS count"
	joinQuA := "LEFT JOIN videos AS v USING(vtuber_id) "
	joinQuB := "LEFT JOIN video_songs AS vs ON v.id = vs.video_id "
	joinQuC := "LEFT JOIN favorite_video_songs AS fvs ON vs.id = fvs.video_song_id"
	joinQu1 := fmt.Sprint(joinQuA, joinQuB)
	joinQu2 := fmt.Sprint(joinQuC)
	whereQu1 := "vs.inputter_id != ?"
	whereQu2 := "v.id IS NOT NULL AND vs.id IS NOT NULL"
	groupQu := "vs.id"
	orderQu := "`vs`.`id` DESC"
	limitQu := 50
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu1).Where(whereQu1, guestId).Joins(joinQu2).Where(whereQu2).Group(groupQu).Order(orderQu).Limit(limitQu).
		Scan(&TmVss).Error

	if err != nil {
		return TmVss, err
	}

	return TmVss, nil
}

func (db *favoriteRepository) FindVtubersCreatedByListenerId(lId domain.ListenerId) ([]domain.Vtuber, error) {
	var vts []domain.Vtuber
	err := db.Where("vtuber_inputter_id = ?", lId).Find(&vts).Error
	if err != nil {
		return vts, err
	}
	return vts, nil
}

func (db *favoriteRepository) FindVideosCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitVideo, error) {
	var TmVs []domain.TransmitVideo
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id"
	selectQu2 := "v.id AS video_id, v.category, v.movie_url, v.title, v.published_at, v.inputter_id AS video_inputter_id"
	selectQu3 := "COUNT(fv.id) AS count "
	joinQu1 := "LEFT JOIN videos AS v USING(vtuber_id)"
	joinQu2 := "LEFT JOIN favorite_videos AS fv ON v.id = fv.video_id"
	joinQu := fmt.Sprint(joinQu1, joinQu2)
	whereQu := "v.id IS NOT NULL AND v.inputter_id = ?"
	groupQu := "v.id, vtubers.vtuber_id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3).
		Joins(joinQu).Where(whereQu, lId).Group(groupQu).
		Scan(&TmVs).Error

	if err != nil {
		return TmVs, err
	}

	return TmVs, nil
}

func (db *favoriteRepository) FindVideoSongsCreatedByListenerId(lId domain.ListenerId) ([]domain.TransmitVideoSong, error) {
	var TmVss []domain.TransmitVideoSong
	var err error

	var vt domain.Vtuber
	selectQu1 := "vtubers.vtuber_id, vtubers.vtuber_name, vtubers.vtuber_kana, vtubers.intro_movie_url, vtubers.vtuber_inputter_id "
	selectQu2 := "v.id AS video_id, v.category, v.movie_url, v.title, v.published_at, v.inputter_id AS video_inputter_id "
	selectQu3 := "vs.id AS video_song_id, vs.sing_start, vs.song_name, vs.inputter_id AS video_song_inputter_id "
	selectQu4 := "COUNT(fvs.id) AS count"
	joinQu1 := "LEFT JOIN videos AS v USING(vtuber_id) "
	joinQu2 := "LEFT JOIN video_songs AS vs ON v.id = vs.video_id "
	joinQu3 := "LEFT JOIN favorite_video_songs AS fvs ON vs.id = fvs.video_song_id"
	joinQu := fmt.Sprint(joinQu1, joinQu2, joinQu3)
	whereQu := "v.id IS NOT NULL AND vs.id IS NOT NULL AND vs.inputter_id = ?"
	groupQu := "vs.id"
	err = db.Model(vt).Select(selectQu1, selectQu2, selectQu3, selectQu4).
		Joins(joinQu).Where(whereQu, lId).Group(groupQu).
		Scan(&TmVss).Error
	if err != nil {
		return TmVss, err
	}

	return TmVss, nil
}
