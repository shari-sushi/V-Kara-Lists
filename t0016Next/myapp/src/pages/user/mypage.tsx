import React, { useState } from "react"
import https from "https"
import axios, { AxiosRequestConfig } from "axios"
import Link from "next/link"
import Image from "next/image"

import { domain } from "@/../env"
import { Layout } from "@/components/layout/Layout"
import type { ReceivedKaraoke, ReceivedVtuber, ReceivedMovie } from "../../types/vtuber_content" //type{}で型情報のみインポート
import { VtuberTable } from "@/components/table/Vtuber"
import { MovieTable } from "@/components/table/Movie"
import { KaraokePaginationTable } from "@/components/table/Karaoke"
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer"
import { extractVideoId } from "@/util"
import { ContextType } from "@/types/server"
import { NotLoggedIn } from "@/components/layout/Main"
import { ToClickTW } from "@/styles/tailwiind"
import { checkLoggedin } from "@/util/webStrage/cookie"
import { useVideo } from "@/providers/VideoProvider"

const pageName = "MyPage"

type Mypage = {
  data: {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[]
    vtubers_movies_u_created: ReceivedMovie[]
    vtubers_u_created: ReceivedVtuber[]
  }
  isSignin: boolean
}

const MyPage = ({ data, isSignin }: Mypage) => {
  if (!isSignin) {
    return (
      <Layout pageName={pageName} isSignin={isSignin}>
        <NotLoggedIn />
      </Layout>
    )
  }

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <MainItem data={data} isSignin={isSignin} />
    </Layout>
  )
}

const MainItem = ({ data }: Mypage) => {
  //こむぎ ワールドイズマイン
  const { videoState, updateVideo } = useVideo({ youtubeId: "Bjsn-QpwmvU", startTime: 8091 })
  const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

  const { vtubers_u_created: vtubers, vtubers_movies_u_created: movies, vtubers_movies_karaokes_u_created: karaokes } = data
  const handleMovieClickYouTubeDemoMovie = () => {
    const demoUrl = "HunsO-8Eo7Q"
    const startTimeCreateOfDemo = 130
    updateVideo(extractVideoId(demoUrl), startTimeCreateOfDemo)
  }

  const isVideoInContent = videoState.position === "in-content"

  return (
    <div className="flex flex-col max-w-[1000px] justify-ite">
      {isVideoInContent && (
        <div className="flex mx-auto mt-6">
          <YouTubePlayer videoId={videoState.youtubeId} start={videoState.startTime} />
        </div>
      )}

      {vtubers.length + movies.length + karaokes?.length === 0 ? (
        <div
          id="feature"
          className={`bg-[#657261] rounded top-0 p-1
          max-w-[1000px]  md:h-[290px] h-[400px] w-full mx-auto
                `}
        >
          <div className="mt-4 ">
            <h1 className="flex flex-col font-bold text-lg ">
              <span className="mx-auto">自分の登録したデータ一覧</span>
            </h1>

            <div className="flex flex-col p-5">
              <div className="mx-auto">自分で登録したデータが無いようです...TT</div>
              <button className={`${ToClickTW.regular} flex max-w-40 mt-8 mx-auto`} onClick={() => handleMovieClickYouTubeDemoMovie()}>
                データ登録方法を <br />
                動画で見る
              </button>
              <div className="flex justify-center">
                <span className="py-5">
                  <Link href="/crud/create" className={`${ToClickTW.regular} `}>
                    データ登録する
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="feature"
          className={`flex-col md:flex-row justify-center
                max-w-[1000px] w-full mx-auto inline-block
                top-0 p-1
                `}
        >
          <div className="mt-4 max-w-[1000px] ">
            <h1 className="font-bold text-lg">
              <u></u>自分の登録したデータ一覧
            </h1>
            <div>
              <div className="">
                <div className=" ">
                  <div className="flex">
                    <Image src="/content/human_white.svg" width={20} height={20} alt="Human Icon" className="h-5 mr-1" />
                    <h2>配信者: 登録数{vtubers.length}</h2>
                  </div>
                  <VtuberTable posts={vtubers} />
                  <br />
                </div>

                <div className=" ">
                  <div className="flex">
                    <Image src="/content/movie.svg" width={20} height={20} alt="Movie Icon" className="h-5 mr-1" />
                    <h2>歌枠(動画): 登録数{movies.length}</h2>
                  </div>
                  <MovieTable posts={movies} />
                  <br />
                </div>

                <div className="flex">
                  <Image src="/content/note.svg" width={20} height={20} alt="Note Icon" className="h-5 mr-1" />
                  <h2>歌: 登録数{karaokes?.length}</h2>
                </div>

                <KaraokePaginationTable karaokes={karaokes} setSelectedPost={setSelectedPost} />
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
      <div className={`w-auto`}>
        <Link href="/user/profile" className={`${ToClickTW.regular} w-auto`}>
          プロフィール
        </Link>
      </div>
    </div>
  )
}

export default MyPage

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

  type PageResponse = {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[]
    vtubers_movies_u_created: ReceivedMovie[]
    vtubers_u_created: ReceivedVtuber[]
  }
  // apiをリソース毎に分けるまでの仮
  let resData: PageResponse | undefined = undefined
  let hasError: boolean = true

  try {
    const res = await axios.get(`${domain.backendHost}/users/mypage`, options)
    resData = res.data as PageResponse
    hasError = false
  } catch (error) {
    console.log("erroe in axios.get:", error)
    resData = {
      vtubers_movies_karaokes_u_created: [],
      vtubers_movies_u_created: [],
      vtubers_u_created: [],
    }
  }

  return {
    props: {
      data: resData,
      isSignin: isLoggedin,
      hasError: hasError,
    },
  }
}
