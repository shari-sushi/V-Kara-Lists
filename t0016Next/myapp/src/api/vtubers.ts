import { axiosClientVcontents } from "./util/axiosClient"

export const createVtuber = async (req: CreateVtuberRequest, after?: () => void) => {
  try {
    await axiosClientVcontents.post("/create/vtubers", req)
    after?.()
  } catch (err) {
    alert("登録失敗: VTuber")
    console.error(err)
  }
}

export type CreateVtuberRequest = {
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
}
