import { axiosClientVcontents } from "./util/axiosClient"

export const createVideoSongs = async (req: CreateVideoSongsRequest, after?: () => void) => {
  try {
    await axiosClientVcontents.post("/create/video-songs", req)
    after?.()
  } catch (err) {
    alert("登録失敗: 複数の歌(video song)")
    console.error(err)
  }
}

export type CreateVideoSongsRequest = {
  VideoId: number
  Songs: VideoSongInput[]
}

export type VideoSongInput = {
  SingStart: string
  SongName: string
}
