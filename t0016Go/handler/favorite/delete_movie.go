package favorite

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *FavoriteHandler) DeleteMovieFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
	}
	var fav domain.Favorite
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.KaraokeId != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "/favrite/movie Get Fav Karaoke",
		})
		return
	} else if fav.MovieUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data(movie_url) is NULL",
		})
		return
	}
	fav.ListenerId = applicantListenerId

	if err := h.ActivityService.DeleteMovieFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
}
