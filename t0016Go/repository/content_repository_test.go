package repository

import (
	"os"
	"testing"
	"time"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// connectContentTestDB は TEST_DB_DSN が設定されている場合のみ実DBへ接続する。
// 未設定の場合は t.Skip して通常のユニットテスト実行(go test ./...)には影響しない。
func connectContentTestDB(t *testing.T) *contentRepository {
	t.Helper()

	dsn := os.Getenv("TEST_DB_DSN")
	if dsn == "" {
		t.Skip("TEST_DB_DSN が未設定のためスキップ (docker compose up -d db で起動後、TEST_DB_DSN を設定して実行してください)")
	}

	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect test db: %v", err)
	}

	if err := conn.AutoMigrate(&domain.Vtuber{}, &domain.Video{}, &domain.VideoSong{}); err != nil {
		t.Fatalf("failed to migrate tables: %v", err)
	}

	cleanup := func() {
		conn.Unscoped().Where("1 = 1").Delete(&domain.VideoSong{})
		conn.Unscoped().Where("1 = 1").Delete(&domain.Video{})
		conn.Unscoped().Where("1 = 1").Delete(&domain.Vtuber{})
	}
	t.Cleanup(cleanup)
	cleanup()

	return &contentRepository{SqlHandler: &testSqlHandler{Conn: conn}}
}

func createTestVtuber(t *testing.T, repo *contentRepository, name string) domain.Vtuber {
	t.Helper()
	v := domain.Vtuber{VtuberName: name, VtuberKana: name, VtuberInputterId: 1}
	if err := repo.SqlHandler.Create(&v).Error; err != nil {
		t.Fatalf("failed to create vtuber: %v", err)
	}
	return v
}

func createTestVideo(t *testing.T, repo *contentRepository, vtuberId domain.VtuberId, movieUrl, title string) domain.Video {
	t.Helper()
	v := domain.Video{
		Category:   1,
		MovieUrl:   domain.MovieUrl(movieUrl),
		Title:      title,
		VtuberId:   vtuberId,
		InputterId: 1,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	if err := repo.SqlHandler.Create(&v).Error; err != nil {
		t.Fatalf("failed to create video: %v", err)
	}
	return v
}

// DeleteVideo は同名タイトルの他の動画を巻き込まず、対象の VideoId のみを削除すること。
func TestDeleteVideo_ScopesByPrimaryKey_NotByNonUniqueTitle(t *testing.T) {
	repo := connectContentTestDB(t)
	vtuber := createTestVtuber(t, repo, "テストVTuber")

	target := createTestVideo(t, repo, vtuber.VtuberId, "https://youtu.be/target", "同じタイトル")
	other := createTestVideo(t, repo, vtuber.VtuberId, "https://youtu.be/other", "同じタイトル")

	if err := repo.DeleteVideo(target); err != nil {
		t.Fatalf("DeleteVideo returned error: %v", err)
	}

	var count int64
	if err := repo.SqlHandler.Model(&domain.Video{}).Where("id = ?", target.VideoId).Count(&count).Error; err != nil {
		t.Fatalf("failed to count target video: %v", err)
	}
	if count != 0 {
		t.Fatalf("target video was not deleted, count = %d", count)
	}

	if err := repo.SqlHandler.Model(&domain.Video{}).Where("id = ?", other.VideoId).Count(&count).Error; err != nil {
		t.Fatalf("failed to count other video: %v", err)
	}
	if count != 1 {
		t.Fatalf("other video with same title was unexpectedly deleted, count = %d", count)
	}
}

// DeleteVideo は紐づく VideoSong が存在しても道連れで削除できること。
// 単曲カテゴリでもVideoSongが必ず1行作られる仕様(#398)のため、
// 「VideoSongが存在したら拒否」という以前の実装だと動画を一切削除できなくなる不具合(#238)があった。
func TestDeleteVideo_CascadesVideoSong(t *testing.T) {
	repo := connectContentTestDB(t)
	vtuber := createTestVtuber(t, repo, "テストVTuber2")
	video := createTestVideo(t, repo, vtuber.VtuberId, "https://youtu.be/withsong", "曲付き動画")

	vs := domain.VideoSong{
		VideoId:    video.VideoId,
		SingStart:  domain.SingleSongSentinelSingStart,
		SongName:   "テスト曲",
		InputterId: 1,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	if err := repo.SqlHandler.Create(&vs).Error; err != nil {
		t.Fatalf("failed to create video song: %v", err)
	}

	if err := repo.DeleteVideo(video); err != nil {
		t.Fatalf("DeleteVideo returned error: %v", err)
	}

	var videoCount int64
	if err := repo.SqlHandler.Model(&domain.Video{}).Where("id = ?", video.VideoId).Count(&videoCount).Error; err != nil {
		t.Fatalf("failed to count video: %v", err)
	}
	if videoCount != 0 {
		t.Fatalf("video was not deleted, count = %d", videoCount)
	}

	var songCount int64
	if err := repo.SqlHandler.Model(&domain.VideoSong{}).Where("video_id = ?", video.VideoId).Count(&songCount).Error; err != nil {
		t.Fatalf("failed to count video song: %v", err)
	}
	if songCount != 0 {
		t.Fatalf("video song was not deleted along with its video, count = %d", songCount)
	}
}
