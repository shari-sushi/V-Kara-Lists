package content

import (
	"github.com/sharin-sushi/0016go_next_relation/service"
)

type ContentHandler struct {
	ContentService  service.ContentService
	ActivityService service.ActivityService
}

func NewContentHandler(contentSvc service.ContentService, activitySvc service.ActivityService) *ContentHandler {
	return &ContentHandler{
		ContentService:  contentSvc,
		ActivityService: activitySvc,
	}
}
