package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

// ReturnDeletePageData は削除ページ用データを返す。
// 自分が登録したvtuber/video/video_songと、削除対象の選択に使う全vtuber・全videoを返す。
// #414 で削除された旧DeleteOfPageを新データモデルで復元したもの(#458)。
func (h *ContentHandler) ReturnDeletePageData(c *gin.Context) {
	// 自分の登録データを返すためログイン必須。未ログインは意味の正しい401を返す
	// (requireListenerIdは400を返すが、それは書き込み系の不正リクエスト扱いの流儀のため使わない)。
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Need Login"})
		return
	}

	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsVsWithFav, err := h.ActivityService.GetVtubersVideosWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}

	createdVts, createdVtsVs, createdVtsVsVss, findErrs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	errs = append(errs, findErrs...)

	myVideoFavs, err := h.ActivityService.FindFavoriteVideosCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}
	myVideoSongFavs, err := h.ActivityService.FindFavoriteVideoSongsCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}
	if len(errs) > 0 {
		log.Println("errs:", errs)
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":             common.EnsureSlice(createdVts),
		"vtubers_videos_u_created":      common.EnsureSlice(common.AddIsFavToVideoWithFav(createdVtsVs, myVideoFavs)),
		"vtubers_video_songs_u_created": common.EnsureSlice(common.AddIsFavToVideoSongWithFav(createdVtsVsVss, myVideoSongFavs)),
		"all_vtubers":                   common.EnsureSlice(allVts),
		"all_vtubers_videos":            common.EnsureSlice(VtsVsWithFav),
		"error":                         errs,
	})
}
