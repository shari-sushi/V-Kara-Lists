import Link from "next/link"
import https from "https"
import axios, { AxiosRequestConfig } from "axios"
import { domain } from "@/../env"
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from "@/types/vtuber_content"
import { YouTubePlayer } from "@/components/moviePlayer/YoutubePlayer"
import { Layout } from "@/components/layout/Layout"
import { VtuberTable } from "@/components/table/Vtuber"
import { MovieTable } from "@/components/table/Movie"
import { KaraokeThinTable, KaraokeMinRandomTable } from "@/components/table/Karaoke"
import { ToClickTW } from "@/styles/tailwiind"
import { ContextType } from "@/types/server"
import Image from "next/image"
import { TopPageNotice } from "@/features/notice/notice"
import { checkLoggedin } from "@/util/webStrage/cookie"
import { timeStringToSecondNum, extractVideoId } from "@/util"
import { generateRandomNumber } from "@/components/SomeFunction"
import { useVideo } from "@/providers/VideoProvider"
import { FailedMessage } from "@/components/Message/FailedMessage"

const pageName = "Top"

type TopPageProps = {
  posts: {
    vtubers: ReceivedVtuber[]
    vtubers_movies: ReceivedMovie[]
    vtubers_movies_karaokes: ReceivedKaraoke[]
    latest_karaokes: ReceivedKaraoke[]
  }
  isSignin: boolean
  hasError: boolean
}

const TopPage = ({ posts, isSignin, hasError }: TopPageProps) => {
  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="pt-1">
        <TitleGroup />
        <TopPageNotice />
        <MainItem posts={posts} isSignin={isSignin} hasError={hasError} />
        {hasError && <FailedMessage />}
      </div>
    </Layout>
  )
}

const MainItem = ({ posts }: TopPageProps) => {
  const hasKaraokes = posts.latest_karaokes.length > 0
  const playKaraokeNumber = hasKaraokes ? generateRandomNumber(posts.latest_karaokes.length - 1) : 0
  const { videoState } = useVideo({
    // データが無い時は 音恋宮 花に亡霊
    youtubeId: hasKaraokes ? extractVideoId(posts.latest_karaokes[playKaraokeNumber].MovieUrl) : "jgGA5hVNpyM",
    startTime: hasKaraokes ? timeStringToSecondNum(posts.latest_karaokes[playKaraokeNumber].SingStart) : 3718,
    isPlaying: hasKaraokes,
  })
  // const handleMovieClickYouTube = (url: string, start: number) => {
  //   updateVideo(extractVideoId(url), start);
  //   //クリティカルな環境バグなので再発時用に残しておく
  //   // if (currentMovieId == ExtractVideoId(url)) {
  //   // setStart(-1);
  //   // setStart(start);
  //   // } else {
  //   // setCurrentMovieId(extractVideoId(url));
  //   // setStart(start);
  //   //以下をonReady発火させられれば、ユーザー環境による差を少なくできる気がする
  //   // setTimeout(function () {
  //   // setStart(-1);
  //   // setStart(start);
  //   // }, 1400); //local環境で、1100ms 高確率で✖, 1300ms:✖が少なくない //短すぎるとエラーになる注意
  //   // }
  // };

  return (
    <div className="flex flex-col justify-center">
      <div id="feature" className={`flex flex-col md:flex-row bg-[#657261] rounded max-w-[1000px]  md:h-[290px] h-[400px] w-full mx-auto top-0 p-1`}>
        {/* 左側の要素 */}
        {/* TODO: 動画はVideoLayoutで常に表示するようにしつつ、ここではスペーサーであるAltBoxを表示/非表示するようにする */}
        {videoState.position === "in-content" && (
          <div className="flex flex-col mr-1 ">
            <div className="relative flex justify-center">
              <YouTubePlayer videoId={videoState.youtubeId} start={videoState.startTime} />
            </div>
            <span className="relative flex md:top-2 justify-center md:mb-3">{"音量差 注意（特に個人→大手）"}</span>
          </div>
        )}

        {/* 右側の要素 */}
        <div id="right" className={`relative w-full h-full border px-1 rounded `}>
          <span className="mx-2 mt-1 absolute w-[70%]">最近登録された50曲</span>
          <Link href={`/sings/karaoke`} className={`absolute flex right-1 top-[1px] ${ToClickTW.regular}`}>
            <Image src="/content/note.svg" className="h-5 mx-1 " width={24} height={24} alt="note image" />
            もっと見る
          </Link>
          <div id="table" className="absolute mt-7 m w-[98%] md:w-[99%] overflow-y-scroll h-[82%] md:h-[88%] ">
            <KaraokeThinTable posts={posts?.latest_karaokes} />
          </div>
        </div>
      </div>
      <div id="feature" className={`flex-col md:flex-row justify-center max-w-[1000px] w-full mx-auto inline-block top-0 p-1`}>
        <div className="mt-4 max-w-[1000px] space-y-5">
          <div>
            <div className="flex">
              <Image src="/content/human_white.svg" className="h-5 mr-1" width={24} height={24} alt="humans icon" />
              <h2 className="h-5 flex-1 mb-1">配信者</h2>
            </div>
            <VtuberTable posts={posts?.vtubers} />
          </div>
          <div>
            <h2 className="flex">
              <Image src="/content/movie.svg" className="h-5 mr-1" width={24} height={24} alt="movie icon" />
              歌枠(動画)
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <MovieTable posts={posts?.vtubers_movies} />
            </div>
          </div>
          <div>
            <h2 className="flex">
              <Image src="/content/note.svg" className="h-5 mr-1" width={24} height={24} alt="note icon" />歌
            </h2>
            <KaraokeMinRandomTable posts={posts.vtubers_movies_karaokes} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default TopPage

const TitleGroup = () => {
  return (
    <div className="flex flex-col items-center">
      <hgroup className="pb-1 md:pb-3 ">
        <h1 className="flex justify-center text-xl sm:text-2xl md:text-3xl font-bold underline">V-Karaoke (VTuber-Karaoke-Lists)</h1>
        <h2 className="flex justify-center text-sm  md:text-base">「推し」の「歌枠」の聴きたい「歌」</h2>
        <h2 className="flex justify-center text-xs ms:text-sm md:text-base ">「ささっと把握」、「さくっと再生」、「ばばっと布教」</h2>
      </hgroup>
    </div>
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

  // apiをリソース毎に分けるまでの仮
  type PageResponse = {
    vtubers: ReceivedVtuber[]
    vtubers_movies: ReceivedMovie[]
    vtubers_movies_karaokes: ReceivedKaraoke[]
    latest_karaokes: ReceivedKaraoke[]
  }

  let resData: PageResponse | undefined = undefined
  let hasError: boolean = true

  try {
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options)
    resData = res.data as PageResponse
    hasError = false
  } catch (error) {
    console.log("erroe in axios.get:", error)
    resData = {
      vtubers: [],
      vtubers_movies: [],
      vtubers_movies_karaokes: [],
      latest_karaokes: [],
    }
  }

  return {
    props: {
      isSignin: isLoggedin,
      posts: resData,
      hasError: hasError,
    } as TopPageProps,
  }
}
