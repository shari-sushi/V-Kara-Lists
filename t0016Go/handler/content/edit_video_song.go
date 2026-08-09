package content

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) EditVideoSong(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
		return
	}

	var videoSong domain.VideoSong
	if err := c.ShouldBind(&videoSong); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	videoSong.InputterId = listenerId
	isAuth, err := h.ContentService.VerifyUserModifyVideoSong(listenerId, videoSong)
	if !requireAuthorizedInputter(c, isAuth, err) {
		return
	}

	updated, err := h.ContentService.UpdateVideoSong(videoSong)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, api.EditVideoSongResponse{VideoSong: updated})
}
