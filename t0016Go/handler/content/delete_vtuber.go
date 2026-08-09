package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) DeleteVtuber(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
		return
	}
	var selectedVtuber domain.Vtuber
	if err := c.ShouldBind(&selectedVtuber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	isAuth, err := h.ContentService.VerifyUserModifyVtuber(listenerId, selectedVtuber)
	if !requireAuthorizedInputter(c, isAuth, err) {
		return
	}

	deleted, err := h.ContentService.DeleteVtuber(selectedVtuber)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only Inputter can modify each data",
			"error":   err,
		})
		return
	}

	c.JSON(http.StatusOK, api.DeleteVtuberResponse{Vtuber: deleted})
}
