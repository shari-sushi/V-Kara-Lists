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

	VtsMosKasWithFavofVtu, err := h.ActivityService.GetVtubersMoviesKaraokesByVtuberKanaWithFavCnts(kana)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}
	vtuberId := VtsMosKasWithFavofVtu[0].VtuberId
	MosOfVtu, err := h.ContentService.GetMoviesUrlTitleByVtuber(vtuberId)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(cont) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)
		cont.JSON(http.StatusOK, gin.H{
			"vtubers_movies":          MosOfVtu,
			"vtubers_movies_karaokes": VtsMosKasWithFavofVtu,
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}

	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFavofVtu, myFav)

	cont.JSON(http.StatusOK, gin.H{
		"vtubers_movies":          MosOfVtu,
		"vtubers_movies_karaokes": TransmitKaraokes,
		"error":                   errs,
	})
}
