package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

var guestID = common.GetGuestListenerID()

func (h *ContentHandler) ReturnTopPageData(c *gin.Context) {
	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := h.ActivityService.GetVtubersMoviesWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosKasWithFav, err := h.ActivityService.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}

	LatestVtsMosKasWithFav, err := h.ActivityService.GetLatest50VtubersMoviesKaraokesWithFavCnts(guestID)
	if err != nil {
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)

		c.JSON(http.StatusOK, gin.H{
			"vtubers":                 common.EnsureSlice(allVts),
			"vtubers_movies":          common.EnsureSlice(VtsMosWithFav),
			"vtubers_movies_karaokes": common.EnsureSlice(VtsMosKasWithFav),
			"latest_karaokes":         common.EnsureSlice(LatestVtsMosKasWithFav),
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}

	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(VtsMosWithFav, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)
	TransmitLatestKaraoes := common.AddIsFavToKaraokeWithFav(LatestVtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 common.EnsureSlice(allVts),
		"vtubers_movies":          common.EnsureSlice(TransmitMovies),
		"vtubers_movies_karaokes": common.EnsureSlice(TransmitKaraokes),
		"latest_karaokes":         common.EnsureSlice(TransmitLatestKaraoes),
		"error":                   errs,
	})
}
