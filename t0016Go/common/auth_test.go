package common

import (
	"strings"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

func TestValidateSignup(t *testing.T) {
	newListener := func(password string) *domain.Listener {
		return &domain.Listener{ListenerName: "shari", Email: "shari@gmail.com", Password: password}
	}
	tests := map[string]struct {
		listener *domain.Listener
		wantErr  bool
	}{
		"成功test":         {newListener("password"), false},
		"失敗name_min":     {&domain.Listener{ListenerName: "a", Email: "shari@gmail.com", Password: "password"}, true},
		"失敗name_max":     {&domain.Listener{ListenerName: "0123456789abcdefghijk", Email: "shari@gmail.com", Password: "password"}, true},
		"失敗email_min":    {&domain.Listener{ListenerName: "shari", Email: "abc@a.com", Password: "password"}, true},
		"失敗pass_7文字":     {newListener("1234567"), true},
		"成功pass_8文字":     {newListener("12345678"), false},
		"成功pass_64文字":    {newListener(strings.Repeat("a", 64)), false},
		"失敗pass_65文字":    {newListener(strings.Repeat("a", 65)), true},
		"成功pass_記号とスペース": {newListener(" !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"), false},
		"失敗pass_マルチバイト":  {newListener("パスワードpassword"), true},
		"失敗pass_制御文字":    {newListener("pass\tword"), true},
		"失敗pass_NUL":     {newListener("pass\x00word"), true},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			if err := ValidateSignup(tt.listener); (err != nil) != tt.wantErr {
				t.Errorf("ValidateSignup() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateLogin(t *testing.T) {
	tests := map[string]struct {
		password string
		wantErr  bool
	}{
		"失敗pass_空":     {"", true},
		"失敗pass_3文字":   {"123", true},
		"成功pass_4文字":   {"1234", false},
		"成功pass_64文字":  {strings.Repeat("a", 64), false},
		"失敗pass_65文字":  {strings.Repeat("a", 65), true},
		"成功pass_文字種不問": {"パスワード", false},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			listener := &domain.Listener{Email: "shari@gmail.com", Password: tt.password}
			if err := ValidateLogin(listener); (err != nil) != tt.wantErr {
				t.Errorf("ValidateLogin() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
