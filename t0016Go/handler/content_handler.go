package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
	"github.com/sharin-sushi/0016go_next_relation/service"
)

type ContentHandler struct {
	ContentService  service.ContentService
	ActivityService service.ActivityService
}

func NewContentHandler(contentSvc service.ContentService, activitySvc service.ActivityService) *ContentHandler {
	return &ContentHandler{
		ContentService:  contentSvc,
		ActivityService: activitySvc,
	}
}

func (h *ContentHandler) GetJoinVtubersMoviesKaraokes(c *gin.Context) {
	VtsMosKasWithFav, err := h.ActivityService.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"resultStsのerror": err.Error()})
		return
	}
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"vtubers_movies_karaokes": VtsMosKasWithFav,
		})
		return
	}
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}
	transmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers_movies_karaokes": transmitKaraokes,
	})
}

func (h *ContentHandler) ReturnVtuberPageData(cont *gin.Context) {
	kana := cont.Param("kana")
	log.Println("kana", kana)
	var errs []error

	VtsMosKasWithFavofVtu, err := h.ActivityService.GetVtubersMoviesKaraokesByVtuberKanaWithFavCnts(kana)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}
	vtuberId := VtsMosKasWithFavofVtu[0].VtuberId
	MosOfVtu, err := h.ContentService.GetMoviesUrlTitleByVtuber(vtuberId)
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(cont) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)
		cont.JSON(http.StatusOK, gin.H{
			"vtubers_movies":          MosOfVtu,
			"vtubers_movies_karaokes": VtsMosKasWithFavofVtu,
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Print("err in FindFavoritesCreatedByListenerId	:", err)
	}

	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFavofVtu, myFav)

	cont.JSON(http.StatusOK, gin.H{
		"vtubers_movies":          MosOfVtu,
		"vtubers_movies_karaokes": TransmitKaraokes,
		"error":                   errs,
	})
}

func (h *ContentHandler) CreateVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var vtuber domain.Vtuber
	if err := c.ShouldBind(&vtuber); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	vtuber.VtuberInputterId = listenerId

	if err := h.ContentService.CreateVtuber(vtuber); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Vtuber",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Vtuber",
	})
}

func (h *ContentHandler) CreateMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var movie domain.Movie
	if err := c.ShouldBind(&movie); err != nil {
		log.Println("err: ShouldBind,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	movie.MovieInputterId = listenerId
	if err := h.ContentService.CreateMovie(movie); err != nil {
		log.Println("err: create movie,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Movie",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Movie",
	})
}

func (h *ContentHandler) CreateKaraokes(c *gin.Context) {
	var req api.CreateKaraokeSongsRequest
	if err := c.ShouldBind(&req); err != nil {
		log.Println("err: ShouldBind karaokes,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if len(req.Songs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Karaokes array is empty",
		})
		return
	}

	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err: jwt,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	if err := h.ContentService.CreateKaraokes(api.CreateKaraokeSongsRequestToKaraokes(req, listenerId)); err != nil {
		log.Println("err: create karaokes,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Karaokes",
		})
		return
	}

	log.Println("created karaokes by listenerId: ", listenerId)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered the New Karaokes",
	})
}

