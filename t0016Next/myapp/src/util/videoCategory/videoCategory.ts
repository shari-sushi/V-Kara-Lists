import { VIDEO_CATEGORY, type VideoCategory } from "@/types/vtuber_content"

// APIは4カテゴリ混在で返すため、ページ側で表示するカテゴリ以外を取り除く。
export const filterByCategory = <T extends { Category: VideoCategory }>(items: T[] | null | undefined, category: VideoCategory): T[] => (items ?? []).filter((item) => item.Category === category)

// 歌枠(category=31)だけを #414 以前の画面で表示する(#458)。
export const filterKaraokeCategory = <T extends { Category: VideoCategory }>(items: T[] | null | undefined): T[] => filterByCategory(items, VIDEO_CATEGORY.KARAOKE)

// 1動画に複数曲を持つカテゴリ(歌枠・ライブ)。登録・編集・削除の画面はこの2つを同じ形で扱う。
// バックエンドの domain.VideoCategory.IsSingleSong()(t0016Go/domain/vtuber_content.go)と同じ区分なので、カテゴリを増やすときは両方を合わせること。
export const MULTI_SONG_CATEGORIES: readonly VideoCategory[] = [VIDEO_CATEGORY.KARAOKE, VIDEO_CATEGORY.LIVE]

export const filterMultiSongCategory = <T extends { Category: VideoCategory }>(items: T[] | null | undefined): T[] => (items ?? []).filter((item) => MULTI_SONG_CATEGORIES.includes(item.Category))

export const VIDEO_CATEGORY_LABELS: Record<VideoCategory, string> = {
  [VIDEO_CATEGORY.ORIGINAL_SONG]: "オリ曲",
  [VIDEO_CATEGORY.COVERED_SONG]: "歌ってみた",
  [VIDEO_CATEGORY.KARAOKE]: "歌枠",
  [VIDEO_CATEGORY.LIVE]: "ライブ",
}

// 歌枠とライブが混在する一覧(登録・編集・削除)で、ライブだけ見分けられるようにタイトルに印を付ける。
// 歌枠は従来どおりタイトルのみ(大半が歌枠のため、全件に付けると読みづらい)。
export const titleWithLiveMark = (video: { Category: VideoCategory; Title: string }): string =>
  video.Category === VIDEO_CATEGORY.LIVE ? `【${VIDEO_CATEGORY_LABELS[VIDEO_CATEGORY.LIVE]}】${video.Title}` : video.Title
