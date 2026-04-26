package other

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/service"
)

type OtherHandler struct {
	OtherService service.OtherService
}

func NewOtherHandler(otherSvc service.OtherService) *OtherHandler {
	return &OtherHandler{
		OtherService: otherSvc,
	}
}

func (h *OtherHandler) ExecRawQuery(c *gin.Context) {
	query := "テスト時にここに直接書き込む"
	err := h.OtherService.ExecRawQuery(query)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error at ExecRawQuery",
		})
		return
	}
}
