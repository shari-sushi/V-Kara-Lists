import { ListenerId } from "./user"

// DB再設計(#398)により、Movie/Karaokeは「動画(Video)」と「動画内の歌唱(VideoSong)」の
// 2つに統一された。4種のコンテンツ(歌枠・ライブ・オリ曲・歌ってみた)の違いは
// VideoCategory の値だけで表現する。

export type BasicDataProps = {
  vtubers: ReceivedVtuber[]
  vtubers_videos: ReceivedVideo[]
  vtubers_video_songs: ReceivedVideoSong[]
}

// 11:オリ曲 12:歌ってみた 31:歌枠 32:ライブ
export type VideoCategory = 11 | 12 | 31 | 32

export const VIDEO_CATEGORY = {
  ORIGINAL_SONG: 11,
  COVERED_SONG: 12,
  KARAOKE: 31,
  LIVE: 32,
} as const satisfies Record<string, VideoCategory>

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

export type FavoriteVideo = {
  VideoId: VideoId
}

export type FavoriteVideoSong = {
  VideoSongId: VideoSongId
}
