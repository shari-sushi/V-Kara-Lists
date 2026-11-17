import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Layout } from "@/components/layout/Layout"
import { ToClickTW } from "@/styles/tailwiind"
import type { ReceivedVideoSong, SongListPosts, VideoCategory } from "@/types/vtuber_content"
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer"
import { timeStringToSecondNum, VIDEO_CATEGORY_LABELS } from "@/util"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { DropDownMovie } from "@/components/dropDown/Movie"
import KaraokeGlobalFilterTable from "@/components/table-tanstack/Karaoke/KaraokeGlobalFilterTable"
import { useVideo } from "@/providers/VideoProvider"
import { FailedMessage } from "@/components/Message/FailedMessage"

export type SongListPageProps = {
  posts: SongListPosts
  isSignin: boolean
  hasError: boolean
}

type Props = SongListPageProps & {
  pageName: string
  category: VideoCategory
}

// 1動画に複数曲を持つカテゴリ(歌枠・ライブ)の歌一覧ページ。
// 歌枠の #414 以前の画面(#458)をそのままライブにも使う。posts は category で絞り込み済みのものを渡す。
export const SongListPage = ({ posts, isSignin, hasError, pageName, category }: Props) => {
  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      {hasError && <FailedMessage />}
      <MainItem posts={posts} category={category} />
    </Layout>
  )
}

const MainItem = ({ posts: { vtubers, vtubers_videos: videos, vtubers_video_songs: songs }, category }: { posts: SongListPosts; category: VideoCategory }) => {
  //船長　kORHSmXcYNc, 00:08:29
  const { videoState } = useVideo({ youtubeId: "5WzeYsoGCZc", startTime: timeStringToSecondNum("00:22:04") })

  const [, setSelectedPost] = useState<ReceivedVideoSong | undefined>(undefined)

  const [selectedVtuber, setSelectedVtuber] = useState<number>(0)
  const [selectedMovie, setSelectedMovie] = useState<string>("")
  const [filteredSongs, setFilteredSongs] = useState<ReceivedVideoSong[]>([])
  const clearMovieHandler = () => {
    // TODO: 実装
  }

  // TODO: useEffectをやめてコールバックで操作する
  useEffect(() => {
    setFilteredSongs(filterSongsByParentContent(songs, selectedVtuber, selectedMovie))
  }, [selectedVtuber, selectedMovie, songs])

  return (
    <div className="flex flex-col w-full max-w-[1000px] mx-auto">
      <div className={`pt-6 flex flex-col items-center`}>
        <div className={`flex ${videoState.position === "in-content" ? "" : "w-full max-w-[600px]"}`}>
          <div id="feature" className={`flex flex-col md:flex-row bg-[#657261] rounded p-1 w-full mx-auto max-w-[1000px]`}>
            {/* 左側の要素 */}
            {/* TODO: 動画はVideoLayoutで常に表示するようにしつつ、ここではスペーサーであるAltBoxを表示/非表示するようにする */}
            {videoState.position === "in-content" && (
              <div className="flex flex-col mr-1 ">
                <div className="relative flex justify-center">
                  <YouTubePlayer videoId={videoState.youtubeId} start={videoState.startTime} />
                </div>
              </div>
            )}

            {/* 右側の要素 */}
            <div id="right" className={`relative px-1 rounded border ${videoState.position !== "in-content" ? "w-full" : ""}`}>
              <h1 className="text-lg">絞込み（入力できます）</h1>
              <DropDownVtuber vtubers={vtubers} onSelectVtuber={setSelectedVtuber} defaultMenuIsOpen={false} />

              <DropDownMovie videos={videos} disabled={selectedVtuber === 0} setSelectedMovie={setSelectedMovie} clearMovieHandler={clearMovieHandler} />
              <div className="pt-3 flex justify-end">
                <div className="w-fit">
                  <span>お探しの{VIDEO_CATEGORY_LABELS[category]}や歌がありませんか？</span> <br />
                  <Link className={`${ToClickTW.regular} justify-center float-right px-3 mr-2`} href="/crud/create">
                    データを登録する
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <KaraokeGlobalFilterTable posts={filteredSongs} setSelectedPost={setSelectedPost} />
      </div>
    </div>
  )
}

const filterSongsByParentContent = (songs: ReceivedVideoSong[], selectedVtuber: number, selectedMovie: string) => {
  if (selectedVtuber == 0 && selectedMovie == "") {
    return songs
  } else if (selectedVtuber != 0 && selectedMovie == "") {
    return songs.filter((song: ReceivedVideoSong) => song.VtuberId === selectedVtuber)
  } else {
    return songs.filter((song: ReceivedVideoSong) => song.MovieUrl === selectedMovie)
  }
}
