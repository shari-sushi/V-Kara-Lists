package content

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// 手動でmerge, buildしてる限りは、apiをbuildし直す日時をメモする（たまに忘れる）
// 曲名１文字対応、等
const LastUpdateData = "2024/01/14 3時 fix:歌複数登録要のapiを追加"

func (h *ContentHandler) ReturnDummyTopPage(c *gin.Context) {
	h.returnTestPage(c)
}

func (h *ContentHandler) returnTestPage(c *gin.Context) {
	var errs []error
	var allVts []domain.Vtuber
	var VtsMosWithFav []domain.TransmitMovie
	var VtsMosKasWithFav []domain.TransmitKaraoke

	allVts = []domain.Vtuber{
		{
			VtuberId:         530,
			VtuberName:       "api-app間の接続確認",
			VtuberKana:       "sucsessefuly_connect",
			IntroMovieUrl:    "",
			VtuberInputterId: 1,
		},
	}

	VtsMosWithFav = []domain.TransmitMovie{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       "サイト更新",
				VtuberKana:       "sucsessefuly_connect",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        530,
				MovieInputterId: 1,
			},
			Count: 530,
			IsFav: false,
		},
	}

	VtsMosKasWithFav = []domain.TransmitKaraoke{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       LastUpdateData,
				VtuberKana:       "",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        1,
				MovieInputterId: 1,
			},
			KaraokeId: 1,
			Karaoke: domain.Karaoke{
				SingStart:         "00:00:35",
				SongName:          "おいもの誕生日は0530(動画無関係)",
				KaraokeInputterId: 1,
			},
			Count: 100,
			IsFav: false,
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          VtsMosWithFav,
		"vtubers_movies_karaokes": VtsMosKasWithFav,
		"error":                   errs,
		"message":                 "did u make it?",
	})
}
