package common

// Goが空sliceをjsonに変換するとnullになるので、空sliceを返すutility関数
func EnsureSlice[T any](s []T) []T {
	if s == nil {
		return []T{}
	}
	return s
}
