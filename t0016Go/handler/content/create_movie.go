package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
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
