import https from "https"
import axios, { AxiosRequestConfig } from "axios"
import { domain } from "@/../env"
import type { VideoCategory } from "@/types/vtuber_content"
import type { SongListPosts, SongListPageProps } from "@/components/content/SongListPage"
import { filterByCategory } from "@/util"

const EMPTY_POSTS: SongListPosts = {
  vtubers: [],
  vtubers_videos: [],
  vtubers_video_songs: [],
  latest_video_songs: [],
}

// 歌一覧ページ(歌枠・ライブ)の getServerSideProps 用。
// GET /vcontents/ は全カテゴリを返すため、表示するカテゴリだけに絞って返す。
export const fetchSongListPageProps = async (sessionToken: string | undefined, isLoggedin: boolean, category: VideoCategory): Promise<SongListPageProps> => {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const options: AxiosRequestConfig = {
    headers: {
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
  }

  try {
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options)
    const data = res.data as SongListPosts
    return {
      posts: {
        ...data,
        vtubers_videos: filterByCategory(data.vtubers_videos, category),
        vtubers_video_songs: filterByCategory(data.vtubers_video_songs, category),
        latest_video_songs: filterByCategory(data.latest_video_songs, category),
      },
      isSignin: isLoggedin,
      hasError: false,
    }
  } catch (error) {
    console.log("erroe in axios.get:", error)
    return { posts: EMPTY_POSTS, isSignin: isLoggedin, hasError: true }
  }
}
