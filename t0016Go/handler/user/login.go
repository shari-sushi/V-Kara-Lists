package user

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

const loginFailedMessage = "failed Login: Please confirm the Email&Password you entered"

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
	if err := common.ValidateLogin(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid validation",
			"error":   err.Error(),
		})
		return
	}

	emailAES, err := common.EncryptByAES(user.Email)
	if err != nil {
		fmt.Printf("err: LogIn EncryptByAES, %v\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed Login: bad system."})
		return
	}

	// 未登録とパスワード違いで応答(ステータス・本文・応答時間)を揃え、登録済みのメールアドレスを判定させない
	foundListener, err := h.UserService.FindUserByEmail(emailAES)
	listenerExists := err == nil
	if errors.Is(err, domain.ErrListenerNotFound) {
		foundListener.Password, err = common.DummyPasswordHash()
	}
	if err != nil {
		fmt.Printf("err: LogIn FindUserByEmail, %v\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed Login: bad system."})
		return
	}

	if err := common.CompareHashAndPassword(foundListener.Password, user.Password); err != nil || !listenerExists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": loginFailedMessage})
		return
	}

	if err := common.SetListenerIdIntoCookie(c, foundListener.ListenerId); err != nil {
		fmt.Printf("err: LogIn SetListenerIdIntoCookie, %v\n", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed Login: bad system."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Logged In",
	})
}
