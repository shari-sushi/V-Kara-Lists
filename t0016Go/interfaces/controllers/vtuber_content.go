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

type VtuberContentController struct {
	Interactor     useCase.VtuberContentInteractor
	FavoInteractor useCase.FavoriteInteractor
}

func NewVtuberContentController(sqlHandler database.SqlHandler) *VtuberContentController {
	return &VtuberContentController{
		Interactor: useCase.VtuberContentInteractor{
			VtuberContentRepository: &database.VtuberContentRepository{
				SqlHandler: sqlHandler, //SqlHandller.Conn に *gorm,DBを持たせてる
			},
		},
	}
}

//////////////////////////////////////////////////////////////////
/////ここのメソッドと他のメソッドは不一致でok /////////////////////
////下層のメソッドをここのメソッド内で複数回試用できるはず/////////
///////////////////////////////////////////////////////////////

// []Vtuer, []VtuverMovie, []VtuberMovieKaraokeを返す。
// 今後、Like情報も返す必要ありそう。
func (controller *VtuberContentController) TopPageData(c *gin.Context) {
	var errs []error
	allVts, err := controller.Interactor.GetAllVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	allVtsMosWithoutFav, err := controller.Interactor.GetAllVtubersMovies()
	if err != nil {
		errs = append(errs, err)
	}
	allVtsMosKasWithoutFav, err := controller.Interactor.GetAllVtubersMoviesKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	movieFavCnt, err := controller.FavoInteractor.CountAllMovieFavorites()
	if err != nil {
		errs = append(errs, err)
	}
	karaokeFavCnt, err := controller.FavoInteractor.CountAllKaraokeFavorites()
	if err != nil {
		errs = append(errs, err)
	}
	allVtsMos := common.ReturnTransmitMovieData(allVtsMosWithoutFav, movieFavCnt)
	allVtsMosKas := common.ReturnTransmitKaraokeData(allVtsMosKasWithoutFav, karaokeFavCnt)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                         allVts,
		"vtubers_and_movies":              allVtsMos,
		"vtubers_and_movies_and_karaokes": allVtsMosKas,
		"error":                           errs,
	})
	return
}
func (controller *VtuberContentController) GetAllJoinVtubersMoviesKaraokes(c *gin.Context) {
	allVsMsKs, err := controller.Interactor.GetEssentialJoinVtubersMoviesKaraokes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"vtubers_and_movies_and_karaokes": allVsMsKs,
	})
	return
}
func (controller *VtuberContentController) CreateVtuber(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var vtuber domain.Vtuber
	if err := c.ShouldBind(&vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	vtuber.VtuberInputterId = &applicantListenerId

	if err := controller.Interactor.CreateVtuber(vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Vtuber",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Vtuber",
	})
	return
}

func (controller *VtuberContentController) CreateMovie(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var movie domain.Movie
	if err := c.ShouldBind(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("1-1:*値よな？ %v \n", *movie.VtuberId) //4
	movie.MovieInputterId = &applicantListenerId

	if err := controller.Interactor.CreateMovie(movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Movie",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Movie",
	})
	return
}
func (controller *VtuberContentController) CreateKaraokeSing(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var karaoke domain.KaraokeList
	if err := c.ShouldBind(&karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	karaoke.KaraokeListInputterId = &applicantListenerId
	if err := controller.Interactor.CreateKaraokeSing(karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New KaraokeSing",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New KaraokeSing",
	})
	return
}
func (controller *VtuberContentController) EditVtuber(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var vtuber domain.Vtuber
	if err := c.ShouldBind(&vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	vtuber.VtuberInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyVtuber(int(applicantListenerId), vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.UpdateVtuber(vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
	return
}
func (controller *VtuberContentController) EditMovie(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Movie domain.Movie
	if err := c.ShouldBind(&Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Movie.MovieInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyMovie(int(applicantListenerId), Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.UpdateMovie(Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
	return
}
func (controller *VtuberContentController) EditKaraokeSing(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Karaoke domain.KaraokeList
	if err := c.ShouldBind(&Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Karaoke.KaraokeListInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyKaraoke(int(applicantListenerId), Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.UpdateKaraokeSing(Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
	return
}
func (controller *VtuberContentController) DeleteVtuber(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Vtuber domain.Vtuber
	if err := c.ShouldBind(&Vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Vtuber.VtuberInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyVtuber(int(applicantListenerId), Vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.DeleteVtuber(Vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
	return
}

func (controller *VtuberContentController) DeleteMovie(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Movie domain.Movie
	if err := c.ShouldBind(&Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Movie.MovieInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyMovie(int(applicantListenerId), Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.DeleteMovie(Movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
	return
}

func (controller *VtuberContentController) DeleteKaraokeSing(c *gin.Context) {
	applicantListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Karaoke domain.KaraokeList
	if err := c.ShouldBind(&Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	Karaoke.KaraokeListInputterId = &applicantListenerId
	if isAuth, err := controller.Interactor.VerifyUserModifyKaraoke(int(applicantListenerId), Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if isAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	}
	if err := controller.Interactor.DeleteKaraokeSing(Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
	return
}

func (controller *VtuberContentController) ReadAllVtuverMovieKaraoke(c *gin.Context) {
	var errs []error
	allVts, err := controller.Interactor.GetAllVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	allMos, err := controller.Interactor.GetAllMovies()
	if err != nil {
		errs = append(errs, err)
	}
	allKas, err := controller.Interactor.GetAllKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	c.JSON(http.StatusOK, gin.H{
		"vtubers":                         allVts,
		"vtubers_and_movies":              allMos,
		"vtubers_and_movies_and_karaokes": allKas,
		"error":                           errs,
	})
}

func (controller *VtuberContentController) Enigma(c *gin.Context) {
	var errs []error
	allVts, err := controller.Interactor.GetAllVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	allMos, err := controller.Interactor.GetAllMovies()
	if err != nil {
		errs = append(errs, err)
	}
	allKas, err := controller.Interactor.GetAllKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	if err != nil {
		errs = append(errs, err)
	}
	allVtsMos, err := controller.Interactor.GetAllVtubersMovies()
	if err != nil {
		errs = append(errs, err)

	}

	allVtsMosKas, err := controller.Interactor.GetEssentialJoinVtubersMoviesKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	all, err := controller.Interactor.GetAllVtubersMoviesKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	c.JSON(http.StatusOK, gin.H{
		"vtubers":                         allVts,
		"movies":                          allMos,
		"karaokes":                        allKas,
		"vtubers_and_movies":              allVtsMos,
		"vtubers_and_movies_and_karaokes": allVtsMosKas,
		"all":                             all,
		"error":                           errs,
	})
}
