import { VIDEO_CATEGORY, type VideoCategory } from "@/types/vtuber_content"

// 歌枠(category=31)だけを #414 以前の画面で表示する(#458)。
// APIは4カテゴリ混在で返すため、ページ側で歌枠以外を取り除く。
export const filterKaraokeCategory = <T extends { Category: VideoCategory }>(items: T[] | null | undefined): T[] => (items ?? []).filter((item) => item.Category === VIDEO_CATEGORY.KARAOKE)
