package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/service"
	"gorm.io/gorm"
)

type FavoriteHandler struct {
	ActivityService service.ActivityService
}

func NewFavoriteHandler(activitySvc service.ActivityService) *FavoriteHandler {
	return &FavoriteHandler{
		ActivityService: activitySvc,
	}
}

func (h *FavoriteHandler) SaveMovieFavorite(c *gin.Context) {
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
	foundFav := h.ActivityService.FindFavoriteUnscopedByFavOrUnfavRegistry(fav)
	zeroValue := gorm.DeletedAt{}
	if foundFav.ID == 0 {
		err := h.ActivityService.CreateMovieFavorite(foundFav)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invailed Favorite it",
			})
			return
		}
	} else if foundFav.DeletedAt != zeroValue {
		err := h.ActivityService.UpdateMovieFavorite(foundFav)
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

func (h *FavoriteHandler) DeleteKaraokeFavorite(c *gin.Context) {
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
	if err := h.ActivityService.DeleteKaraokeFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
}
