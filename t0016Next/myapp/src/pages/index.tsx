import { domain } from '@/../env'
import React, { useState } from 'react';
import Link from 'next/link';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import style from '@/Youtube.module.css';
import styles from '@/styles/Home.module.css'
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import { YouTubePlayer } from '@/components/YoutubePlayer'
import { ExtractVideoId } from '@/components/Conversion'
import { Header } from '../components/layout/Layout'
import { VtuberTable } from '@/components/table/Vtuber'
import { MovieTable } from '@/components/table/Movie'
import { RandamTable } from '@/components/table/Karaoke'

type TopPage = {
  posts: {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
  };
  checkSignin: boolean;
}

export const YouTubePlayerContext = React.createContext({} as {
  currentMovieId: string
  setCurrentMovieId: React.Dispatch<React.SetStateAction<string>>
  start: number
  setStart: React.Dispatch<React.SetStateAction<number>>
  handleMovieClickYouTube(movieId: string, time: number): void
})

const TopPage = ({ posts, checkSignin }: TopPage) => {
  const vtubers = posts?.vtubers;
  const movies = posts?.vtubers_movies;
  const karaokes = posts?.vtubers_movies_karaokes;
  const [start, setStart] = useState<number>((36 * 60 + 41))
  const [currentMovieId, setCurrentMovieId] = useState<string>("E7x2TZ1_Ys4");
  //qFVhnuIBGiQなら60*25か60*47かなー, 60*7+59, 60*8+29
  // E7x2TZ1_Ys4 なら43*60,36*60+34

  const handleMovieClickYouTube = (url: string, start: number) => {
    // setCurrentMovieId(ExtractVideoId(url));
    // setStart(start);
    console.log("handleMovieClickYouTube")
    if (currentMovieId == ExtractVideoId(url)) {
      setStart(-1);
      setStart(start);
      console.log("同じ")
    } else {
      setCurrentMovieId(ExtractVideoId(url));
      // setStart(start);
      //以下をonReady発火させられれば、ユーザー環境による差を少なくできる気がする
      setTimeout(function () {
        setStart(-1);
        setStart(start);
        console.log("別")
      }, 1300); //local環境で、1100ms 高確率で✖, 1300ms:✖が少なくない //短すぎるとエラーになる注意
    }
  };

  return (
    <div>
      <Header pageName="TOP" checkSignin={checkSignin}>
        <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube, currentMovieId, setCurrentMovieId, start, setStart }}>
          <div>
            <a>{checkSignin && "ログイン中" || '非ログイン中'}</a><br />
            <br />
            <a>videoId= {currentMovieId}, start= {start}秒 = {Math.floor(start / 60)}分 {Math.floor(start % 60)}秒</a >
            <br /><br />

            <h1>{"V-kara (VTuber-karaoke-Lists)"} </h1>
            <h3>
              {"「推し」の「歌枠」の聴きたい「歌」"}<br />
              {"「ぱっと把握」、「さっと再生」、「ばばっと布教」"}<br />
            </h3><br />
            <YouTubePlayer videoId={currentMovieId} start={start} />

            {/* <YouTubePlayer videoId={currentMovieId} start={start} /> */}
            {"！注意！　 動画ごとの音量差　個人→大手の音量差　！注意！"}
            <br /><br />

            <h2>★配信者</h2>
            <VtuberTable posts={vtubers}></VtuberTable><br />

            <h2>★歌枠(動画)</h2>
            <MovieTable posts={movies} /><br />

            <h2>★歌</h2>
            <Link href={`/karaoke/sings`} ><u>全歌一覧へ</u></Link> <br />
            <RandamTable posts={karaokes} />

          </div >
        </YouTubePlayerContext.Provider>
      </Header>

    </div >

  )
};

type ContextType = {
  req: { headers: { cookie?: string; }; };
  res: {
    writeHead: (statusCode: number, headers: Record<string, string>) => void;
    end: () => void;
  };
};

export async function getServerSideProps(context: ContextType) {
  const rawCookie = context.req.headers.cookie;
  const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
  console.log("sessionToken", sessionToken)
  var checkSignin = false
  if (sessionToken) {
    checkSignin = true
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

  let resData = null;
  try {
    const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
    resData = res.data;
  } catch (error) {
    console.log("erroe in axios.get:", error);
  }
  return {
    props: {
      posts: resData,
      checkSignin: checkSignin,
    }
  }
}

export default TopPage;