package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func Logout(c *gin.Context) {
	common.UnsetAuthCookie(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn",
	})
}
