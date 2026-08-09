import { VideoCategory } from "@/types/vtuber_content"
import { axiosClientVcontents } from "./util/axiosClient"

// APIを叩く関数はこのファイルに集約する。try/catch/alertの形が共通のため
// createWithAlertに切り出し、各create関数はエンドポイントと失敗時ラベルのみ渡す。
const createWithAlert = async <Req>(path: string, req: Req, failureLabel: string, after?: () => void) => {
  try {
    await axiosClientVcontents.post(path, req)
    after?.()
  } catch (err) {
    alert(`登録失敗: ${failureLabel}`)
    console.error(err)
  }
}

export type CreateVtuberRequest = {
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
}

export type CreateVideoRequest = {
  VtuberId: number
  Category: VideoCategory
  Title: string
  MovieUrl: string
}

export type VideoSongInput = {
  SingStart: string
  SongName: string
}

export type CreateVideoSongsRequest = {
  VideoId: number
  Songs: VideoSongInput[]
}

const createVtuber = (req: CreateVtuberRequest, after?: () => void) => createWithAlert("/create/vtubers", req, "VTuber", after)

const createVideo = (req: CreateVideoRequest, after?: () => void) => createWithAlert("/create/videos", req, "動画(video)", after)

const createVideoSongs = (req: CreateVideoSongsRequest, after?: () => void) =>
  createWithAlert("/create/video-songs", req, "複数の歌(video song)", after)

export const api = {
  // Vtuber
  CreateVtuber: createVtuber,
  // video
  CreateVideo: createVideo,
  // video song
  CreateVideoSongs: createVideoSongs,
}
