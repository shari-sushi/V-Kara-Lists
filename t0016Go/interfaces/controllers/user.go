package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/controllers/common"
	"github.com/sharin-sushi/0016go_next_relation/interfaces/database"
	"github.com/sharin-sushi/0016go_next_relation/useCase"
)

type UserController struct {
	Interactor useCase.UserInteractor
}

func NewUserController(sqlHandler database.SqlHandler) *UserController {
	return &UserController{
		Interactor: useCase.UserInteractor{
			UserRepository: &database.UserRepository{
				SqlHandler: sqlHandler, //SqlHandller.Conn に *gorm,DBを持たせてる
			},
		},
	}
}

var guest domain.Listener

func init() {
	guest.ListenerId = 2
}

func (controller *UserController) CreateUser(c *gin.Context) {
	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたuser = %v \n", user)

	if err := common.ValidateSignup(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	if _, err := controller.Interactor.FindUserByEmail(user.Email); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "error", //errがnilの時にリクエストを受理できないという処理で正しい。エラーどうしよう???
			"message": "the E-mail address already in use",
		})
		return
	}
	hashPW, err := common.EncryptPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed generate hassed Password",
		})
		return
	}
	user.Password = hashPW

	newUser, err := controller.Interactor.CreateUser(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Singed Up",
		})
		return
	}
	if err := common.SetListenerIdintoCookie(c, newUser.ListenerId); err != nil {

	}

	c.JSON(http.StatusOK, gin.H{
		// "memberId":   newMember.ListenerId,
		// "memberName": newMember.ListenerName,
		"message": "Successfully created user, and logined",
	})
	return
}

func (controller *UserController) LogicalDeleteUser(c *gin.Context) {
	tokenLId, err := common.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId == guest.ListenerId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Guest Acc. must NOT Withdrawal",
		})
		return
	}
	var dummyLi domain.Listener
	dummyLi.ListenerId = tokenLId
	if err := controller.Interactor.LogicalDeleteUser(dummyLi); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Withdrawn",
			"err":     err,
		})
		return
	}
	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn. You can restore  ur acc. within 60 days.",
	})
}

func (controller *UserController) LogIn(c *gin.Context) {
	var user domain.Listener
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}
	fmt.Printf("bindしたuser = %v \n", user)
	foundListener, err := controller.Interactor.FindUserByEmail(user.Email)
	fmt.Printf("foundListener=%v\n", foundListener)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching listener info"})
		return
	}

	if err := common.CompareHashAndPassword(foundListener.Password, string(user.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed Login: Please confirm the Email&Password you entered",
		})
		return
	}

	if err := common.SetListenerIdintoCookie(c, foundListener.ListenerId); err != nil {
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Logged In",
	})
	return
}

func Logout(c *gin.Context) {
	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn",
	})
}

func GuestLogIn(c *gin.Context) {
	var guestId domain.ListenerId = guest.ListenerId
	common.SetListenerIdintoCookie(c, guestId)
	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Guest Logged In",
		"listenerName": "guest",
	})
}

func (controller *UserController) GetListenerProfile(c *gin.Context) {
	ListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}

	ListenerInfo, err := controller.Interactor.FindUserByListenerId(ListenerId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching listener info"})
		return
	}

	fmt.Printf("ListenerInfo = %v \n", ListenerInfo)

	c.JSON(http.StatusOK, gin.H{
		"ListenerId":   ListenerInfo.ListenerId,
		"ListenerName": ListenerInfo.ListenerName,
		"CreatedAt":    ListenerInfo.CreatedAt,
		"UpdatedAt":    ListenerInfo.UpdatedAt,
		"Email":        "secret",
		"Password":     "secret",
		"message":      "got urself infomation",
	})
}

// ver? で実装する。要件はissueにて
// func (controller *UserController) RestoreUser(c *gin.Context) {
// 	var user domain.Listener
// 	if err := c.ShouldBind(&user); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "Invalid request body",
// 		})
// 		return
// 	}
// 	fmt.Printf("bindしたuser = %v \n", user)

// 	// deleted_atがnilでないものを探す処理にする必要がある。
// 	if _, err := controller.Interactor.FindUserByEmail(user.Email); err == nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error":   "error", //errがnilの時にリクエストを受理できないという処理で正しい。エラーどうしよう???
// 			"message": "the E-mail address already in use",
// 		})
// 		return
// 	}
// 	hashPW, err := common.EncryptPassword(user.Password)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "failed generate hassed Password",
// 		})
// 		return
// 	}
// 	user.Password = hashPW

// 	newUser, err := controller.Interactor.CreateUser(user)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "failed Singed Up",
// 		})
// 		return
// 	}
// 	if err := common.SetListenerIdintoCookie(c, newUser.ListenerId); err != nil {

// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		// "memberId":   newMember.ListenerId,
// 		// "memberName": newMember.ListenerName,
// 		"message": "Successfully created user, and logined",
// 	})
// 	return
// }
