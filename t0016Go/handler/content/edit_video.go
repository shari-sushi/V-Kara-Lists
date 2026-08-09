package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) EditVideo(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
		return
	}

	var video domain.Video
	if err := c.ShouldBind(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	video.InputterId = listenerId
	isAuth, err := h.ContentService.VerifyUserModifyVideo(listenerId, video)
	if !requireAuthorizedInputter(c, isAuth, err) {
		return
	}

	updated, err := h.ContentService.UpdateVideo(video)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, api.EditVideoResponse{Video: updated})
}
