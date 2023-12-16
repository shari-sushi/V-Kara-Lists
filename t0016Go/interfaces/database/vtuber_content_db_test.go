package database

import (
	"reflect"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func TestVtuberContentRepository_GetVtubers(t *testing.T) {
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		want    []domain.Vtuber
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.GetVtubers()
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetVtubers() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetVtubers() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_GetMovies(t *testing.T) {
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		want    []domain.Movie
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.GetMovies()
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetMovies() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetMovies() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_GetKaraokes(t *testing.T) {
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		want    []domain.Karaoke
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.GetKaraokes()
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetKaraokes() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetKaraokes() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_GetVtubersMovies(t *testing.T) {
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		want    []domain.VtuberMovie
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.GetVtubersMovies()
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetVtubersMovies() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetVtubersMovies() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_GetVtubersMoviesKaraokes(t *testing.T) {
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		want    []domain.VtuberMovieKaraoke
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.GetVtubersMoviesKaraokes()
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetVtubersMoviesKaraokes() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetVtubersMoviesKaraokes() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_CreateVtuber(t *testing.T) {
	type args struct {
		V domain.Vtuber
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.CreateVtuber(tt.args.V); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.CreateVtuber() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_CreateMovie(t *testing.T) {
	type args struct {
		M domain.Movie
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.CreateMovie(tt.args.M); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.CreateMovie() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_CreateKaraoke(t *testing.T) {
	type args struct {
		K domain.Karaoke
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.CreateKaraoke(tt.args.K); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.CreateKaraoke() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_UpdateVtuber(t *testing.T) {
	type args struct {
		V domain.Vtuber
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.UpdateVtuber(tt.args.V); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.UpdateVtuber() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_UpdateMovie(t *testing.T) {
	type args struct {
		M domain.Movie
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.UpdateMovie(tt.args.M); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.UpdateMovie() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_UpdateKaraoke(t *testing.T) {
	type args struct {
		K domain.Karaoke
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.UpdateKaraoke(tt.args.K); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.UpdateKaraoke() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_DeleteVtuber(t *testing.T) {
	type args struct {
		V domain.Vtuber
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.DeleteVtuber(tt.args.V); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.DeleteVtuber() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_DeleteMovie(t *testing.T) {
	type args struct {
		M domain.Movie
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.DeleteMovie(tt.args.M); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.DeleteMovie() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_DeleteKaraoke(t *testing.T) {
	type args struct {
		K domain.Karaoke
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := tt.db.DeleteKaraoke(tt.args.K); (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.DeleteKaraoke() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestVtuberContentRepository_VerifyUserModifyVtuber(t *testing.T) {
	type args struct {
		id int
		V  domain.Vtuber
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		want    bool
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.VerifyUserModifyVtuber(tt.args.id, tt.args.V)
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.VerifyUserModifyVtuber() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("VtuberContentRepository.VerifyUserModifyVtuber() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_VerifyUserModifyMovie(t *testing.T) {
	type args struct {
		id int
		M  domain.Movie
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		want    bool
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.VerifyUserModifyMovie(tt.args.id, tt.args.M)
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.VerifyUserModifyMovie() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("VtuberContentRepository.VerifyUserModifyMovie() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_VerifyUserModifyKaraoke(t *testing.T) {
	type args struct {
		id int
		K  domain.Karaoke
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		want    bool
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.db.VerifyUserModifyKaraoke(tt.args.id, tt.args.K)
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.VerifyUserModifyKaraoke() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("VtuberContentRepository.VerifyUserModifyKaraoke() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestVtuberContentRepository_GetRecordsCreatedByThisListerId(t *testing.T) {
	type args struct {
		Lid domain.ListenerId
	}
	tests := []struct {
		name    string
		db      *VtuberContentRepository
		args    args
		want    []domain.Vtuber
		want1   []domain.VtuberMovie
		want2   []domain.VtuberMovieKaraoke
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1, got2, err := tt.db.GetRecordsCreatedByThisListerId(tt.args.Lid)
			if (err != nil) != tt.wantErr {
				t.Errorf("VtuberContentRepository.GetRecordsCreatedByThisListerId() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("VtuberContentRepository.GetRecordsCreatedByThisListerId() got = %v, want %v", got, tt.want)
			}
			if !reflect.DeepEqual(got1, tt.want1) {
				t.Errorf("VtuberContentRepository.GetRecordsCreatedByThisListerId() got1 = %v, want %v", got1, tt.want1)
			}
			if !reflect.DeepEqual(got2, tt.want2) {
				t.Errorf("VtuberContentRepository.GetRecordsCreatedByThisListerId() got2 = %v, want %v", got2, tt.want2)
			}
		})
	}
}
