package repository

import (
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// このファイルは #402 で発見されたSQLインジェクション脆弱性(旧favoritesテーブルのfmt.Sprintfによる
// WHERE句組み立て)がプレースホルダー化により再発しないことを実DBに対して検証するテスト。
//
// DB再設計(#398)で旧Favorite(MovieUrl文字列を持つ)はFavoriteVideo/FavoriteVideoSong(いずれもint型の
// ListenerId/VideoId/VideoSongIdのみ)に置き換わり、int列だけを持つテーブルはSQLドライバの型付きバイン
// ドにより文字列注入自体が成立しない。一方で GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts の
// kana引数は依然としてユーザー入力の文字列がWHERE句に渡る経路であるため、ここでプレースホルダーが
// 機能していることを実DBで確認する。
func TestGetVtubersVideosVideoSongsByVtuberKanaWithFavCnts_BlocksSQLInjection(t *testing.T) {
	repo := connectTestDB(t)

	victimVtuber := domain.Vtuber{VtuberName: "victim-vtuber", VtuberKana: "victim-kana", VtuberInputterId: 1}
	if err := repo.SqlHandler.Create(&victimVtuber).Error; err != nil {
		t.Fatalf("failed to seed victim vtuber: %v", err)
	}
	victimVideo := domain.Video{
		Category:   domain.KARAOKE_CATEGORY,
		MovieUrl:   "victim-movie-url",
		Title:      "victim-title",
		VtuberId:   victimVtuber.VtuberId,
		InputterId: 1,
	}
	if err := repo.SqlHandler.Create(&victimVideo).Error; err != nil {
		t.Fatalf("failed to seed victim video: %v", err)
	}
	victimVideoSong := domain.VideoSong{
		VideoId:    victimVideo.VideoId,
		SingStart:  "00:01:00",
		SongName:   "victim-song",
		InputterId: 1,
	}
	if err := repo.SqlHandler.Create(&victimVideoSong).Error; err != nil {
		t.Fatalf("failed to seed victim video song: %v", err)
	}

	attackerKana := "nonexistent' OR '1'='1"

	got, err := repo.GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(attackerKana)
	if err != nil {
		t.Fatalf("GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts returned unexpected error: %v", err)
	}

	if len(got) != 0 {
		t.Fatalf("SQLインジェクションにより他のvtuberのデータが取得できてしまった: got %d rows, want 0", len(got))
	}
}

// DeleteVideoFavoriteがプレースホルダー経由でlistener_id/video_idの両方に絞り込み、
// 他ユーザーのお気に入りを誤って削除しないことを確認する。
func TestDeleteVideoFavorite_ScopesToListenerAndVideo(t *testing.T) {
	repo := connectTestDB(t)

	victim := domain.FavoriteVideo{ListenerId: 1, VideoId: 100}
	if err := repo.SqlHandler.Create(&victim).Error; err != nil {
		t.Fatalf("failed to seed victim favorite: %v", err)
	}

	attacker := domain.FavoriteVideo{ListenerId: 999999, VideoId: 100} // 別listenerからの削除リクエスト
	if err := repo.DeleteVideoFavorite(attacker); err != nil {
		t.Fatalf("DeleteVideoFavorite returned unexpected error: %v", err)
	}

	got := countFavoriteVideos(t, repo)
	if got != 1 {
		t.Fatalf("他ユーザーのお気に入りが削除された可能性がある: got %d favorites remaining, want 1", got)
	}
}
