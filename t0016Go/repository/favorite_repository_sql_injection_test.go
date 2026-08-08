package repository

import (
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// このファイルは #402 で発見されたSQLインジェクション脆弱性を、実DBに対して
// 実際に成立することを証明するためのテスト。
//
// DeleteMovieFavorite / FindFavoriteUnscopedByFavOrUnfavRegistry は
// fmt.Sprintf でWHERE句を組み立てており、以下のように存在しない listener_id と
// movie_url = "nonexistent' OR '1'='1" を渡すと、
//
//	whereQu := fmt.Sprintf("listener_id = %v AND movie_url = '%v' AND karaoke_id = 0", fav.ListenerId, fav.MovieUrl)
//	// => listener_id = 999999 AND movie_url = 'nonexistent' OR '1'='1' AND karaoke_id = 0
//
// AND が OR より優先されるSQLの評価順により
// "(listener_id = 999999 AND movie_url = 'nonexistent') OR ('1'='1' AND karaoke_id = 0)"
// と解釈され、karaoke_id = 0 の全レコードが対象になってしまう(=他ユーザーのレコードを
// 操作できてしまう)。
//
// 修正PR(#402対応)ではこれらのテストが一旦FAILすることを確認したうえで、
// 注入がブロックされることを検証するテストに書き換える。
func TestDeleteMovieFavorite_SQLInjectionSucceeds(t *testing.T) {
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
	if got != 0 {
		t.Fatalf("SQLインジェクションが成立しなかった(脆弱性が想定通り再現できていない): got %d favorites remaining, want 0", got)
	}
}

func TestFindFavoriteUnscopedByFavOrUnfavRegistry_SQLInjectionSucceeds(t *testing.T) {
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

	if got.MovieUrl != victim.MovieUrl {
		t.Fatalf("SQLインジェクションが成立しなかった(脆弱性が想定通り再現できていない): got movie_url=%q, want %q", got.MovieUrl, victim.MovieUrl)
	}
}
