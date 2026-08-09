import React from "react"
import https from "https"
import axios, { AxiosRequestConfig } from "axios"
import Link from "next/link"

import { domain } from "@/../env"
import { Layout } from "@/components/layout/Layout"
import type { ReceivedVideoSong, ReceivedVtuber, ReceivedVideo } from "@/types/vtuber_content"
import { ContextType } from "@/types/server"
import { NotLoggedIn } from "@/components/layout/Main"
import { ToClickTW } from "@/styles/tailwiind"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "MyPage"

type Mypage = {
  data: {
    vtubers_video_songs_u_created: ReceivedVideoSong[]
    vtubers_videos_u_created: ReceivedVideo[]
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
  const { vtubers_u_created: vtubers, vtubers_videos_u_created: videos, vtubers_video_songs_u_created: videoSongs } = data

  return (
    <div className="flex flex-col max-w-[1000px] justify-ite">
      <div
        id="feature"
        className={`bg-[#657261] rounded top-0 p-1
        max-w-[1000px] w-full mx-auto
              `}
      >
        <div className="mt-4 p-5">
          <h1 className="flex flex-col font-bold text-lg">
            <span className="mx-auto">自分の登録したデータ一覧</span>
          </h1>
          <div className="flex flex-col items-center py-5">
            <p>配信者: 登録数{vtubers.length}</p>
            <p>動画: 登録数{videos.length}</p>
            <p>歌: 登録数{videoSongs.length}</p>
            <p className="mt-4 text-sm">
              このページは動画・歌のデータモデル刷新に伴い開発中です。一覧表示は近日対応予定です。
            </p>
          </div>
        </div>
      </div>
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
    vtubers_video_songs_u_created: ReceivedVideoSong[]
    vtubers_videos_u_created: ReceivedVideo[]
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
      vtubers_video_songs_u_created: [],
      vtubers_videos_u_created: [],
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
