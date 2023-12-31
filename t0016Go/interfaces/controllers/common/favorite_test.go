package common

import (
	"reflect"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func TestAddIsFavToMovieWithFav(t *testing.T) {
	type args struct {
		mosWithFavCnts []domain.TransmitMovie
		myFavs         []domain.ReceivedFavorite
	}
	cases := map[string]struct {
		args args
		want []domain.TransmitMovie
	}{
		"成功IsFav:true, false": {
			args: args{
				mosWithFavCnts: []domain.TransmitMovie{
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Count: 1},
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, Movie: domain.Movie{MovieUrl: "url2"}, Count: 2},
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, Movie: domain.Movie{MovieUrl: "url3"}, Count: 3}},
				myFavs: []domain.ReceivedFavorite{
					{MovieUrl: "url1"},
					{MovieUrl: "url3"},
				},
			},
			want: []domain.TransmitMovie{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Count: 1, IsFav: true},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, Movie: domain.Movie{MovieUrl: "url2"}, Count: 2, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, Movie: domain.Movie{MovieUrl: "url3"}, Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToMovieWithFav(tt.args.mosWithFavCnts, tt.args.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("AddIsFavToMovieWithFav() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAddIsFavToKaraokeWithFav(t *testing.T) {
	type args struct {
		kasWithFavCnts []domain.TransmitKaraoke
		myFavs         []domain.ReceivedFavorite
	}
	cases := map[string]struct {
		name string
		args args
		want []domain.TransmitKaraoke
	}{
		"成功IsFav:true, false": {
			args: args{
				kasWithFavCnts: []domain.TransmitKaraoke{
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Karaoke: domain.Karaoke{KaraokeId: 10}, Count: 1},
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Karaoke: domain.Karaoke{KaraokeId: 11}, Count: 11},
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, Movie: domain.Movie{MovieUrl: "url2"}, Karaoke: domain.Karaoke{KaraokeId: 20}, Count: 2},
					{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, Movie: domain.Movie{MovieUrl: "url3"}, Karaoke: domain.Karaoke{KaraokeId: 30}, Count: 3}},
				myFavs: []domain.ReceivedFavorite{
					{KaraokeId: 10},
					{KaraokeId: 30},
				},
			},
			want: []domain.TransmitKaraoke{
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Karaoke: domain.Karaoke{KaraokeId: 10}, Count: 1, IsFav: true},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber1"}, Movie: domain.Movie{MovieUrl: "url1"}, Karaoke: domain.Karaoke{KaraokeId: 11}, Count: 11, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber2"}, Movie: domain.Movie{MovieUrl: "url2"}, Karaoke: domain.Karaoke{KaraokeId: 20}, Count: 2, IsFav: false},
				{Vtuber: domain.Vtuber{VtuberName: "Vtuber3"}, Movie: domain.Movie{MovieUrl: "url3"}, Karaoke: domain.Karaoke{KaraokeId: 30}, Count: 3, IsFav: true},
			},
		},
	}
	for name, tt := range cases {
		t.Run(name, func(t *testing.T) {
			if got := AddIsFavToKaraokeWithFav(tt.args.kasWithFavCnts, tt.args.myFavs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("AddIsFavToKaraokeWithFav() = %v, want %v", got, tt.want)
			}
		})
	}
}
