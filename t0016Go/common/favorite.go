package common

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func AddIsFavToVideoWithFav(vsWithFavCnts []domain.TransmitVideo, myFavs []domain.ReceivedFavoriteVideo) []domain.TransmitVideo {
	var transmitData []domain.TransmitVideo
	for _, vWithFavCnt := range vsWithFavCnts {
		isFav := returnIsFavEachVideoId(myFavs, vWithFavCnt.VideoId)
		videoWithLikeCnt := vWithFavCnt
		videoWithLikeCnt.IsFav = isFav
		transmitData = append(transmitData, videoWithLikeCnt)
	}
	return transmitData
}

func returnIsFavEachVideoId(myFavs []domain.ReceivedFavoriteVideo, videoId domain.VideoId) bool {
	for _, myFav := range myFavs {
		if myFav.VideoId == videoId {
			return true
		}
	}
	return false
}

func AddIsFavToVideoSongWithFav(vssWithFavCnts []domain.TransmitVideoSong, myFavs []domain.ReceivedFavoriteVideoSong) []domain.TransmitVideoSong {
	var transmitData []domain.TransmitVideoSong
	for _, vsWithFavCnt := range vssWithFavCnts {
		isFav := returnIsFavEachVideoSongId(myFavs, vsWithFavCnt.VideoSongId)
		videoSongWithLikeCnt := vsWithFavCnt
		videoSongWithLikeCnt.IsFav = isFav
		transmitData = append(transmitData, videoSongWithLikeCnt)
	}
	return transmitData
}

func returnIsFavEachVideoSongId(myFavs []domain.ReceivedFavoriteVideoSong, videoSongId domain.VideoSongId) bool {
	for _, myFav := range myFavs {
		if myFav.VideoSongId == videoSongId {
			return true
		}
	}
	return false
}
