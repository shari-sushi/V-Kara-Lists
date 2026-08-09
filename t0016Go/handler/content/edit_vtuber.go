package content

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/domain/api"
)

func (h *ContentHandler) EditVtuber(c *gin.Context) {
	listenerId, ok := requireListenerId(c)
	if !ok {
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
	isAuth, err := h.ContentService.VerifyUserModifyVtuber(listenerId, vtuber)
	if !requireAuthorizedInputter(c, isAuth, err) {
		return
	}

	updated, err := h.ContentService.UpdateVtuber(vtuber)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Inputter can modify each data",
		})
		return
	}

	c.JSON(http.StatusOK, api.EditVtuberResponse{Vtuber: updated})
}
