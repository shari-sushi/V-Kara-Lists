package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) CreateVideo(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	var req api.CreateVideoRequest
	if err := c.ShouldBind(&req); err != nil {
		log.Println("err: ShouldBind,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if req.VtuberId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "VtuberId is required",
		})
		return
	}

	created, err := h.ContentService.CreateVideo(api.CreateVideoRequestToVideo(req, listenerId))
	if err != nil {
		log.Println("err: create video,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Video",
		})
		return
	}

	c.JSON(http.StatusOK, api.CreateVideoResponse{Video: created})
}
