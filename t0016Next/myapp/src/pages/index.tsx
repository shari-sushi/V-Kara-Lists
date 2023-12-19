import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke, VtuberId } from '../types/vtuber_content'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import { YoutubePlayer, YoutubePlayListPlayer } from '../components/YoutubePlayer'
import { ConversionTime, ExtractVideoId } from '../components/Conversion'
// import { RandamTable } from '../components/Table'
import { domain } from '../../env'
import { AxiosRequestConfig } from 'axios';
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

type TopPage = {
  posts: {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
  };
  checkSignin: boolean;
}

//分割代入？
// 型注釈IndexPage(posts: Post)
const TopPage = ({ posts, checkSignin }: TopPage) => {
  console.log("CheckSignin", checkSignin)
  console.log("posts= ", posts)
  // data1というステートを定義。streamerの配列を持つ。
  const vtubers = posts?.vtubers;
  const movies = posts?.vtubers_movies;
  const karaokes = posts?.vtubers_movies_karaokes;
  const [start, setStart] = useState<number>((36 * 60 + 41))
  //qFVhnuIBGiQなら60*25か60*47かなー, 60*7+59, 60*8+29
  // E7x2TZ1_Ys4 なら43*60,36*60+34
  const [currentMovieId, setCurrentMovieId] = useState<string>("E7x2TZ1_Ys4");
  const handleMovieClick = (movieId: string) => {
    setCurrentMovieId(movieId);
  };

  // const handleLikeToggle = async (vtuberId: VtuberId, isFav: boolean) => {
  //   // サーバーにいいねの状態をトグルするためのリクエストを送信
  //   try {
  //     const response = await fetch(`/api/like-toggle/${vtuberId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ isFav: !isFav }),
  //     });
  // 
  //     if (response.ok) {
  //       // いいねの状態が正常に更新された場合、画面上のデータも更新
  //       const updatedVtubers = vtubers.map((v) =>
  //         v.VtuberId === vtuberId ? { ...v, IsFav: !isFav, Count: isFav ? v.Count - 1 : v.Count + 1 } : v
  //       );
  //       setVtubers(updatedVtubers);
  //     } else {
  //       console.error("いいねの切り替えに失敗しました。");
  //     }
  //   } catch (error) {
  //     console.error("ネットワークエラー:", error);
  //   }
  // };
  //   <td>
  //   <button onClick={() => handleLikeToggle(vtubers.VtuberId, vtubers.IsFav)}>
  //     {vtubers.IsFav ? "解除" : "いいね"}
  //   </button>
  // </td>
  // {vtubers.IsFav ? (
  //   <td>{vtubers.Count + 1}</td>
  // ) : (
  //   <td>{vtubers.Count}</td>
  // )}


  return (
    <div>
      <Layout pageName="TOP">
        <div>
          <h1>V-kara (VTuber-karaoke-Lists) </h1>
          <h3>「推し」の「歌枠」の聴きたい「歌」<br />
            「ぱっと把握」、「さっと再生」、「ばばっと布教」<br /><br />
            VTuberご本人様も歌った歌の把握や聞き返しにいかがでしょう。
          </h3>
          <YoutubePlayer videoId={currentMovieId} start={start} />

          ！注意！Vtuber様や動画により音量差があります。 <br />
          ！注意！特に、個人→大手の切り替え時に爆音となる傾向があります。

          <br />
          <Link href={`/create`} ><u>データ登録ページへ</u></Link>

          {/* 配信者一覧 */}
          <h2>★配信者</h2>
          <h2>{checkSignin}</h2>

          <table border={4} >
            <thead>{/* ← tabeleのhead */}
              <tr>
                <td>お名前</td>
                <td>読み</td>
                <td>紹介動画</td>
                <td>ｻｲﾄ内</td>
                <td>ｻｲﾄ内</td>
                {/* <td>いいね</td> */}
                {checkSignin && <td>編集</td>}
              </tr>
            </thead>

            <tbody>
              {vtubers && vtubers.map((vtubers, index) => (
                <tr key={index}>
                  <td>{vtubers.VtuberName}</td>
                  <td>{vtubers.VtuberKana}</td>
                  {vtubers.IntroMovieUrl ? (
                    <td><a href={`https://${vtubers.IntroMovieUrl}`} target="_blank" rel="noopener noreferrer">youtubeへ</a></td>
                  ) : (
                    <td>未登録</td>
                  )}
                  <td><Link href={`/movie?streamer_id=${vtubers.VtuberId}`}>歌枠</Link></td>
                  <td><Link href={`/sing?streamer_id=${vtubers.VtuberId}`}>歌</Link></td>
                  {checkSignin && <td><Link href={`/karaokelist/edit?Unique_id=${vtubers.VtuberId}`}>編集</Link></td>}
                </tr>
              ))}
            </tbody>
          </table>

          {/*動画一覧  */}
          <h2>★歌枠(動画)</h2>
          <table border={4} >
            <thead>
              <tr>
                <td>配信者名</td>
                <td>動画名(ｻｲﾄ内ﾘﾝｸ：歌リスト一覧へ)</td>
                <td>外部ﾘﾝｸ</td>
                <td>いいね</td>
                {checkSignin && <td>編集</td>}
              </tr>
            </thead>
            <tbody>
              {movies && movies.map((movies, index) => (
                <tr key={index}>
                  <td>{movies.VtuberName}</td>
                  {movies.MovieUrl ? (
                    <td><a href="#" onClick={(e) => {
                      e.preventDefault();
                      handleMovieClick(ExtractVideoId(movies.MovieUrl));
                      setStart(1);
                      console.log("start:", start)
                    }}>{movies.MovieTitle}</a></td>
                  ) : (
                    <td>未登録</td>
                  )}
                  {movies.MovieUrl ? (
                    <td><a href={`https://${movies.MovieUrl}`} target="_blank" rel="noopener noreferrer">YouTubeへ</a></td>
                  ) : (
                    <td>未登録</td>
                  )}
                  {movies.IsFav && <td>{movies.Count + 1}</td> || <td>{movies.Count || 0}</td>}
                  {checkSignin && <td><Link href={`/edit?Unique_id=${movies.VtuberId}`}>編集</Link></td>}
                </tr>
              ))}
            </tbody>
          </table><br />

          {/*歌一覧  */}

          <h2>★歌</h2>
          <Link href={`/karaokelist/sings`} ><u>全歌一覧</u></Link>
          {/* <RandamTable
        data={karaokes}
        handleMovieClick={handleMovieClick}
        setStart={setStart}
      /> */}
        </div >
      </Layout>

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
    return {
      props: {
        posts: resData,
        checkSignin: checkSignin,
      }
    };
  }
  console.log("---------------------------------\n", checkSignin)
  return {
    props: {
      posts: resData,
      checkSignin: checkSignin,
    }
  }
}

export default TopPage;