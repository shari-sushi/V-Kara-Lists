package favorite

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/gorm"
)

func (h *FavoriteHandler) SaveKaraokeFavorite(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var fav domain.Favorite
	if err := c.ShouldBind(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	} else if fav.MovieUrl == "" || fav.KaraokeId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data has \"\" or 0",
		})
		return
	}
	fav.ListenerId = applicantListenerId
	foundFav := h.ActivityService.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	zeroValue := gorm.DeletedAt{}
	fmt.Println("fav", foundFav)
	fmt.Printf("foundFav:%v", foundFav)
	if foundFav.ID == 0 {
		err := h.ActivityService.CreateKaraokeFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else if foundFav.DeletedAt != zeroValue {
		err := h.ActivityService.UpdateKaraokeFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "Already Favorite it",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
}
