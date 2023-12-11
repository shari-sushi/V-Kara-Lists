package common

import "github.com/sharin-sushi/0016go_next_relation/domain"

func ConvertMoviesTotransmitMovies(vms []domain.VtuberMovie) []domain.TransmitMovie {
	var TmMos []domain.TransmitMovie
	for _, vm := range vms {
		var TmMo = domain.TransmitMovie{
			Vtuber: vm.Vtuber,
			Movie:  vm.Movie,
			Count:  0,
			IsFav:  false,
		}
		TmMos = append(TmMos, TmMo)
	}
	return TmMos
}

func ConvertKaraokesTotransmitKaraokes(vmks []domain.VtuberMovieKaraoke) []domain.TransmitKaraoke {
	var TmKas []domain.TransmitKaraoke
	for _, vmk := range vmks {
		var TmKa = domain.TransmitKaraoke{
			Vtuber:  vmk.Vtuber,
			Movie:   vmk.Movie,
			Karaoke: vmk.Karaoke,
			Count:   0,
			IsFav:   false,
		}
		TmKas = append(TmKas, TmKa)
	}
	return TmKas
}
