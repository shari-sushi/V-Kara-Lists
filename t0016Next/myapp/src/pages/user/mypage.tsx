// import isLoggedIn from "../lib/auth"
import React, { useEffect, useState } from "react"
import type { User } from "../../types/user"
import { useRouter } from "next/router";
import Link from 'next/link';
// import { getAllCookies } from "../lib/getallcookie";
import https from 'https';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { GetLogout, Withdraw } from '../../components/authButton';
import { domain } from '../../../env'
import { Header } from "@/components/layout/Layout";
import type { ReceivedKaraoke, ReceivedVtuber, ReceivedMovie } from '../../types/vtuber_content'; //type{}で型情報のみインポート
import { VtuberTable } from '@/components/table/Vtuber'
import { MovieTable } from '@/components/table/Movie'
import { KaraokePagenatoinTable } from '@/components/table/Karaoke'
import { YouTubePlayer } from '@/components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'


export const YouTubePlayerContext = React.createContext({} as {
  currentMovieId: string
  setCurrentMovieId: React.Dispatch<React.SetStateAction<string>>
  start: number
  setStart: React.Dispatch<React.SetStateAction<number>>
  handleMovieClickYouTube(movieId: string, time: number): void
})
type Mypage = {
  data: {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[];
    vtubers_movies_u_created: ReceivedMovie[];
    vtubers_u_created: ReceivedVtuber[];
  },
  isSignin: boolean;
}

const MyPage = ({ data, isSignin }: Mypage) => {
  const vtubers = data.vtubers_u_created || {}
  const movies = data.vtubers_movies_u_created || {}
  const karaokes = data.vtubers_movies_karaokes_u_created || {}
  const [currentMovieId, setCurrentMovieId] = useState<string>("E7x2TZ1_Ys4");
  const [start, setStart] = useState<number>((36 * 60 + 41))

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
    <Header pageName={MyPage} checkSignin={isSignin}>
      <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube, currentMovieId, setCurrentMovieId, start, setStart }}>
        <div>
          <YouTubePlayer videoId={currentMovieId} start={start} />
          <br />

          <h2>自分の登録したデータ一覧</h2>
          {isSignin ? (
            <>
              <h2>★配信者</h2>登録数{vtubers.length}
              <VtuberTable posts={vtubers} /><br />

              <h2>★歌枠(動画)</h2>登録数{movies.length}
              < MovieTable posts={movies} /><br />

              <h2>★歌</h2> 登録数{karaokes.length}
              <KaraokePagenatoinTable posts={karaokes} />
            </>

          ) : (
            <div>
              自分で登録したデータが無いようです...TT
            </div>
          )}
          <br />
        </div>
      </YouTubePlayerContext.Provider>
    </Header>
  );
}

export default MyPage;


type ContextType = {
  req: { headers: { cookie?: string; }; };
  res: {
    writeHead: (statusCode: number, headers: Record<string, string>) => void;
    end: () => void;
  };
};

export async function getServerSideProps(context: ContextType) {
  const rawCookie = context.req.headers.cookie;
  console.log("rawCookie=", rawCookie, "\n")
  var isSignin = false

  // Cookieが複数ある場合に必要？
  // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
  const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];

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
    const res = await axios.get(`${domain.backendHost}/users/mypage`, options);
    resData = res.data;
    console.log()
    isSignin = true
  } catch (error) {
    console.log("erroe in axios.get:", error);
    // return {
    //   props: {
    //     listener: resData,
    //     checkAuth: isSignin,
    //   }
    // };
  }
  return {
    props: {
      data: resData,
      isSignin: isSignin,
    }
  }
}