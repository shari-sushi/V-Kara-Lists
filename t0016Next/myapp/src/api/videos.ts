import { axiosClientVcontents } from "./util/axiosClient"

export const createKaraokeVideo = async (req: CreateKaraokeVideoRequest, after?: () => void) => {
  try {
    await axiosClientVcontents.post("/create/videos", req)
    after?.()
  } catch (err) {
    alert("登録失敗: 歌(karaoke)")
    console.error(err)
  }
}

export type CreateKaraokeVideoRequest = {
  VtuberId: number
  MovieTitle: string
  MovieUrl: string
}
