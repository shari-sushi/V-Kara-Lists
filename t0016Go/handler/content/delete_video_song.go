package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *ContentHandler) DeleteVideoSong(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
		return
	}

	var videoSong domain.VideoSong
	if err := c.ShouldBind(&videoSong); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	isAuth, err := h.ContentService.VerifyUserModifyVideoSong(listenerId, videoSong)
	if !requireAuthorizedInputter(c, isAuth, err) {
		return
	}

	if err := h.ContentService.DeleteVideoSong(videoSong); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}
