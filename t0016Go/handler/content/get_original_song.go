package content

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

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
