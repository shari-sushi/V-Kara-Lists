package useCase

import "github.com/sharin-sushi/0016go_next_relation/domain"

// user_interactorと同じだけある
type UserRepository interface {
	CreateUser(domain.Listener) (domain.Listener, error)
	LogicalDeleteUser(domain.Listener) error
	FindUserByEmail(string) (domain.Listener, error)
	// LogIn(domain.Listener) (domain.Listener, error)
	FindUserByListenerId(domain.ListenerId) (domain.Listener, error)
}

type VtuberContentRepository interface {
}

type LikeRepository interface {
}
