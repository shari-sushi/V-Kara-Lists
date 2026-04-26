package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func (h *UserHandler) CreateUser(c *gin.Context) {
	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed request body",
			"error":   err.Error(),
		})
		return
	}
	if err := common.ValidateSignup(&user); err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invailed validation",
			"error":   err.Error(),
		})
		return
	}

	emailAES, err := common.EncryptByAES(user.Email)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed encrypt email by AES",
			"error":   err.Error(),
		})
		return
	}

	if _, err := h.UserService.FindUserByEmail(emailAES); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "E-mail address already exist",
		})
		return
	}
	hashPW, err := common.EncryptPassword(user.Password)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed generate hassed Password",
			"error":   err.Error(),
		})
		return
	}

	user.Password = hashPW
	user.Email = emailAES
	newUser, err := h.UserService.CreateUser(user)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Singed Up",
			"error":   err.Error(),
		})
		return
	}

	if err := common.SetListenerIdIntoCookie(c, newUser.ListenerId); err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "the E-mail address already in use",
			"error":   err.Error(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully created user, and logined",
	})
}
