package user

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
)

func (h *UserHandler) ListenerPage(c *gin.Context) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		fmt.Println("err.Error:", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Need Login"})
		return
	}
	var errs []error
	createdVts, createdVtsVs, createdVtsVsVss, errs := h.ActivityService.FindEachRecordsCreatedByListenerId(listenerId)
	myVideoFavs, err := h.ActivityService.FindFavoriteVideosCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}
	myVideoSongFavs, err := h.ActivityService.FindFavoriteVideoSongsCreatedByListenerId(listenerId)
	if err != nil {
		errs = append(errs, err)
	}

	TransmitVideos := common.AddIsFavToVideoWithFav(createdVtsVs, myVideoFavs)
	TransmitVideoSongs := common.AddIsFavToVideoSongWithFav(createdVtsVsVss, myVideoSongFavs)
	c.JSON(http.StatusOK, gin.H{
		"vtubers_u_created":             createdVts,
		"vtubers_videos_u_created":      TransmitVideos,
		"vtubers_video_songs_u_created": TransmitVideoSongs,
		"error":                         errs,
	})
}
