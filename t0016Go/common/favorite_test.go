package common

import (
	"reflect"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func TestAddIsFavToVideoWithFav(t *testing.T) {
	cases := map[string]struct {
		vsWithFavCnts []domain.TransmitVideo
		myFavs        []domain.ReceivedFavoriteVideo
		want          []domain.TransmitVideo
	}{
		"成功IsFav:true, false": {
			vsWithFavCnts: []domain.TransmitVideo{
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, Count: 1},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber2", VideoId: 2}, Count: 2},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber3", VideoId: 3}, Count: 3},
			},
			myFavs: []domain.ReceivedFavoriteVideo{
				{VideoId: 1},
				{VideoId: 3},
			},
			want: []domain.TransmitVideo{
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, Count: 1, IsFav: true},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber2", VideoId: 2}, Count: 2, IsFav: false},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber3", VideoId: 3}, Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToVideoWithFav(tt.vsWithFavCnts, tt.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("\ngot = %v,\nwant %v", got, tt.want)
			}
		})
	}
}

func TestAddIsFavToVideoSongWithFav(t *testing.T) {

	cases := map[string]struct {
		vssWithFavCnts []domain.TransmitVideoSong
		myFavs         []domain.ReceivedFavoriteVideoSong
		want           []domain.TransmitVideoSong
	}{
		"成功IsFav:true, false": {
			vssWithFavCnts: []domain.TransmitVideoSong{
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, VideoSongId: 10, Count: 1},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, VideoSongId: 11, Count: 11},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber2", VideoId: 2}, VideoSongId: 20, Count: 2},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber3", VideoId: 3}, VideoSongId: 30, Count: 3},
			},
			myFavs: []domain.ReceivedFavoriteVideoSong{
				{VideoSongId: 10},
				{VideoSongId: 30},
			},
			want: []domain.TransmitVideoSong{
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, VideoSongId: 10, Count: 1, IsFav: true},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber1", VideoId: 1}, VideoSongId: 11, Count: 11, IsFav: false},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber2", VideoId: 2}, VideoSongId: 20, Count: 2, IsFav: false},
				{TransmitVtuberVideoBase: domain.TransmitVtuberVideoBase{VtuberName: "Vtuber3", VideoId: 3}, VideoSongId: 30, Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToVideoSongWithFav(tt.vssWithFavCnts, tt.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("\ngot = %v,\nwant %v", got, tt.want)
			}
		})
	}
}
