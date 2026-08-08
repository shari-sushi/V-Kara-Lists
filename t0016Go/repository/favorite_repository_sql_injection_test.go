package repository

import (
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// このファイルは #402 で発見されたSQLインジェクション脆弱性が、プレースホルダー化
// (favorite_repository.go)によりブロックされていることを実DBに対して証明するテスト。
//
// 修正前は DeleteMovieFavorite / FindFavoriteUnscopedByFavOrUnfavRegistry が
// fmt.Sprintf でWHERE句を組み立てており、存在しない listener_id と
// movie_url = "nonexistent' OR '1'='1" を渡すと、
//
//	whereQu := fmt.Sprintf("listener_id = %v AND movie_url = '%v' AND karaoke_id = 0", fav.ListenerId, fav.MovieUrl)
//	// => listener_id = 999999 AND movie_url = 'nonexistent' OR '1'='1' AND karaoke_id = 0
//
// AND が OR より優先されるSQLの評価順により
// "(listener_id = 999999 AND movie_url = 'nonexistent') OR ('1'='1' AND karaoke_id = 0)"
// と解釈され、他ユーザーのレコードが操作できてしまっていた(実際に確認済み)。
//
// このテストは修正前のコードに対しては一旦FAILすることを確認したうえで、
// 現在のプレースホルダー実装で注入がブロックされることを検証する内容に書き換えている。
func TestDeleteMovieFavorite_BlocksSQLInjection(t *testing.T) {
	repo := connectTestDB(t)

	victim := domain.Favorite{ListenerId: 1, MovieUrl: "victim-movie-url", KaraokeId: 0}
	if err := repo.SqlHandler.Create(&victim).Error; err != nil {
		t.Fatalf("failed to seed victim favorite: %v", err)
	}

	attacker := domain.Favorite{
		ListenerId: 999999, // 存在しないlistener_id
		MovieUrl:   "nonexistent' OR '1'='1",
		KaraokeId:  0,
	}

	if err := repo.DeleteMovieFavorite(attacker); err != nil {
		t.Fatalf("DeleteMovieFavorite returned unexpected error: %v", err)
	}

	got := countFavorites(t, repo)
	if got != 1 {
		t.Fatalf("SQLインジェクションにより他ユーザーのお気に入りが削除された可能性がある: got %d favorites remaining, want 1", got)
	}
}

func TestFindFavoriteUnscopedByFavOrUnfavRegistry_BlocksSQLInjection(t *testing.T) {
	repo := connectTestDB(t)

	victim := domain.Favorite{ListenerId: 1, MovieUrl: "victim-movie-url", KaraokeId: 0}
	if err := repo.SqlHandler.Create(&victim).Error; err != nil {
		t.Fatalf("failed to seed victim favorite: %v", err)
	}

	attacker := domain.Favorite{
		ListenerId: 999999, // 存在しないlistener_id
		MovieUrl:   "nonexistent' OR '1'='1",
		KaraokeId:  0,
	}

	got := repo.FindFavoriteUnscopedByFavOrUnfavRegistry(attacker)

	if got.MovieUrl == victim.MovieUrl {
		t.Fatalf("SQLインジェクションにより他ユーザーのお気に入りが取得できてしまった: got movie_url=%q", got.MovieUrl)
	}
}
