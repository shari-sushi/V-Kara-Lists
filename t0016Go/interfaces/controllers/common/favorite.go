package common

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func AddIsFavToMovieWithFav(mosWithFavCnts []domain.TransmitMovie, myFavs []domain.Favorite) []domain.TransmitMovie {
	// MovieData を作成
	var transmitData []domain.TransmitMovie
	for _, moWithFavCnt := range mosWithFavCnts {
		isFav := returnIsFavEachMovieUrl(myFavs, moWithFavCnt.Movie.MovieUrl)
		movieWithLikeCnt := domain.TransmitMovie{
			Vtuber: moWithFavCnt.Vtuber,
			Movie:  moWithFavCnt.Movie,
			Count:  moWithFavCnt.Count,
			IsFav:  isFav,
		}
		transmitData = append(transmitData, movieWithLikeCnt)
	}
	fmt.Println("---")
	fmt.Println("toTransmitData", transmitData)
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
	// MovieData を作成
	var transmitData []domain.TransmitKaraoke
	for _, kaWithFavCnt := range kasWithFavCnts {
		isFav := returnIsFavEachKaraokeIdByListenerId(myFavs, kaWithFavCnt.KaraokeId)
		karaokeWithLikeCnt := domain.TransmitKaraoke{
			Vtuber:  kaWithFavCnt.Vtuber,
			Movie:   kaWithFavCnt.Movie,
			Karaoke: kaWithFavCnt.Karaoke,
			Count:   kaWithFavCnt.Count,
			IsFav:   isFav,
		}
		transmitData = append(transmitData, karaokeWithLikeCnt)
	}
	fmt.Println("---")
	fmt.Println("toTransmitData", transmitData)
	return transmitData
}

// 書きかけ
func returnIsFavEachKaraokeIdByListenerId(myFavs []domain.Favorite, KaraokeId domain.KaraokeId) bool {
	for _, myFav := range myFavs {
		if myFav.KaraokeId == KaraokeId { //要検討
			return true
		}
	}
	return false
}

// func AddIsFavToKaraokeWithFav(( []domain.TransmitKaraoke, []domain.Favorite)) []domain.TransmitKaraoke {
// 	// transmitData を作成
// 	var transmitData []domain.TransmitKaraoke

// 	// 	{1, "imo"}, {2, "me"}, {3, "chumu"},
// 	// {1, 10}, {3, 100},
// 	for _, VtMoKa := range convertedKas {
// 		favCnt := returnFavCntEachKaraokeId(VtMoKa.KaraokeId, karaokeFavCnt)
// 		karaokeWithLikeCnt := domain.TransmitKaraoke{
// 			Vtuber:  VtMoKa.Vtuber,
// 			Movie:   VtMoKa.Movie,
// 			Karaoke: VtMoKa.Karaoke,
// 			Count:   favCnt,
// 		}
// 		// fmt.Println("------------------------")
// 		// fmt.Println("toTransmitData: ", transmitData)
// 		// fmt.Println("movieWithLikeCnt: ", movieWithLikeCnt)
// 		transmitData = append(transmitData, karaokeWithLikeCnt)
// 	}
// 	fmt.Println("---")
// 	fmt.Println("toTransmitData", transmitData)
// 	return transmitData
// }
