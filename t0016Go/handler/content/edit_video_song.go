package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *ContentHandler) EditVideoSong(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
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
	if isAuth, err := h.ContentService.VerifyUserModifyVideoSong(listenerId, videoSong); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}

	if err := h.ContentService.UpdateVideoSong(videoSong); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}
