package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers/common"
)

func (controller *Controller) ReturnTopPageData(c *gin.Context) {
	var errs []error
	allVts, err := controller.VtuberContentInteractor.GetAllVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWitFav, err := controller.FavoriteInteractor.GetVtubersMoviesWithFavCnts() //エラー発生
	if err != nil {
		fmt.Print("err:", err)
		errs = append(errs, err)
	}
	VtsMosKasWithFav, err := controller.FavoriteInteractor.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}

	applicantListenerId, err := common.TakeListenerIdFromJWT(c) //非ログイン時でも処理は続ける
	if err != nil || applicantListenerId == 0 {
		errs = append(errs, err)
		c.JSON(http.StatusOK, gin.H{
			"vtubers":                 allVts,
			"vtubers_movies":          VtsMosWitFav,
			"vtubers_movies_karaokes": VtsMosKasWithFav,
			// "error":   errs,
			"message": "dont you Loged in ?",
		})
		return
	}

	myFav, err := controller.FavoriteInteractor.FindFavsOfUser(applicantListenerId)
	TransmitMovies := common.AddIsFavToMovieWithFav(VtsMosWitFav, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          TransmitMovies,
		"vtubers_movies_karaokes": TransmitKaraokes,
		"error":                   errs,
	})
	return
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

func (controller *Controller) CreateMovieFavorite(c *gin.Context) {
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
	} else if fav.MovieUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Send Data(movie_url) is NULL",
		})
		return
	}
	fmt.Printf("1-1, fav= %v \n", fav)   //4
	fmt.Printf("1-2, &fav= %v \n", &fav) //4
	fav.ListenerId = applicantListenerId

	if err := controller.FavoriteInteractor.CreateMovieFavorite(fav); err != nil {
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
func (controller *Controller) DeleteMovieFavorite(c *gin.Context) {
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

	if err := controller.FavoriteInteractor.DeleteMovieFavorite(fav); err != nil {
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
func (controller *Controller) CreateKaraokeFavorite(c *gin.Context) {
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
	fmt.Println("fav", fav)
	if err := controller.FavoriteInteractor.CreateKaraokeFavorite(fav); err != nil {
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
func (controller *Controller) DeleteKaraokeFavorite(c *gin.Context) {
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
	if err := controller.FavoriteInteractor.DeleteKaraokeFavorite(fav); err != nil {
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
