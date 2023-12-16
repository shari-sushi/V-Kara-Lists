package common

import (
	"database/sql"
	"testing"
	"time"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"gorm.io/gorm"
)

// type Listener struct {
//     ListenerId   ListenerId     `gorm:"type:int(11);primaryKey"`
//     ListenerName string         `gorm:"type:varchar(50);not null"`
//     Email        string         `gorm:"type:varchar(255);unique;not null"`
//     Password     string         `gorm:"type:varchar(100);not null"`
//     CreatedAt    time.Time      `gorm:"type:datetime;default:current_timestamp"`
//     UpdatedAt    sql.NullTime   `gorm:"type:datetime"`
//     DeletedAt    gorm.DeletedAt `gorm:"type:datetime;index:deleted_index"`
// }

var tim time.Time
var nTi sql.NullTime
var gDe gorm.DeletedAt

// func TestValidateSignup(t *testing.T) {
// 	type args struct {
// 		m *domain.Listener
// 	}
// 	tests := []struct {
// 		name    string
// 		args    args
// 		wantErr bool
// 	}{
// 		{"成功test", args{&domain.Listener{ListenerId: 0, ListenerName: "shari", Email: "shari@gmail.com", Password: "0000", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, false},
// 		{"失敗name_min", args{&domain.Listener{ListenerId: 0, ListenerName: "a", Email: "shari@gmail.com", Password: "0000", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, true},
// 		{"失敗name_max", args{&domain.Listener{ListenerId: 0, ListenerName: "0123456789abcdefghijk", Email: "shari@gmail.com", Password: "0000", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, true},
// 		{"失敗email_min", args{&domain.Listener{ListenerId: 0, ListenerName: "shari", Email: "abc@a.com", Password: "0000", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, true},
// 		{"失敗pass_min", args{&domain.Listener{ListenerId: 0, ListenerName: "shari", Email: "shari@gmail.com", Password: "0", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, true},
// 		{"失敗pass_max", args{&domain.Listener{ListenerId: 0, ListenerName: "shari", Email: "shari@gmail.com", Password: "0123456789abcdefghijk", CreatedAt: tim, UpdatedAt: nTi, DeletedAt: gDe}}, true},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			if err := ValidateSignup(tt.args.m); (err != nil) != tt.wantErr {
// 				t.Errorf("ValidateSignup() error = %v, wantErr %v", err, tt.wantErr)
// 			}
// 		})
// 	}
// }

func TestValidateSignup(t *testing.T) {
	type args struct {
		m *domain.Listener
	}
	tests := map[string]struct {
		args    args
		wantErr bool
	}{
		"成功test":      {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0000"}}, false},
		"失敗name_min":  {args{&domain.Listener{ListenerName: "a", Email: "shari@gmail.com", Password: "0000"}}, true},
		"失敗name_max":  {args{&domain.Listener{ListenerName: "0123456789abcdefghijk", Email: "shari@gmail.com", Password: "0000"}}, true},
		"失敗email_min": {args{&domain.Listener{ListenerName: "shari", Email: "abc@a.com", Password: "0000"}}, true},
		"失敗pass_min":  {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0"}}, true},
		"失敗pass_max":  {args{&domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: "0123456789abcdefghijk"}}, true},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			if err := ValidateSignup(tt.args.m); (err != nil) != tt.wantErr {
				t.Errorf("ValidateSignup() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
