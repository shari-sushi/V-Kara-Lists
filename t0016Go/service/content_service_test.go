package service

import (
	"errors"
	"testing"

	"github.com/sharin-sushi/0016go_next_relation/domain"
	"github.com/sharin-sushi/0016go_next_relation/repository"
)

// fakeContentRepository は UpdateVideo のテスト用。使うメソッドだけ実装し、
// それ以外は埋め込んだ nil のインターフェースのままにする(呼ばれたら panic してテストが落ちる)。
type fakeContentRepository struct {
	repository.ContentRepository
	current domain.Video
	updated *domain.Video
}

func (f *fakeContentRepository) GetVideoById(domain.VideoId) (domain.Video, error) {
	return f.current, nil
}

func (f *fakeContentRepository) UpdateVideo(v domain.Video) error {
	f.updated = &v
	return nil
}

func TestUpdateVideo_CategoryChange(t *testing.T) {
	tests := map[string]struct {
		from    domain.VideoCategory
		to      domain.VideoCategory
		wantErr error
	}{
		"成功_歌枠から歌枠":         {domain.KARAOKE_CATEGORY, domain.KARAOKE_CATEGORY, nil},
		"成功_歌枠からライブ":        {domain.KARAOKE_CATEGORY, domain.LIVE_CATEGORY, nil},
		"成功_ライブから歌枠":        {domain.LIVE_CATEGORY, domain.KARAOKE_CATEGORY, nil},
		"成功_オリ曲から歌ってみた":     {domain.ORIGINAL_SONG_CATEGORY, domain.COVERED_SONG_CATEGORY, nil},
		"成功_歌ってみたからオリ曲":     {domain.COVERED_SONG_CATEGORY, domain.ORIGINAL_SONG_CATEGORY, nil},
		"失敗_歌枠からオリ曲":        {domain.KARAOKE_CATEGORY, domain.ORIGINAL_SONG_CATEGORY, ErrVideoCategoryGroupChange},
		"失敗_ライブから歌ってみた":     {domain.LIVE_CATEGORY, domain.COVERED_SONG_CATEGORY, ErrVideoCategoryGroupChange},
		"失敗_オリ曲から歌枠":        {domain.ORIGINAL_SONG_CATEGORY, domain.KARAOKE_CATEGORY, ErrVideoCategoryGroupChange},
		"失敗_歌ってみたからライブ":     {domain.COVERED_SONG_CATEGORY, domain.LIVE_CATEGORY, ErrVideoCategoryGroupChange},
		"失敗_許容されないcategory": {domain.KARAOKE_CATEGORY, domain.VideoCategory(99), ErrInvalidVideoCategory},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			repo := &fakeContentRepository{current: domain.Video{VideoId: 1, Category: tt.from}}
			s := &ContentService{ContentRepository: repo}

			err := s.UpdateVideo(domain.Video{VideoId: 1, Category: tt.to, MovieUrl: "www.youtube.com/watch?v=AAAAAAAAAAA", Title: "title"})

			if tt.wantErr == nil {
				if err != nil {
					t.Fatalf("UpdateVideo() error = %v, want nil", err)
				}
				if repo.updated == nil || repo.updated.Category != tt.to {
					t.Fatalf("UpdateVideo() did not update category to %d", tt.to)
				}
				return
			}
			if !errors.Is(err, tt.wantErr) {
				t.Fatalf("UpdateVideo() error = %v, want %v", err, tt.wantErr)
			}
			if repo.updated != nil {
				t.Fatalf("UpdateVideo() updated the video although it should be rejected")
			}
		})
	}
}
