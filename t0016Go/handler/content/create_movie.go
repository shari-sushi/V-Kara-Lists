package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

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

	if movie.VtuberId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "VtuberId is required",
		})
		return
	}

	movie.MovieInputterId = listenerId
	created, err := h.ContentService.CreateMovie(movie)
	if err != nil {
		log.Println("err: create movie,", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Movie",
		})
		return
	}

	c.JSON(http.StatusOK, api.CreateMovieResponse{Movie: created})
}
