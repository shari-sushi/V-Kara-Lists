package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func (h *UserHandler) ListenerPage(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	var errs []error
	createdVts, createdVtsMos, createdVtsMosKas, errs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"error":                             errs,
	})
}
