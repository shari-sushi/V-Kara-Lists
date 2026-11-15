import { CreateContentData, VIDEO_CATEGORY } from "@/types/vtuber_content"
import { CreateVideoRequest, CreateVideoSongsRequest, CreateVtuberRequest } from "@/api/index"

export const getCreateVtuberReq = (crudData: CreateContentData): CreateVtuberRequest => {
  return {
    VtuberName: crudData.VtuberName,
    VtuberKana: crudData.VtuberKana,
    IntroMovieUrl: crudData.IntroMovieUrl,
  }
}

// 登録フォームから作れる動画は歌枠のみ(ライブ・オリ曲・歌ってみたは準備中 #458)
export const getCreateKaraokeVideoReq = (crudData: CreateContentData, vtuberId: number): CreateVideoRequest => {
  return {
    VtuberId: vtuberId,
    Category: VIDEO_CATEGORY.KARAOKE,
    Title: crudData.Title,
    MovieUrl: crudData.MovieUrl,
  }
}

export const getCreateVideoSongsReq = (crudData: CreateContentData, videoId: number): CreateVideoSongsRequest => {
  return {
    VideoId: videoId,
    Songs: crudData.Songs.map((s) => {
      return {
        SongName: s.SongName,
        SingStart: s.SingStart,
      }
    }),
  }
}
