import { VideoCategory, PrimitiveVtuber, PrimitiveVideo, PrimitiveVideoSong } from "@/types/vtuber_content"
import { axiosClientVcontents } from "./util/axiosClient"

// APIを叩く関数はこのファイルに集約する。try/catch/alertの形が共通のため、
// 更新系(create/edit/delete)は共通ヘルパーに切り出す。
// レスポンスは成功時に実際のデータを返す(バックエンド側の対応: #326[create], #257[edit, delete])。
// 呼び出し側はこのデータを使って手元の状態(local state)に反映させる。

const requestWithAlert = async <Req, Res>(
  method: "post" | "delete",
  path: string,
  req: Req,
  failureLabel: string,
  after?: (data: Res) => void,
): Promise<Res | undefined> => {
  try {
    const res =
      method === "post"
        ? await axiosClientVcontents.post<Res>(path, req)
        : await axiosClientVcontents.delete<Res>(path, { data: req })
    after?.(res.data)
    return res.data
  } catch (err) {
    alert(`${failureLabel}に失敗しました`)
    console.error(err)
    return undefined
  }
}

const createWithAlert = <Req, Res>(path: string, req: Req, failureLabel: string, after?: (data: Res) => void) =>
  requestWithAlert<Req, Res>("post", path, req, `登録失敗: ${failureLabel}`, after)

const editWithAlert = <Req, Res>(path: string, req: Req, failureLabel: string, after?: (data: Res) => void) =>
  requestWithAlert<Req, Res>("post", path, req, `更新失敗: ${failureLabel}`, after)

const deleteWithAlert = <Req, Res>(path: string, req: Req, failureLabel: string, after?: (data: Res) => void) =>
  requestWithAlert<Req, Res>("delete", path, req, `削除失敗: ${failureLabel}`, after)

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

export type EditVtuberRequest = PrimitiveVtuber
export type EditVideoRequest = PrimitiveVideo
export type EditVideoSongRequest = PrimitiveVideoSong

export type DeleteVtuberRequest = Pick<PrimitiveVtuber, "VtuberId" | "VtuberName">
export type DeleteVideoRequest = Pick<PrimitiveVideo, "VideoId">
export type DeleteVideoSongRequest = Pick<PrimitiveVideoSong, "VideoSongId">

export type CreateVtuberResponse = { vtuber: PrimitiveVtuber }
export type CreateVideoResponse = { video: PrimitiveVideo }
export type CreateVideoSongsResponse = { video_songs: PrimitiveVideoSong[] }

export type EditVtuberResponse = { vtuber: PrimitiveVtuber }
export type EditVideoResponse = { video: PrimitiveVideo }
export type EditVideoSongResponse = { video_song: PrimitiveVideoSong }

export type DeleteVtuberResponse = { vtuber: PrimitiveVtuber }
export type DeleteVideoResponse = { video: PrimitiveVideo }
export type DeleteVideoSongResponse = { video_song: PrimitiveVideoSong }

const createVtuber = (req: CreateVtuberRequest, after?: (data: CreateVtuberResponse) => void) =>
  createWithAlert<CreateVtuberRequest, CreateVtuberResponse>("/create/vtubers", req, "VTuber", after)

const createVideo = (req: CreateVideoRequest, after?: (data: CreateVideoResponse) => void) =>
  createWithAlert<CreateVideoRequest, CreateVideoResponse>("/create/videos", req, "動画(video)", after)

const createVideoSongs = (req: CreateVideoSongsRequest, after?: (data: CreateVideoSongsResponse) => void) =>
  createWithAlert<CreateVideoSongsRequest, CreateVideoSongsResponse>(
    "/create/video-songs",
    req,
    "複数の歌(video song)",
    after,
  )

const editVtuber = (req: EditVtuberRequest, after?: (data: EditVtuberResponse) => void) =>
  editWithAlert<EditVtuberRequest, EditVtuberResponse>("/edit/vtuber", req, "VTuber", after)

const editVideo = (req: EditVideoRequest, after?: (data: EditVideoResponse) => void) =>
  editWithAlert<EditVideoRequest, EditVideoResponse>("/edit/video", req, "動画(video)", after)

const editVideoSong = (req: EditVideoSongRequest, after?: (data: EditVideoSongResponse) => void) =>
  editWithAlert<EditVideoSongRequest, EditVideoSongResponse>("/edit/video-song", req, "歌(video song)", after)

const deleteVtuber = (req: DeleteVtuberRequest, after?: (data: DeleteVtuberResponse) => void) =>
  deleteWithAlert<DeleteVtuberRequest, DeleteVtuberResponse>("/delete/vtuber", req, "VTuber", after)

const deleteVideo = (req: DeleteVideoRequest, after?: (data: DeleteVideoResponse) => void) =>
  deleteWithAlert<DeleteVideoRequest, DeleteVideoResponse>("/delete/video", req, "動画(video)", after)

const deleteVideoSong = (req: DeleteVideoSongRequest, after?: (data: DeleteVideoSongResponse) => void) =>
  deleteWithAlert<DeleteVideoSongRequest, DeleteVideoSongResponse>("/delete/video-song", req, "歌(video song)", after)

export const api = {
  // Vtuber
  CreateVtuber: createVtuber,
  EditVtuber: editVtuber,
  DeleteVtuber: deleteVtuber,
  // video
  CreateVideo: createVideo,
  EditVideo: editVideo,
  DeleteVideo: deleteVideo,
  // video song
  CreateVideoSongs: createVideoSongs,
  EditVideoSong: editVideoSong,
  DeleteVideoSong: deleteVideoSong,
}
