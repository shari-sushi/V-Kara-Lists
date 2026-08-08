package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) CreateVideoSongs(c *gin.Context) {
	var req api.CreateVideoSongsRequest
	if err := c.ShouldBind(&req); err != nil {
		log.Println("err: ShouldBind video songs,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if len(req.Songs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Songs array is empty",
		})
		return
	}

	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	created, err := h.ContentService.CreateVideoSongs(api.CreateVideoSongsRequestToVideoSongs(req, listenerId))
	if err != nil {
		log.Println("err: create video songs,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New VideoSongs",
		})
		return
	}

	log.Println("created video songs by listenerId: ", listenerId)
	c.JSON(http.StatusOK, api.CreateVideoSongsResponse{VideoSongs: created})
}
