package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) CreateVtuber(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
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

	created, err := h.ContentService.CreateVtuber(vtuber)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed Registered the New Vtuber",
		})
		return
	}

	c.JSON(http.StatusOK, api.CreateVtuberResponse{Vtuber: created})
}
