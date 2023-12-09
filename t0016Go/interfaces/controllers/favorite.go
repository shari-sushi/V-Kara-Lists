package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers/common"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"
	"github.com/sharin-sushi/0016go_next_relation/useCase"
)

type FavoriteController struct {
	Interactor useCase.FavoriteInteractor
}

func NewFavoriteController(sqlHandler database.SqlHandler) *FavoriteController {
	return &FavoriteController{
		Interactor: useCase.FavoriteInteractor{
			FavoriteRepository: &database.FavoriteRepository{
				SqlHandler: sqlHandler, //SqlHandller.Conn に *gorm,DBを持たせてる
			},
		},
	}
}

func a(c *gin.Context) {
	tokenLId, err := common.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId == guest.ListenerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Guest Acc. must NOT Withdrawal",
		})
		return
	}
	// controller.Interactor.
}

func (controller *FavoriteController) CreateMovieFavorite(c *gin.Context) {
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
	}
	fmt.Printf("1-1, fav= %v \n", fav) //4
	fav.ListenerId = applicantListenerId

	if err := controller.Interactor.CreateMovieFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Favorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
	return
}
func (controller *FavoriteController) DeleteMovieFavorite(c *gin.Context) {
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
	}
	fmt.Printf("1-1, fav= %v \n", fav) //4
	fav.ListenerId = applicantListenerId

	if err := controller.Interactor.DeleteMovieFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
	return
}
func (controller *FavoriteController) CreateKaraokeFavorite(c *gin.Context) {
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
	}
	fav.ListenerId = applicantListenerId
	if err := controller.Interactor.CreateKaraokeFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Favorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Favorite it",
	})
	return
}
func (controller *FavoriteController) DeleteKaraokeFavorite(c *gin.Context) {
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
	}
	fav.ListenerId = applicantListenerId
	if err := controller.Interactor.DeleteKaraokeFavorite(fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed UnFavorite it",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully UnFavorite it",
	})
	return
}
