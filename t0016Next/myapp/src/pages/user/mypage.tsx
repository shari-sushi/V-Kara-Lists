import React, { useState } from "react"
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import Link from 'next/link';

import { domain } from '@/../env'
import { Layout } from "@/components/layout/Layout";
import type { ReceivedKaraoke, ReceivedVtuber, ReceivedMovie } from '../../types/vtuber_content'; //type{}で型情報のみインポート
import { VtuberTable } from '@/components/table/Vtuber'
import { MovieTable } from '@/components/table/Movie'
import { KaraokePagenatoinTable } from '@/components/table/Karaoke'
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer'
import { ExtractVideoId } from '@/components/Conversion'
import { ToClickTW } from '@/styles/tailwiind'

type Mypage = {
  data: {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[];
    vtubers_movies_u_created: ReceivedMovie[];
    vtubers_u_created: ReceivedVtuber[];
  },
  isSignin: boolean;
}

const MyPage = ({ data, isSignin }: Mypage) => {
  if (!isSignin) {
    return (
      <Layout pageName={"MyPage"} isSignin={isSignin}>
        <br />
        <>ログインが必要なコンテンツです</>
      </Layout>

    )
  };
  const vtubers = data.vtubers_u_created != null ? data.vtubers_u_created : [{} as ReceivedVtuber];
  const movies = data.vtubers_movies_u_created != null ? data.vtubers_movies_u_created : [{} as ReceivedMovie];
  const karaokes = data.vtubers_movies_karaokes_u_created != null ? data.vtubers_movies_karaokes_u_created : [{} as ReceivedKaraoke];
  const [currentMovieId, setCurrentMovieId] = useState<string>("E7x2TZ1_Ys4");
  const [start, setStart] = useState<number>((36 * 60 + 41))

  const handleMovieClickYouTube = (url: string, start: number) => {
    console.log("handleMovieClickYouTube")
    if (currentMovieId == ExtractVideoId(url)) {
      setStart(-1);
      setStart(start);
      console.log("同じ")
    } else {
      setCurrentMovieId(ExtractVideoId(url));
      setTimeout(function () {
        setStart(-1);
        setStart(start);
        console.log("別")
      }, 1300);
    }
  };
  const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

  return (
    <Layout pageName={"MyPage"} isSignin={isSignin}>
      <div>
        <YouTubePlayer videoId={currentMovieId} start={start} />
        <br />
        <div id="feature"
          className={`flex-col md:flex-row justify-center
                max-w-[1000px] w-full mx-auto inline-block
                top-0 p-1
                `}
        >
          <div className='mt-4 max-w-[1000px] '>
            <h2>自分の登録したデータ一覧</h2>
            {isSignin ? (
              <div>
                <h2>★配信者</h2>登録数{vtubers.length}
                <VtuberTable posts={vtubers} /><br />

                <h2>★歌枠(動画)</h2>登録数{movies.length}
                < MovieTable posts={movies} handleMovieClickYouTube={handleMovieClickYouTube} /><br />

                <h2>★歌</h2> 登録数{karaokes != null ? karaokes.length : 0}
                <KaraokePagenatoinTable
                  posts={karaokes}
                  handleMovieClickYouTube={handleMovieClickYouTube}
                  setSelectedPost={setSelectedPost}
                />
              </div>
            ) : (
              <div>
                自分で登録したデータが無いようです...TT
              </div>
            )}
            <br />
          </div>
          <span className={`w-auto`}>
            <Link href="/user/profile" className={`${ToClickTW.regular} w-auto`}>
              プロフィール
            </Link>
          </span>
        </div>
      </div>
    </Layout >
  );
}

export default MyPage;

/////////////////////////////////////////////////////////////////////////////
import { ContextType } from '@/types/server'

export async function getServerSideProps(context: ContextType) {
  const rawCookie = context.req.headers.cookie;

  // Cookieが複数ある場合に必要？
  // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
  const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
  let isSignin = false
  if (sessionToken) {
    isSignin = true
  }

  // サーバーの証明書が認証されない自己証明書でもHTTPSリクエストを継続する
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const options: AxiosRequestConfig = {
    headers: {
      'Cache-Control': 'no-store', //cache(キャッシュ)を無効にする様だが、必要性理解してない
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,  //HttpヘッダーにCookieを含める
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
  };

  try {
    const res = await axios.get(`${domain.backendHost}/users/mypage`, options);
    const resData = res.data;

    return {
      props: {
        data: resData,
        isSignin: isSignin,
      }
    }
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      data: null,
      isSignin: isSignin,
    }
  }
}