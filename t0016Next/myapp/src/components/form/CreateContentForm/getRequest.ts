import { CrudData, IsMultipleSongCrudData } from "@/types/vtuber_content"
import { CreateKaraokeSongsRequest } from "@/api/karaokes"
import { CreateVtuberRequest } from "@/api/vtubers"
import { CreateKaraokeVideoRequest } from "@/api/videos"

export const getCreateVtuberReq = (crudData: CrudData): CreateVtuberRequest => {
  return {
    VtuberName: crudData.VtuberName,
    VtuberKana: crudData.VtuberKana,
    IntroMovieUrl: crudData.IntroMovieUrl,
  }
}

export const getCreateKaraokeVideo = (crudData: CrudData, vtuberId: number): CreateKaraokeVideoRequest => {
  return {
    VtuberId: vtuberId,
    MovieTitle: crudData.MovieTitle,
    MovieUrl: crudData.MovieUrl,
  }
}

export const getCreateKaraokesReq = (crudData: CrudData): CreateKaraokeSongsRequest => {
  if (!IsMultipleSongCrudData(crudData)) {
    // 単一登録のUIを完全撤廃したら削除予定。
    return {
      MovieUrl: crudData.MovieUrl,
      Songs: [
        {
          SingStart: crudData.SingStart,
          SongName: crudData.SongName,
        },
      ],
    }
  }

  return {
    MovieUrl: crudData.MovieUrl,
    Songs: crudData.Songs.map((s) => {
      return {
        SongName: s.SongName,
        SingStart: s.SingStart,
      }
    }),
  }
}
