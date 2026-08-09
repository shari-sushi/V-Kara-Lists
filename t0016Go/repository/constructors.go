package repository

// NewContentRepository creates a new ContentRepository implementation
func NewContentRepository(sqlHandler SqlHandler) ContentRepository {
	return &contentRepository{
		SqlHandler: sqlHandler,
	}
}

// NewUserRepository creates a new UserRepository implementation
func NewUserRepository(sqlHandler SqlHandler) UserRepository {
	return &userRepository{
		SqlHandler: sqlHandler,
	}
}

// NewFavoriteRepository creates a new FavoriteRepository implementation
func NewFavoriteRepository(sqlHandler SqlHandler) FavoriteRepository {
	return &favoriteRepository{
		SqlHandler: sqlHandler,
	}
}
