package favorite

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *FavoriteHandler) SaveVideoFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	var fav domain.FavoriteVideo
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.VideoId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data(video_id) is 0",
		})
		return
	}
	fav.ListenerId = applicantListenerId

	if err := h.ActivityService.CreateVideoFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Favorite it",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
}
