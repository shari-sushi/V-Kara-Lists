package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func GuestLogIn(c *gin.Context) {
	common.SetListenerIdIntoCookie(c, guestID)
	fmt.Println("gestLogined", guestID)
	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Guest Logged In",
		"listenerName": "guest",
	})
}
