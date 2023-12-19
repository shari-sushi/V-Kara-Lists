import { useEffect, useState, StrictMode } from 'react';
import Link from 'next/link';
import style from '../../style/Youtube.module.css';
import type { ReceivedKaraoke, ReceivedVtuber, ReceivedMovie } from '../../types/vtuber_content'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import { YoutubePlayer } from '../../components/YoutubePlayer'
import { ConversionTime, ExtractVideoId } from '../../components/Conversion'
import { createRoot } from 'react-dom/client';
import { Checkbox } from '../../components/SomeFunction';
import { KaraokeTable } from '../../components/Table';
import { CellProps } from 'react-table';
import { domain } from '../../../env'
import { AxiosRequestConfig } from 'axios';
import Layout from '../../components/Layout'


type PostsAndCheckSignin = {
  posts: { vtubers_movies_karaokes: ReceivedKaraoke[] };
  checkSignin: boolean;
}

// const AllDatePage: React.FC<PostsAndCheckSignin> = ({ posts, checkSignin }) =>  {　//どっちが良いんだ
const AllDatePage = ({ posts, checkSignin }: PostsAndCheckSignin) => {
  // const [start, setStart] = useState<number>(60 * 8 + 29) //60*25か60*47かなー, 60*7+59, 60*8+29
  // const [karaoke, setReceivedKaraoke] = useState<ReceivedKaraoke[]>();
  const karaokes = posts.vtubers_movies_karaokes
  // const [currentMovieId, setCurrentMovieId] = useState<string>("kORHSmXcYNc");
  // const handleMovieClick = (movieId: string) => {
  //   setCurrentMovieId(movieId);
  // };
  // const [isRandomOrAll, setIsRandomOrAll] = useState(true);
  // const pageSize = 15

  type Column = {
    Header: string;
    accessor: string;
    Cell?: (cell: CellProps<any, any>) => React.ReactElement;
  };

  console.log(karaokes)

  return (
    <Layout pageName="Sings">
      <div>
        <Link href={`/`} ><u>TOP</u></Link><br />
        <Link href={`/create`} ><u>歌を登録</u></Link>
        {/* <YoutubePlayer videoId={currentMovieId} start={start} />
        <Checkbox checked={isRandomOrAll}
          onChange={() => setIsRandomOrAll((state) => !state)} >：{pageSize}件ずつ表示⇔全件表示(全{karaokes?.length}歌)</Checkbox> */}

        <KaraokeTable data={karaokes} />
        {/* {isRandomOrAll &&
      <DataTablePageNation
      columns={columns}
      data={posts.alljoindata}
      pageSize={pageSize}/>
    } */}
        {/* {!isRandomOrAll &&
          <table border={4}>
            <thead>
              <tr>
                <td>配信者名</td>
                <td>歌</td>
                <td>youtubeへ</td>
              </tr>
            </thead>
            <tbody>
              {karaokes && karaokes.map((karaokes: ReceivedKaraoke, index) => (
                <tr key={index}>
                  <td>{karaokes.VtuberName}</td>
                  {karaokes.SongName ? (
                    <td><a href="#" onClick={(e) => {
                      e.preventDefault();
                      handleMovieClick(ExtractVideoId(karaokes.MovieUrl));
                      setStart(ConversionTime(karaokes.SingStart));
                      console.log("start:", start)
                    }}>{karaokes.SongName}</a></td>
                  ) : (
                    <td>未登録</td>
                  )}
                  {karaokes.MovieUrl ? (
                    <td><a href={`https://${karaokes.MovieUrl}`} target="_blank" rel="noopener noreferrer">YouTubeへ</a></td>
                  ) : (
                    <td>未登録</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        }<br /> */}
      </div>
    </Layout>
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
    const res = await axios.get(`${domain.backendHost}/vcontents/sings`, options);
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
export default AllDatePage;
