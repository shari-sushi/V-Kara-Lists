package common

import (
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func AddIsFavToMovieWithFav(mosWithFavCnts []domain.TransmitMovie, myFavs []domain.Favorite) []domain.TransmitMovie {
	var transmitData []domain.TransmitMovie
	for _, moWithFavCnt := range mosWithFavCnts {
		isFav := returnIsFavEachMovieUrl(myFavs, moWithFavCnt.Movie.MovieUrl)
		movieWithLikeCnt := domain.TransmitMovie{
			VtuberId: moWithFavCnt.VtuberId,
			Vtuber:   moWithFavCnt.Vtuber,
			MovieUrl: moWithFavCnt.MovieUrl,
			Movie:    moWithFavCnt.Movie,
			Count:    moWithFavCnt.Count,
			IsFav:    isFav,
		}
		transmitData = append(transmitData, movieWithLikeCnt)
	}
	return transmitData
}

func returnIsFavEachMovieUrl(myFavs []domain.Favorite, movieUrl string) bool {
	for _, myFav := range myFavs {
		if myFav.MovieUrl == movieUrl {
			return true
		}
	}
	return false
}

func AddIsFavToKaraokeWithFav(kasWithFavCnts []domain.TransmitKaraoke, myFavs []domain.Favorite) []domain.TransmitKaraoke {
	var transmitData []domain.TransmitKaraoke
	for _, kaWithFavCnt := range kasWithFavCnts {
		isFav := returnIsFavEachKaraokeIdByListenerId(myFavs, kaWithFavCnt.KaraokeId)
		karaokeWithLikeCnt := domain.TransmitKaraoke{
			VtuberId:  kaWithFavCnt.VtuberId,
			MovieUrl:  kaWithFavCnt.MovieUrl,
			KaraokeId: kaWithFavCnt.KaraokeId,
			Vtuber:    kaWithFavCnt.Vtuber,
			Movie:     kaWithFavCnt.Movie,
			Karaoke:   kaWithFavCnt.Karaoke,
			Count:     kaWithFavCnt.Count,
			IsFav:     isFav,
		}
		transmitData = append(transmitData, karaokeWithLikeCnt)
	}
	return transmitData
}

func returnIsFavEachKaraokeIdByListenerId(myFavs []domain.Favorite, KaraokeId domain.KaraokeId) bool {
	for _, myFav := range myFavs {
		if myFav.KaraokeId == KaraokeId {
			return true
		}
	}
	return false
}
