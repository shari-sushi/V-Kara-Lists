package favorite

import (
	"github.com/sharin-sushi/0016go_next_relation/service"
)

type FavoriteHandler struct {
	ActivityService service.ActivityService
}

func NewFavoriteHandler(activitySvc service.ActivityService) *FavoriteHandler {
	return &FavoriteHandler{
		ActivityService: activitySvc,
	}
}
