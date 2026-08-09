package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *ContentHandler) EditVideo(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
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
	if isAuth, err := h.ContentService.VerifyUserModifyVideo(listenerId, video); err != nil {
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

	if err := h.ContentService.UpdateVideo(video); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}
