import React, { useState, useEffect, useMemo } from "react"
import https from "https"
import axios, { AxiosRequestConfig } from "axios"
import Link from "next/link"
import { domain } from "@/../env"
import { Layout } from "@/components/layout/Layout"
import { ToClickTW } from "@/styles/tailwiind"
import type { ReceivedKaraoke, ReceivedMovie, ReceivedVtuber } from "@/types/vtuber_content"
import type { ContextType } from "@/types/server"
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer"
import { timeStringToSecondNum } from "@/util"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { DropDownMovie } from "@/components/dropDown/Movie"
import KaraokeGlobalFilterTable from "@/components/table-tanstack/Karaoke/KaraokeGlobalFilterTable"
import { checkLoggedin } from "@/util/webStrage/cookie"
import { findVtuber } from "@/components/form/Common"
import { useVideo } from "@/providers/VideoProvider"
import { dummyKaraokeArray } from "@/util/dummyData/dummyData"

const pageName = "カラオケ(全曲)"

type TopPage = {
  posts: {
    vtubers: ReceivedVtuber[]
    vtubers_movies: ReceivedMovie[]
    vtubers_movies_karaokes: ReceivedKaraoke[]
    latest_karaokes: ReceivedKaraoke[]
  }
  isSignin: boolean
}

export default function SingsPage({ posts, isSignin }: TopPage) {
  const karaokes: ReceivedKaraoke[] = useMemo(() => posts?.vtubers_movies_karaokes || dummyKaraokeArray, [posts])
  //船長　kORHSmXcYNc, 00:08:29
  const { videoState } = useVideo({ youtubeId: "5WzeYsoGCZc", startTime: timeStringToSecondNum("00:22:04") })

  const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke | undefined>(undefined)

  const [selectedVtuber, setSelectedVtuber] = useState<number>(0)
  const [selectedMovie, setSelectedMovie] = useState<string>("")
  const [filteredKaraokes, setFilteredKaraokes] = useState<ReceivedKaraoke[]>([])
  const clearMovieHandler = () => {
    // TODO: 実装
  }

  // TODO: useEffectをやめてコールバックで操作する
  useEffect(() => {
    const filteredKaraokes = FilterKaraokesByParentContent(karaokes, selectedVtuber, selectedMovie)
    setFilteredKaraokes(filteredKaraokes)
  }, [selectedVtuber, selectedMovie, karaokes])

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
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
                <DropDownVtuber selectedVtuber={findVtuber(posts.vtubers, selectedVtuber)} posts={posts} onVtuberSelect={setSelectedVtuber} defaultMenuIsOpen={false} />

                <DropDownMovie posts={posts} selectedVtuber={selectedVtuber} setSelectedMovie={setSelectedMovie} clearMovieHandler={clearMovieHandler} />
                <div className="pt-3 flex justify-end">
                  <div className="w-fit">
                    <span>お探しの歌枠や歌がありませんか？</span> <br />
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
          <KaraokeGlobalFilterTable posts={filteredKaraokes} setSelectedPost={setSelectedPost} />
        </div>
      </div>
    </Layout>
  )
}

const FilterKaraokesByParentContent = (karaokes: ReceivedKaraoke[], selectedVtuber: number, selectedMovie: string) => {
  if (selectedVtuber == 0 && selectedMovie == "") {
    return karaokes
  } else if (selectedVtuber != 0 && selectedMovie == "") {
    const choiceKaraoke = karaokes.filter((karaokes: ReceivedKaraoke) => karaokes.VtuberId === selectedVtuber)
    return choiceKaraoke
  } else {
    const choiceKaraoke = karaokes.filter((karaokes: ReceivedKaraoke) => karaokes.MovieUrl === selectedMovie)
    return choiceKaraoke
  }
}

export async function getServerSideProps(context: ContextType) {
  const { sessionToken, isLoggedin } = checkLoggedin(context)
  console.log("pageName, sessionToken, isLoggedin =", pageName, sessionToken, isLoggedin) // 会員、非会員、どのページかの記録のため

  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const options: AxiosRequestConfig = {
    headers: {
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
  }

  let resData = null
  try {
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options)
    resData = res.data
  } catch (error) {
    console.log("erroe in axios.get:", error)
  }
  return {
    props: {
      posts: resData,
      isSignin: isLoggedin,
    },
  }
}
