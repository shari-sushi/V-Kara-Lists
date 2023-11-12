package utility

import (
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func TestHandler_SignUpHandler(t *testing.T) {
	type fields struct {
	}
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		h    *Handler
		args args
	}{
		// {"テスト1", fields{"メソッドの第１引数？", "第２引数"}, args{"メソッドとして呼び出すときの引数"}, "期待してる結果"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.h.SignUpHandler(tt.args.c)
		})
	}
}

func TestHandler_LoginHandler(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		h    *Handler
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.h.LoginHandler(tt.args.c)
		})
	}
}

func TestHandler_GetListenerProfile(t *testing.T) {
	type args struct {
		c *gin.Context
	}
	tests := []struct {
		name string
		h    *Handler
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.h.GetListenerProfile(tt.args.c)
		})
	}
}
