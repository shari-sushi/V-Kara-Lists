import { VideoCategory } from "@/types/vtuber_content"
import { axiosClientVcontents } from "./util/axiosClient"

export const createVideo = async (req: CreateVideoRequest, after?: () => void) => {
  try {
    await axiosClientVcontents.post("/create/videos", req)
    after?.()
  } catch (err) {
    alert("登録失敗: 動画(video)")
    console.error(err)
  }
}

export type CreateVideoRequest = {
  VtuberId: number
  Category: VideoCategory
  Title: string
  MovieUrl: string
}
