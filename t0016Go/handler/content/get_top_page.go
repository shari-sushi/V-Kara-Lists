package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

var guestID = common.GetGuestListenerID()

// isDeveloping はtopページの4カテゴリ一覧UIがまだ「開発中」表示のみであることを示すフラグ。
// 一覧UIの作り込みが完了するまでtrue固定。
const isDeveloping = true

// ReturnTopPageData はtopページ用データを返す。
// DB再設計(#398)により歌枠・ライブ・オリ曲・歌ってみたの4カテゴリを videos/video_songs に統一したが、
// 対応するUIはまだ「開発中」表示のみで、一覧UIの作り込みは別issueで行う。
func (h *ContentHandler) ReturnTopPageData(c *gin.Context) {
	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsVsWithFav, err := h.ActivityService.GetVtubersVideosWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}
	VtsVsVssWithFav, err := h.ActivityService.GetVtubersVideosVideoSongsWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}

	LatestVtsVsVssWithFav, err := h.ActivityService.GetLatest50VtubersVideosVideoSongsWithFavCnts(guestID)
	if err != nil {
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)

		c.JSON(http.StatusOK, gin.H{
			"vtubers":             common.EnsureSlice(allVts),
			"vtubers_videos":      common.EnsureSlice(VtsVsWithFav),
			"vtubers_video_songs": common.EnsureSlice(VtsVsVssWithFav),
			"latest_video_songs":  common.EnsureSlice(LatestVtsVsVssWithFav),
			"is_developing":       isDeveloping,
			"error":               errs,
			"message":             "dont you Loged in ?",
		})
		return
	}

	myVideoFavs, err := h.ActivityService.FindFavoriteVideosCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
	}
	myVideoSongFavs, err := h.ActivityService.FindFavoriteVideoSongsCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
	}

	TransmitVideos := common.AddIsFavToVideoWithFav(VtsVsWithFav, myVideoFavs)
	TransmitVideoSongs := common.AddIsFavToVideoSongWithFav(VtsVsVssWithFav, myVideoSongFavs)
	TransmitLatestVideoSongs := common.AddIsFavToVideoSongWithFav(LatestVtsVsVssWithFav, myVideoSongFavs)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":             common.EnsureSlice(allVts),
		"vtubers_videos":      common.EnsureSlice(TransmitVideos),
		"vtubers_video_songs": common.EnsureSlice(TransmitVideoSongs),
		"latest_video_songs":  common.EnsureSlice(TransmitLatestVideoSongs),
		"is_developing":       isDeveloping,
		"error":               errs,
	})
}
