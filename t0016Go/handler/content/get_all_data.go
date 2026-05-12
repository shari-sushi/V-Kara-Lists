package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
