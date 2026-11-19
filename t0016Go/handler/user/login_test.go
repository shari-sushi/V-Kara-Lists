package user

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/service"
)

type fakeUserRepository struct {
	listenersByEmail map[string]domain.Listener
	findErr          error
}

func (r *fakeUserRepository) CreateUser(l domain.Listener) (domain.Listener, error) { return l, nil }
func (r *fakeUserRepository) LogicalDeleteUser(domain.Listener) error               { return nil }
func (r *fakeUserRepository) FindUserByListenerId(domain.ListenerId) (domain.Listener, error) {
	return domain.Listener{}, domain.ErrListenerNotFound
}
func (r *fakeUserRepository) FindUserByEmail(email string) (domain.Listener, error) {
	if r.findErr != nil {
		return domain.Listener{}, r.findErr
	}
	listener, ok := r.listenersByEmail[email]
	if !ok {
		return domain.Listener{}, domain.ErrListenerNotFound
	}
	return listener, nil
}

func setupLoginTest(t *testing.T) (registeredEmail, registeredPassword string, repo *fakeUserRepository) {
	t.Helper()
	gin.SetMode(gin.TestMode)
	t.Setenv("AES_KEY", "0123456789abcdef0123456789abcdef")
	t.Setenv("AES_IV", "000102030405060708090a0b0c0d0e0f")
	t.Setenv("BCRYPT_COST", "4")
	t.Setenv("SECRET_KEY", "test-secret")
	common.InitCryptVar()

	registeredEmail = "registered@example.com"
	registeredPassword = "correct-password"
	emailAES, err := common.EncryptByAES(registeredEmail)
	if err != nil {
		t.Fatalf("EncryptByAES() error = %v", err)
	}
	hash, err := common.EncryptPassword(registeredPassword)
	if err != nil {
		t.Fatalf("EncryptPassword() error = %v", err)
	}
	repo = &fakeUserRepository{listenersByEmail: map[string]domain.Listener{
		emailAES: {ListenerId: 1, Email: emailAES, Password: hash},
	}}
	return registeredEmail, registeredPassword, repo
}

func postLogin(t *testing.T, repo *fakeUserRepository, email, password string) *httptest.ResponseRecorder {
	t.Helper()
	handler := NewUserHandler(service.UserService{UserRepository: repo}, service.ActivityService{})
	body, err := json.Marshal(map[string]string{"Email": email, "Password": password})
	if err != nil {
		t.Fatalf("json.Marshal() error = %v", err)
	}
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPut, "/v1/users/login", bytes.NewReader(body))
	c.Request.Header.Set("Content-Type", "application/json")
	handler.LogIn(c)
	return recorder
}

func TestLogIn(t *testing.T) {
	registeredEmail, registeredPassword, repo := setupLoginTest(t)

	t.Run("success: 正しいメールアドレスとパスワードでログインできる", func(t *testing.T) {
		got := postLogin(t, repo, registeredEmail, registeredPassword)
		if got.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", got.Code, http.StatusOK)
		}
	})

	t.Run("failure: 未登録とパスワード違いで同じ応答を返す", func(t *testing.T) {
		unregistered := postLogin(t, repo, "unregistered@example.com", registeredPassword)
		wrongPassword := postLogin(t, repo, registeredEmail, "wrong-password")

		if unregistered.Code != http.StatusUnauthorized || wrongPassword.Code != http.StatusUnauthorized {
			t.Errorf("status = (unregistered: %d, wrongPassword: %d), want both %d", unregistered.Code, wrongPassword.Code, http.StatusUnauthorized)
		}
		if unregistered.Body.String() != wrongPassword.Body.String() {
			t.Errorf("body differs:\nunregistered:  %s\nwrongPassword: %s", unregistered.Body.String(), wrongPassword.Body.String())
		}
		if len(unregistered.Result().Cookies()) != 0 {
			t.Errorf("cookie should not be set on failed login")
		}
	})

	t.Run("failure: DBエラーは500を返す", func(t *testing.T) {
		brokenRepo := &fakeUserRepository{findErr: errors.New("db is down")}
		got := postLogin(t, brokenRepo, registeredEmail, registeredPassword)
		if got.Code != http.StatusInternalServerError {
			t.Errorf("status = %d, want %d", got.Code, http.StatusInternalServerError)
		}
	})
}
