package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/service"
)

var guestID = common.GetGuestListenerID()

type UserHandler struct {
	UserService     service.UserService
	ActivityService service.ActivityService
}

func NewUserHandler(userSvc service.UserService, activitySvc service.ActivityService) *UserHandler {
	return &UserHandler{
		UserService:     userSvc,
		ActivityService: activitySvc,
	}
}

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

func (h *UserHandler) LogicalDeleteUser(c *gin.Context) {
	tokenLId, err := common.TakeListenerIdFromJWT(c)
	fmt.Printf("tokenLId = %v \n", tokenLId)

	if err != nil {
		fmt.Printf("err:LogicalDeleteUser TakeListenerIdFromJWT, %v\n", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ListenerId of token",
			"err":     err,
		})
		return
	} else if tokenLId == guestID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Guest Acc. must NOT Withdrawal",
		})
		return
	}
	var dummyLi domain.Listener
	dummyLi.ListenerId = tokenLId
	if err := h.UserService.LogicalDeleteUser(dummyLi); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Withdrawn",
			"err":     err,
		})
		return
	}

	c.SetCookie("auth-token", "none", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn. You can restore ur acc. within 60 days.",
	})
}

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

func Logout(c *gin.Context) {
	common.UnsetAuthCookie(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Withdrawn",
	})
}

func GuestLogIn(c *gin.Context) {
	common.SetListenerIdIntoCookie(c, guestID)
	fmt.Println("gestLogined", guestID)
	c.JSON(http.StatusOK, gin.H{
		"message":      "Successfully Guest Logged In",
		"listenerName": "guest",
	})
}

func (h *UserHandler) GetListenerProfile(c *gin.Context) {
	ListenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}

	ListenerInfo, err := h.UserService.FindUserByListenerId(ListenerId)
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

func (h *UserHandler) ListenerPage(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	var errs []error
	createdVts, createdVtsMos, createdVtsMosKas, errs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	myFav, err := h.ActivityService.FindFavoritesCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}

	TransmitMovies := common.AddIsFavToMovieWithFav(createdVtsMos, myFav)
	TransmitKaraokes := common.AddIsFavToKaraokeWithFav(createdVtsMosKas, myFav)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":                 createdVts,
		"vtubers_movies_u_created":          TransmitMovies,
		"vtubers_movies_karaokes_u_created": TransmitKaraokes,
		"error":                             errs,
	})
}
