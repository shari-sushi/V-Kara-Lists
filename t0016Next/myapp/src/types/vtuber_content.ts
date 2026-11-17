import { ListenerId } from "./user"

// DB再設計(#398)により、Movie/Karaokeは「動画(Video)」と「動画内の歌唱(VideoSong)」の
// 2つに統一された。4種のコンテンツ(歌枠・ライブ・オリ曲・歌ってみた)の違いは
// VideoCategory の値だけで表現する。

// 歌一覧ページ(歌枠・ライブ)で使う GET /vcontents/ の返り値
export type SongListPosts = {
  vtubers: ReceivedVtuber[]
  vtubers_videos: ReceivedVideo[]
  vtubers_video_songs: ReceivedVideoSong[]
  latest_video_songs: ReceivedVideoSong[]
}

export type BasicDataProps = {
  vtubers: ReceivedVtuber[]
  vtubers_videos: ReceivedVideo[]
  vtubers_video_songs: ReceivedVideoSong[]
}

// 11:オリ曲 12:歌ってみた 31:歌枠 32:ライブ
// next/babel(Next 13同梱のBabel)が `satisfies` を解釈できず実行時にimportするとビルドが落ちるため、
// as const の値から VideoCategory を導出する形にしている。
export const VIDEO_CATEGORY = {
  ORIGINAL_SONG: 11,
  COVERED_SONG: 12,
  KARAOKE: 31,
  LIVE: 32,
} as const

export type VideoCategory = (typeof VIDEO_CATEGORY)[keyof typeof VIDEO_CATEGORY]

// 登録・編集・削除フォームで扱うデータの種類。UI上の呼び名(動画=movie, 歌=karaoke)を #414 以前から維持している。
export type CrudContentType = "none" | "vtuber" | "movie" | "karaoke"

export type CreateContentData = {
  VtuberId: number
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
  MovieUrl: string
  Title: string
  Songs: {
    Index: string
    // TODO: 作成のリクエスト時はid不要なので消す
    VideoSongId: number
    SingStart: string
    SongName: string
  }[]
}

//以下、基礎の型３つ

export type VtuberId = number
export type VideoId = number
export type VideoSongId = number

export type PrimitiveVtuber = {
  VtuberId: VtuberId
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
  VtuberInputterId: string
}

export type PrimitiveVideo = {
  VideoId: VideoId
  Category: VideoCategory
  MovieUrl: string
  Title: string
  VtuberId: VtuberId
  PublishedAt: string | null
  InputterId: number
}

export type PrimitiveVideoSong = {
  VideoSongId: VideoSongId
  VideoId: VideoId
  SingStart: string
  SongName: string
  InputterId: number
}

//　画面表示に使う型

export type ReceivedVtuber = {
  VtuberId: VtuberId
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
  VtuberInputterId: string

  Count: number
  IsFav: boolean
}

export type ReceivedVideo = {
  VtuberId: VtuberId
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
  VtuberInputterId: ListenerId

  VideoId: VideoId
  Category: VideoCategory
  MovieUrl: string
  Title: string
  VideoInputterId: number

  Count: number
  IsFav: boolean
}

export type ReceivedVideoSong = {
  VtuberId: VtuberId
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
  VtuberInputterId: ListenerId

  VideoId: VideoId
  Category: VideoCategory
  MovieUrl: string
  Title: string
  VideoInputterId: number

  VideoSongId: VideoSongId
  SingStart: string
  SongName: string
  VideoSongInputterId: number

  Count: number
  IsFav: boolean
}

// VTuberページの動画一覧(api.PublicVideo)。他のレスポンスと違いjsonタグ付きのためsnake_caseで届く。
export type ReceivedPublicVideo = {
  video_id: VideoId
  category: VideoCategory
  movie_url: string
  title: string
  vtuber_id: VtuberId
  published_at: string | null
}

export type FavoriteVideo = {
  VideoId: VideoId
}

export type FavoriteVideoSong = {
  VideoSongId: VideoSongId
}
