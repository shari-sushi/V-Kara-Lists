import { axiosClientVcontents } from "./util/axiosClient"

export const createKaraokes = async (req: CreateKaraokeSongsRequest, after?: () => void) => {
  try {
    await axiosClientVcontents.post("/create/karaokes", req)
    after?.()
  } catch (err) {
    alert("登録失敗: 複数の歌(karaoke)")
    console.error(err)
  }
}

export type CreateKaraokeSongsRequest = {
  MovieUrl: string
  Songs: KaraokeSong[]
}

export type KaraokeSong = {
  SingStart: string
  SongName: string
}
