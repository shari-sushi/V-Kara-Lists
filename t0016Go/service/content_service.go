package service

import (
	"errors"
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

// ErrInvalidVideoCategory は許容されない category の値が指定されたことを表す。
var ErrInvalidVideoCategory = errors.New("video category is invalid")

// ErrVideoCategoryGroupChange は、単曲グループ(オリ曲/歌ってみた)と複数曲グループ(歌枠/ライブ)を
// またいで category を変えようとしたことを表す(#455)。
var ErrVideoCategoryGroupChange = errors.New("video category cannot change between single-song and multi-song groups")

// UpdateVideo は動画を更新する。category の変更は同じグループ内(11⇔12、31⇔32)だけ許可する。
// グループをまたぐと「単曲は歌唱行を必ず1件だけ持つ」という不変条件が崩れるため
// (例: 歌が3件ある歌枠をオリ曲にする、単曲のセンチネル値 sing_start が歌枠に残る)。
func (interactor *ContentService) UpdateVideo(v domain.Video) error {
	v = common.NormalizeVideo(v)

	if err := common.ValidateVideo(v); err != nil {
		return err
	}
	if !v.Category.IsValid() {
		return fmt.Errorf("%w: %d", ErrInvalidVideoCategory, v.Category)
	}

	current, err := interactor.ContentRepository.GetVideoById(v.VideoId)
	if err != nil {
		return err
	}
	// TODO: オリ曲・歌ってみた(1動画1曲)の画面を作るときに、グループをまたぐ変更を条件付きで許可する。案は次のどちらか。
	//   - 複数曲→単曲: 歌が1件だけになり開始時間が 00:00:00 に固定されることを確認モーダルで伝えてから変更する
	//   - 歌唱行が 00:00:00 の1件しかない動画に限って変更を許可する
	// 今はフロントが歌枠・ライブ(31/32)しか選ばせないので、画面からこの分岐には来ない。
	if current.Category.IsSingleSong() != v.Category.IsSingleSong() {
		return fmt.Errorf("%w: %d -> %d", ErrVideoCategoryGroupChange, current.Category, v.Category)
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
