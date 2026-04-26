package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func (h *ContentHandler) DeleteOfPage(c *gin.Context) {
	var errs []error

	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := h.ActivityService.GetVtubersMoviesWithFavCnts()
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	createdVts, createdVtsMos, createdVtsMosKas, errs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
		errs = append(errs, err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"all_vtubers":                       allVts,
		"all_vtubers_movies":                VtsMosWithFav,
		"error":                             errs,
	})
}
