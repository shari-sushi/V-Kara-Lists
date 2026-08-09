package repository

import (
	"errors"
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/gorm"
)

type contentRepository struct {
	SqlHandler
}

func (db *contentRepository) GetVtubers() ([]domain.Vtuber, error) {
	var vts []domain.Vtuber
	err := db.Find(&vts).Error
	if err != nil {
		return []domain.Vtuber{}, err
	}
	return vts, nil
}

func (db *contentRepository) GetVtuberByKana(kana string) (domain.Vtuber, error) {
	var vt domain.Vtuber
	err := db.Where("vtuber_kana = ?", kana).First(&vt).Error
	if err != nil {
		return domain.Vtuber{}, err
	}
	return vt, nil
}

func (db *contentRepository) GetVideoById(id domain.VideoId) (domain.Video, error) {
	var v domain.Video
	err := db.Where("id = ?", id).First(&v).Error
	if err != nil {
		return domain.Video{}, err
	}
	return v, nil
}

func (db *contentRepository) GetVideoByUrl(url domain.MovieUrl) (domain.Video, error) {
	var v domain.Video
	err := db.Where("movie_url = ?", url).Find(&v).Error
	if err != nil {
		return domain.Video{}, err
	}
	return v, nil
}

func (db *contentRepository) GetVideos() ([]domain.Video, error) {
	var vs []domain.Video
	err := db.Find(&vs).Error
	if err != nil {
		return nil, err
	}
	return vs, nil
}

func (db *contentRepository) GetVideoSongs() ([]domain.VideoSong, error) {
	var vss []domain.VideoSong
	err := db.Find(&vss).Error
	if err != nil {
		return nil, err
	}
	return vss, nil
}

func (db *contentRepository) GetVideosByVtuber(id domain.VtuberId) ([]domain.Video, error) {
	var vs []domain.Video
	err := db.Where("vtuber_id = ?", id).Find(&vs).Error
	if err != nil {
		return nil, err
	}
	return vs, nil
}

func (db *contentRepository) CreateVtuber(V domain.Vtuber) (domain.Vtuber, error) {
	result := db.Omit("vtuber_id").Create(&V) //vtuber_idのみAUTO INCREMENT
	return V, result.Error
}

func (db *contentRepository) CreateVideo(V domain.Video) (domain.Video, error) {
	var v domain.Vtuber
	v.VtuberId = V.VtuberId
	if result := db.First(&v); result.Error != nil {
		return domain.Video{}, result.Error
	}
	result := db.Omit("id").Create(&V)
	return V, result.Error
}

func (db *contentRepository) CreateVideoSongs(vss []domain.VideoSong) ([]domain.VideoSong, error) {
	if len(vss) == 0 {
		return nil, fmt.Errorf("video songs are empty")
	}
	var v domain.Video
	if result := db.Where("id = ?", vss[0].VideoId).First(&v); result.Error != nil {
		return nil, result.Error
	}

	result := db.Omit("id").Create(&vss)
	return vss, result.Error
}

func (db *contentRepository) UpdateVtuber(V domain.Vtuber) error {
	result := db.Model(&V).Where("vtuber_id = ?", V.VtuberId).Updates(&V)
	if result.Error != nil {
		return result.Error
	}
	// vtuber_idが不正/未設定などでWHERE句が対象行にマッチしない場合、
	// GORMはエラーを返さず0件更新のまま成功扱いになる。
	// それを検知せず呼び出し元に成功を返すと、実際は変更されていないのに
	// 成功表示だけが出てしまう(#197)。RowsAffectedを見て明示的にエラー化する。
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (db *contentRepository) UpdateVideo(V domain.Video) error {
	var v domain.Video
	result := db.Model(&v).Where("id = ?", V.VideoId).Updates(&V)
	return result.Error
}

func (db *contentRepository) UpdateVideoSong(VS domain.VideoSong) error {
	var vs domain.VideoSong
	result := db.Model(&vs).Where("id = ?", VS.VideoSongId).Updates(&VS)
	return result.Error
}

func (db *contentRepository) DeleteVtuber(V domain.Vtuber) error {
	var v domain.Video
	db.Where("vtuber_id = ?", V.VtuberId).First(&v)
	if v.MovieUrl != "" {
		return fmt.Errorf("delete Vtuber after its Video")
	}
	result := db.Where("vtuber_name = ?", V.VtuberName).Delete(V) //フロント側の表示バグ対策でPK+αで絞込み
	return result.Error
}

func (db *contentRepository) DeleteVideo(V domain.Video) error {
	var vs domain.VideoSong
	err := db.Where("video_id = ?", V.VideoId).First(&vs).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if vs.VideoSongId != 0 {
		return fmt.Errorf("delete Video after its VideoSong")
	}
	result := db.Delete(&V, V.VideoId)
	return result.Error
}

func (db *contentRepository) DeleteVideoSong(VS domain.VideoSong) error {
	result := db.Delete(&VS, VS.VideoSongId)
	return result.Error
}

func (db *contentRepository) VerifyUserModifyVtuber(id domain.ListenerId, V domain.Vtuber) (bool, error) {
	result := db.Where("vtuber_inputter_id = ?", id).First(&V)
	return V.VtuberInputterId == id, result.Error
}

func (db *contentRepository) VerifyUserModifyVideo(id domain.ListenerId, V domain.Video) (bool, error) {
	result := db.Where("inputter_id = ?", id).First(&V, V.VideoId)
	return V.InputterId == id, result.Error
}

func (db *contentRepository) VerifyUserModifyVideoSong(id domain.ListenerId, VS domain.VideoSong) (bool, error) {
	result := db.Where("inputter_id = ?", id).First(&VS)
	return VS.InputterId == id, result.Error
}
