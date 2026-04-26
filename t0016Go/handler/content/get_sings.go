package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func (h *ContentHandler) GetJoinVtubersMoviesKaraokes(c *gin.Context) {
	VtsMosKasWithFav, err := h.ActivityService.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": err.Error()})
		return
	}
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"vtubers_movies_karaokes": VtsMosKasWithFav,
		})
		return
	}
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}
	transmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers_movies_karaokes": transmitKaraokes,
	})
}
