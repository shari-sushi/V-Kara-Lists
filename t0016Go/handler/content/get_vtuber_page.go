package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func (h *ContentHandler) ReturnVtuberPageData(cont *gin.Context) {
	kana := cont.Param("kana")
	log.Println("kana", kana)
	var errs []error

	VtsVsVssWithFavOfVtu, err := h.ActivityService.GetVtubersVideosVideoSongsByVtuberKanaWithFavCnts(kana)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}
	if len(VtsVsVssWithFavOfVtu) == 0 {
		cont.JSON(http.StatusOK, gin.H{
			"vtubers_videos":      []int{},
			"vtubers_video_songs": []int{},
			"error":               errs,
			"message":             "no data found for this vtuber",
		})
		return
	}
	vtuberId := VtsVsVssWithFavOfVtu[0].VtuberId
	VsOfVtu, err := h.ContentService.GetVideosByVtuber(vtuberId)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(cont) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)
		cont.JSON(http.StatusOK, gin.H{
			"vtubers_videos":      VsOfVtu,
			"vtubers_video_songs": VtsVsVssWithFavOfVtu,
			"error":               errs,
			"message":             "dont you Loged in ?",
		})
		return
	}
	myFav, err := h.ActivityService.FindFavoriteVideoSongsCreatedByListenerId(listenerId)
	if err != nil {
		log.Print("err in FindFavoriteVideoSongsCreatedByListenerId	:", err)
	}

	TransmitVideoSongs := common.AddIsFavToVideoSongWithFav(VtsVsVssWithFavOfVtu, myFav)

	cont.JSON(http.StatusOK, gin.H{
		"vtubers_videos":      VsOfVtu,
		"vtubers_video_songs": TransmitVideoSongs,
		"error":               errs,
	})
}
