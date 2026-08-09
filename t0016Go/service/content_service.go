package service

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

type ContentService struct {
	ContentRepository repository.ContentRepository
}

func (interactor *ContentService) GetVtubers() ([]domain.Vtuber, error) {
	allVts, err := interactor.ContentRepository.GetVtubers()
	return allVts, err
}

func (interactor *ContentService) GetVtuberByKana(kana string) (domain.Vtuber, error) {
	vt, err := interactor.ContentRepository.GetVtuberByKana(kana)
	return vt, err
}

func (interactor *ContentService) GetVideosByVtuber(id domain.VtuberId) ([]domain.Video, error) {
	vs, err := interactor.ContentRepository.GetVideosByVtuber(id)
	return vs, err
}

func (interactor *ContentService) GetVideo(url domain.MovieUrl) (domain.Video, error) {
	v, err := interactor.ContentRepository.GetVideoByUrl(url)
	return v, err
}

func (interactor *ContentService) GetVideos() ([]domain.Video, error) {
	allVs, err := interactor.ContentRepository.GetVideos()
	return allVs, err
}

func (interactor *ContentService) GetVideoSongs() ([]domain.VideoSong, error) {
	allVss, err := interactor.ContentRepository.GetVideoSongs()
	return allVss, err
}

func (interactor *ContentService) CreateVtuber(v domain.Vtuber) (domain.Vtuber, error) {
	v = common.NormalizeVtuber(v)

	if err := common.ValidateVtuber(v); err != nil {
		return domain.Vtuber{}, err
	}

	created, err := interactor.ContentRepository.CreateVtuber(v)
	return created, err
}

func (interactor *ContentService) CreateVideo(v domain.Video) (domain.Video, error) {
	v = common.NormalizeVideo(v)

	if err := common.ValidateVideo(v); err != nil {
		return domain.Video{}, err
	}

	created, err := interactor.ContentRepository.CreateVideo(v)
	return created, err
}

// CreateVideoSongs は動画に紐づく歌唱行を作成する。
// 単曲カテゴリ(オリ曲/歌ってみた)では動画1本につき歌唱行は必ず1件で、
// SingStart には固定センチネル値(SingleSongSentinelSingStart)を強制する。
// これによりUNIQUE(video_id, sing_start)制約で単曲の重複作成を防ぐ
// (詳細はV-Kara-Lists.wiki/設計判断ログ.mdを参照)。
func (interactor *ContentService) CreateVideoSongs(vss []domain.VideoSong) ([]domain.VideoSong, error) {
	if len(vss) == 0 {
		return nil, fmt.Errorf("video songs are empty")
	}

	video, err := interactor.ContentRepository.GetVideoById(vss[0].VideoId)
	if err != nil {
		return nil, err
	}

	if video.Category.IsSingleSong() && len(vss) != 1 {
		return nil, fmt.Errorf("single song category(%d) must have exactly one video song", video.Category)
	}

	for i, vs := range vss {
		if video.Category.IsSingleSong() {
			vs.SingStart = domain.SingleSongSentinelSingStart
		}
		vss[i] = common.NormalizeVideoSong(vs)

		if err := common.ValidateVideoSong(vss[i]); err != nil {
			return nil, err
		}
	}

	created, err := interactor.ContentRepository.CreateVideoSongs(vss)
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

func (interactor *ContentService) UpdateVideo(v domain.Video) error {
	v = common.NormalizeVideo(v)

	if err := common.ValidateVideo(v); err != nil {
		return err
	}
	if err := interactor.ContentRepository.UpdateVideo(v); err != nil {
		return err
	}
	return nil
}

// UpdateVideoSong は歌唱行を更新する。CreateVideoSongsと同様、対象動画が単曲カテゴリ
// (オリ曲/歌ってみた)の場合はSingStartにセンチネル値を強制する。ここで強制しないと、
// 編集経由でSingStartが任意値に変わってしまい「単曲は必ず1行」という不変条件が
// CreateVideoSongsの新規追加時にUNIQUE制約をすり抜けて崩れる
// (詳細はV-Kara-Lists.wiki/設計判断ログ.mdを参照)。
func (interactor *ContentService) UpdateVideoSong(vs domain.VideoSong) error {
	video, err := interactor.ContentRepository.GetVideoById(vs.VideoId)
	if err != nil {
		return err
	}

	if video.Category.IsSingleSong() {
		vs.SingStart = domain.SingleSongSentinelSingStart
	}
	vs = common.NormalizeVideoSong(vs)

	if err := common.ValidateVideoSong(vs); err != nil {
		return err
	}
	if err := interactor.ContentRepository.UpdateVideoSong(vs); err != nil {
		return err
	}
	return nil
}

func (interactor *ContentService) DeleteVtuber(v domain.Vtuber) error {
	err := interactor.ContentRepository.DeleteVtuber(v)
	return err
}

func (interactor *ContentService) DeleteVideo(v domain.Video) error {
	err := interactor.ContentRepository.DeleteVideo(v)
	return err
}

func (interactor *ContentService) DeleteVideoSong(vs domain.VideoSong) error {
	err := interactor.ContentRepository.DeleteVideoSong(vs)
	return err
}

func (interactor *ContentService) VerifyUserModifyVtuber(id domain.ListenerId, v domain.Vtuber) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyVtuber(id, v)
	return isAuth, err
}
func (interactor *ContentService) VerifyUserModifyVideo(id domain.ListenerId, v domain.Video) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyVideo(id, v)
	return isAuth, err
}
func (interactor *ContentService) VerifyUserModifyVideoSong(id domain.ListenerId, vs domain.VideoSong) (bool, error) {
	isAuth, err := interactor.ContentRepository.VerifyUserModifyVideoSong(id, vs)
	return isAuth, err
}