func (h *ContentHandler) EditVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
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
	vtuber.VtuberInputterId = listenerId
	if isAuth, err := h.ContentService.VerifyUserModifyVtuber(listenerId, vtuber); err != nil {
		log.Println("err:", err)
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

	if err := h.ContentService.UpdateVtuber(vtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}

func (h *ContentHandler) EditMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
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

	Movie.MovieInputterId = listenerId
	if isAuth, err := h.ContentService.VerifyUserModifyMovie(listenerId, Movie); err != nil {
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

	if err := h.ContentService.UpdateMovie(Movie); err != nil {
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

func (h *ContentHandler) EditKaraoke(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	var Karaoke domain.Karaoke
	if err := c.ShouldBind(&Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	Karaoke.KaraokeInputterId = listenerId
	if isAuth, err := h.ContentService.VerifyUserModifyKaraoke(listenerId, Karaoke); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return
	} else if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return
	} else {
		log.Printf("isAuth%v :\n", isAuth)
		if err := h.ContentService.UpdateKaraoke(Karaoke); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Inputter can modify each data",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Update",
	})
}

func (h *ContentHandler) DeleteOfPage(c *gin.Context) {
	var errs []error

	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := h.ActivityService.GetVtubersMoviesWithFavCnts()
	if err != nil {
		log.Print("err:", err)
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	createdVts, createdVtsMos, createdVtsMosKas, errs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
		errs = append(errs, err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"all_vtubers":                       allVts,
		"all_vtubers_movies":                VtsMosWithFav,
		"error":                             errs,
	})
}

func (h *ContentHandler) DeleteVtuber(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var selectedVtuber domain.Vtuber
	if err := c.ShouldBind(&selectedVtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if isAuth, err := h.ContentService.VerifyUserModifyVtuber(listenerId, selectedVtuber); err != nil {
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

	if err := h.ContentService.DeleteVtuber(selectedVtuber); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
			"error":   err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (h *ContentHandler) DeleteMovie(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}
	var Movie domain.Movie
	if err := c.ShouldBind(&Movie); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	if isAuth, err := h.ContentService.VerifyUserModifyMovie(listenerId, Movie); err != nil {
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

	if err := h.ContentService.DeleteMovie(Movie); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (h *ContentHandler) DeleteKaraoke(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return
	}

	var Karaoke domain.Karaoke
	if err := c.ShouldBind(&Karaoke); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	if isAuth, err := h.ContentService.VerifyUserModifyKaraoke(listenerId, Karaoke); err != nil {
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

	if err := h.ContentService.DeleteKaraoke(Karaoke); err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Delete",
	})
}

func (h *ContentHandler) ReturnTopPageData(c *gin.Context) {
	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosWithFav, err := h.ActivityService.GetVtubersMoviesWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}
	VtsMosKasWithFav, err := h.ActivityService.GetVtubersMoviesKaraokesWithFavCnts()
	if err != nil {
		errs = append(errs, err)
	}

	LatestVtsMosKasWithFav, err := h.ActivityService.GetLatest50VtubersMoviesKaraokesWithFavCnts(guestID)
	if err != nil {
		errs = append(errs, err)
	}

	listenerId, err := common.TakeListenerIdFromJWT(c) //非ログイン時でもデータは送付する
	if err != nil || listenerId == 0 {
		errs = append(errs, err)

		c.JSON(http.StatusOK, gin.H{
			"vtubers":                 common.EnsureSlice(allVts),
			"vtubers_movies":          common.EnsureSlice(VtsMosWithFav),
			"vtubers_movies_karaokes": common.EnsureSlice(VtsMosKasWithFav),
			"latest_karaokes":         common.EnsureSlice(LatestVtsMosKasWithFav),
			"error":                   errs,
			"message":                 "dont you Loged in ?",
		})
		return
	}

	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		log.Println("err:", err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(VtsMosWithFav, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(VtsMosKasWithFav, myFav)
	TransmitLatestKaraoes := common.AddIsFavToKaraokeWithFav(LatestVtsMosKasWithFav, myFav)

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 common.EnsureSlice(allVts),
		"vtubers_movies":          common.EnsureSlice(TransmitMovies),
		"vtubers_movies_karaokes": common.EnsureSlice(TransmitKaraokes),
		"latest_karaokes":         common.EnsureSlice(TransmitLatestKaraoes),
		"error":                   errs,
	})
}

func (h *ContentHandler) ReturnOriginalSongPage(c *gin.Context) {
	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	var VtsMosWithFav []domain.TransmitMovie
	var VtsMosKasWithFav []domain.TransmitKaraoke

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          VtsMosWithFav,
		"vtubers_movies_karaokes": VtsMosKasWithFav,
		"error":                   errs,
		"message":                 "dont you Loged in ?",
	})
}

// dropdown用
func (h *ContentHandler) GetVtuberMovieKaraoke(c *gin.Context) {
	var errs []error
	allVts, err := h.ContentService.GetVtubers()
	if err != nil {
		errs = append(errs, err)
	}
	allMos, err := h.ContentService.GetMovies()
	if err != nil {
		errs = append(errs, err)
	}
	allKas, err := h.ContentService.GetKaraokes()
	if err != nil {
		errs = append(errs, err)
	}
	if err != nil {
		log.Println("err:", err)
	}
	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          allMos,
		"vtubers_movies_karaokes": allKas,
		"error":                   errs,
	})
}

func (h *ContentHandler) ReturnDummyTopPage(c *gin.Context) {
	h.returnTestPage(c)
}

func (h *ContentHandler) returnTestPage(c *gin.Context) {
	var errs []error
	var allVts []domain.Vtuber
	var VtsMosWithFav []domain.TransmitMovie
	var VtsMosKasWithFav []domain.TransmitKaraoke

	allVts = []domain.Vtuber{
		{
			VtuberId:         530,
			VtuberName:       "api-app間の接続確認",
			VtuberKana:       "sucsessefuly_connect",
			IntroMovieUrl:    "",
			VtuberInputterId: 1,
		},
	}

	VtsMosWithFav = []domain.TransmitMovie{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       "サイト更新",
				VtuberKana:       "sucsessefuly_connect",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        530,
				MovieInputterId: 1,
			},
			Count: 530,
			IsFav: false,
		},
	}

	VtsMosKasWithFav = []domain.TransmitKaraoke{
		{
			VtuberId: 1,
			Vtuber: domain.Vtuber{
				VtuberName:       LastUpdateData,
				VtuberKana:       "",
				IntroMovieUrl:    "",
				VtuberInputterId: 1,
			},
			MovieUrl: "www.youtube.com/watch?v=4p1pIYBU61c",
			Movie: domain.Movie{
				MovieTitle:      "牙アピールかわいいおいも[新人vTuber妹望おいも]",
				VtuberId:        1,
				MovieInputterId: 1,
			},
			KaraokeId: 1,
			Karaoke: domain.Karaoke{
				SingStart:         "00:00:35",
				SongName:          "おいもの誕生日は0530(動画無関係)",
				KaraokeInputterId: 1,
			},
			Count: 100,
			IsFav: false,
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"vtubers":                 allVts,
		"vtubers_movies":          VtsMosWithFav,
		"vtubers_movies_karaokes": VtsMosKasWithFav,
		"error":                   errs,
		"message":                 "did u make it?",
	})
}
