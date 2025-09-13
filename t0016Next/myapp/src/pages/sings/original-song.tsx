import React, { useState } from "react"
import https from "https"
import { AxiosRequestConfig } from "axios"
import type { ReceivedKaraoke } from "@/types/vtuber_content"
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer"
import { timeStringToSecondNum, extractVideoId } from "@/util"
import { KaraokePaginationTable } from "@/components/table/Karaoke"
import { Layout } from "@/components/layout/Layout"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"
import { useVideo } from "@/providers/VideoProvider"
import { dummyKaraokeArray } from "@/util/dummyData/dummyData"

const pageName = "オリ曲"

type PostsAndCheckSignin = {
  vtubers_movies_karaokes: ReceivedKaraoke[]
  isSignin: boolean
}

export default function SingsPage({ vtubers_movies_karaokes: karaokes = dummyKaraokeArray, isSignin }: PostsAndCheckSignin) {
  const { videoState } = useVideo(
    // おいもオリ曲 00:00:00
    { youtubeId: "HcpFGZNusBw", startTime: timeStringToSecondNum("00:00:00"), isPlaying: true }
  )

  const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="flex flex-col w-full max-w-[1000px] mx-auto">
        <div className={`pt-6 flex flex-col items-center`}>
          {videoState.position === "in-content" && (
            <div className={`flex `}>
              <YouTubePlayer videoId={videoState.youtubeId} start={videoState.startTime} />
            </div>
          )}
          <div>
            <span>※オリ曲の登録機能は未実装です※</span>
          </div>
          <div className="flex flex-col w-full">
            <KaraokePaginationTable karaokes={karaokes} setSelectedPost={setSelectedPost} />
          </div>
        </div>
      </div>
    </Layout>
  )
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

  // let resData: PostsAndCheckSignin | undefined = [] as PostsAndCheckSignin[];
  // try {
  // const res = await axios.get(`${domain.backendHost}/vcontents/orignal-song`, options);
  // resData = res.data;
  // } catch (error) {
  // console.log("erroe in axios.get:", error);
  // }
  // if (resData == null) {
  return {
    props: {
      karaokes: dummyKaraokeArray,
      isSignin: isLoggedin,
    },
  }
  // }
}
