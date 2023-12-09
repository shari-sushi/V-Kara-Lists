package common

import (
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// 引数　[]movie、[]MoFavCnt....Movie+数字
// 戻り値 []MowithFav....送信用データ
func ReturnTransmitMovieData(vtubermovies []domain.VtuberMovie, moFavCnts []domain.MovieFavoriteCount) []domain.MovieFavoriteCount {
	// transmitData を作成
	var transmitData []domain.MovieFavoriteCount

	// 	{1, "imo"}, {2, "me"}, {3, "chumu"},
	// {1, 10}, {3, 100},
	for _, vtmo := range vtubermovies {
		favCnt := returnFavCntEachMovieUrl(vtmo.Movie.MovieUrl, moFavCnts)
		movieWithLikeCnt := domain.MovieFavoriteCount{
			Vtuber: vtmo.Vtuber,
			Movie:  vtmo.Movie,
			Count:  favCnt,
		}
		// fmt.Println("------------------------")
		// fmt.Println("toTransmitData: ", transmitData)
		// fmt.Println("movieWithLikeCnt: ", movieWithLikeCnt)
		transmitData = append(transmitData, movieWithLikeCnt)
	}
	fmt.Println("---")
	fmt.Println("toTransmitData", transmitData)
	return transmitData
}

// 1つのUrlに対して、[]{URL, like int}が来る
func returnFavCntEachMovieUrl(movieUrl string, favCnts []domain.MovieFavoriteCount) int {
	for _, favCnt := range favCnts {
		if favCnt.MovieUrl == movieUrl {
			return favCnt.Count
		}
	}
	return 0
}

func ReturnTransmitKaraokeData(VtMoKas []domain.VtuberMovieKaraoke, kaFavCnts []domain.KaraokeFavoriteCount) []domain.KaraokeFavoriteCount {
	// transmitData を作成
	var transmitData []domain.KaraokeFavoriteCount

	// 	{1, "imo"}, {2, "me"}, {3, "chumu"},
	// {1, 10}, {3, 100},
	for _, VtMoKa := range VtMoKas {
		favCnt := returnFavCntEachKaraokeId(VtMoKa.KaraokeListId, kaFavCnts)
		karaokeWithLikeCnt := domain.KaraokeFavoriteCount{
			Vtuber:      VtMoKa.Vtuber,
			Movie:       VtMoKa.Movie,
			KaraokeList: VtMoKa.KaraokeList,
			Count:       favCnt,
		}
		// fmt.Println("------------------------")
		// fmt.Println("toTransmitData: ", transmitData)
		// fmt.Println("movieWithLikeCnt: ", movieWithLikeCnt)
		transmitData = append(transmitData, karaokeWithLikeCnt)
	}
	fmt.Println("---")
	fmt.Println("toTransmitData", transmitData)
	return transmitData
}

// 1つのUrlに対して、[]{URL, like int}が来る
func returnFavCntEachKaraokeId(karaokeId domain.KaraokeListId, favCnts []domain.KaraokeFavoriteCount) int {
	for _, favCnt := range favCnts {
		if favCnt.KaraokeListId == karaokeId {
			return favCnt.Count
		}
	}
	return 0
}
