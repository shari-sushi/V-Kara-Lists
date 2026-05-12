package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) CreateKaraokes(c *gin.Context) {
	var req api.CreateKaraokeSongsRequest
	if err := c.ShouldBind(&req); err != nil {
		log.Println("err: ShouldBind karaokes,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if len(req.Songs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Karaokes array is empty",
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

	if err := h.ContentService.CreateKaraokes(api.CreateKaraokeSongsRequestToKaraokes(req, listenerId)); err != nil {
		log.Println("err: create karaokes,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Karaokes",
		})
		return
	}

	log.Println("created karaokes by listenerId: ", listenerId)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Karaokes",
	})
}
