package user

import (
	"github.com/sharin-sushi/0016go_next_relation/common"
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
