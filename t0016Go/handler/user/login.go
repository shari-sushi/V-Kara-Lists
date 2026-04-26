package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *UserHandler) LogIn(c *gin.Context) {
	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		fmt.Printf("err: LogIn ShouldBind, %v\n", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	emailAES, err := common.EncryptByAES(user.Email)
	if err != nil {
		fmt.Printf("err:, LogIn EncryptByAES%v\n", err.Error())
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "failed encrypt email",
			"error":   err.Error(),
		})
		return
	}
	fmt.Printf("emailAES:%v\n", emailAES)

	foundListener, err := h.UserService.FindUserByEmail(emailAES)
	fmt.Printf("Listener Logged in:%v\n", foundListener)
	if err != nil {
		fmt.Printf("err:LogIn FindUserByEmail, %v\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error fetching listener info",
			"error":   err.Error(),
		})
		return
	}

	if err := common.CompareHashAndPassword(foundListener.Password, string(user.Password)); err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Login: Please confirm the Email&Password you entered",
			"error":   err.Error(),
		})
		return
	}

	if err := common.SetListenerIdIntoCookie(c, foundListener.ListenerId); err != nil {
		fmt.Printf("err:, LogIn SetListenerIdintoCookie%v\n", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Login: failed set cookie. bad system.",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Logged In",
	})
}
