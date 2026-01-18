import { CreateContentData } from "@/types/vtuber_content"
import { CreateKaraokeSongsRequest } from "@/api/karaokes"
import { CreateVtuberRequest } from "@/api/vtubers"
import { CreateKaraokeVideoRequest } from "@/api/videos"

export const getCreateVtuberReq = (crudData: CreateContentData): CreateVtuberRequest => {
  return {
    VtuberName: crudData.VtuberName,
    VtuberKana: crudData.VtuberKana,
    IntroMovieUrl: crudData.IntroMovieUrl,
  }
}

export const getCreateKaraokeVideo = (crudData: CreateContentData, vtuberId: number): CreateKaraokeVideoRequest => {
  return {
    VtuberId: vtuberId,
    MovieTitle: crudData.MovieTitle,
    MovieUrl: crudData.MovieUrl,
  }
}

export const getCreateKaraokesReq = (crudData: CreateContentData): CreateKaraokeSongsRequest => {
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
