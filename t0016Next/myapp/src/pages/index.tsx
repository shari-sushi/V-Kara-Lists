import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllData, Vtuber, VtuberMovie } from '../types/singdata'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import YoutubePlayer from '../components/YoutubePlayer'
  type PostsAndCheckSignin= {
    posts: any; // anyは避けるべき？
    checkSignin: boolean;
  }

//分割代入？
// 型注釈IndexPage(posts: Post)
const AllDatePage: React.FC<PostsAndCheckSignin> = ({ posts, checkSignin }) =>  {
    // data1というステートを定義。streamerの配列を持つ。
    // setData1はステートを更新する関数。
const [vtubers, setData1] = useState<Vtuber[]>();
const [movies, setData2] = useState<VtuberMovie[]>();
//   const [check, setData3] = useState<boolean>();
//   const router = useRouter();

const extractVideoId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  if (match && match[1]) {
      return match[1];
  }
  return ''; 
};

const start = (60*6 + 29);

const [currentMovieId, setCurrentMovieId] = useState<string>("kORHSmXcYNc");
const handleMovieClick = (movieId: string) => {
  setCurrentMovieId(movieId);
};


    useEffect(() => {
        if (posts) {
            setData1(posts.vtubers); //上のsetData1の左の変数にposts.vtuberを代入(更新)
            setData2(posts.vtubers_and_movies);
                // setData3(checkSingin)
            console.log("checkSignin=", checkSignin)
        }
    }, [posts]);

  return (
    <div>
      <h1>TOP画面</h1>
        <h3>"推し"の"歌枠"の聴きたい"歌"を再生しよう。 <br />
        推しが歌った"歌"を一目で把握、布教しよう。
        </h3>
           {/*  ログイン機能のリンクボタン */}
            <Link href="/signup"><button style={{ background: 'brown' }}>
             会員登録</button>
            </Link>
            <Link href="/signin"><button style={{ background: 'brown' }}>       
                ログイン</button>    
            </Link>
            <Link href="/mypage"><button style={{ background: 'brown' }}>
                マイページ</button>
            </Link>
            <br />　　　　　↑ゲストログイン可能です <br />

            <YoutubePlayer videoId={currentMovieId}  start={start} />
            
        {/* 一覧表示 */}

        {/* 配信者一覧 */}
        <h2>★配信者</h2>
        <h2>{checkSignin}</h2>
        <Link href={`/create`} ><u>推し登録</u></Link>

      <table border={4} > 
        <thead>{/* ← tabeleのhead */}
           <tr>
            <td>ID</td>
            <td>推し</td>
            <td>読み</td>
            <td>紹介動画</td>
            <td>ｻｲﾄ内ﾘﾝｸ</td>
            <td>ｻｲﾄ内ﾘﾝｸ</td>
            {checkSignin && <td>編集</td>}
         </tr>
        </thead>
    
        <tbody>
        {vtubers && vtubers.map((vtubers, index) => (
        <tr key={index}>
         <td>{vtubers.VtuberId}</td>
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
      <Link href={`/create`} ><u>歌枠を登録</u></Link>
      <table border={4} >
        <thead>
           <tr>
            <td>配信者名</td>
            <td>動画名(ｻｲﾄ内ﾘﾝｸ：歌リスト一覧へ)</td>
            <td>外部ﾘﾝｸ</td>
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
                handleMovieClick(extractVideoId(movies.MovieUrl));
              }}>{movies.MovieTitle}</a></td>
            ) : (
              <td>未登録</td>
            )}
          {movies.MovieUrl ? (
               <td><a href={`https://${movies.MovieUrl}`} target="_blank" rel="noopener noreferrer">YouTubeへ</a></td>
            ) : (
              <td>未登録</td>
            )}
          {checkSignin && <td><Link href={`/edit?Unique_id=${movies.VtuberId}`}>編集</Link></td>}
            </tr>
            ))}
        </tbody>
      </table><br />

          {/*動画一覧  */}

    <h2>★歌</h2>
    <Link href={`/karaokerist/sings`} ><u>全歌一覧</u></Link> <br />
    <a> 実装予定：登録順に全件取得し、ページネーション、ページ番号をランダムに表示</a>
</div>
  )};

// オレオレ証明書対応のために、証明書を無視してる。
// 本番環境では変更が必要。
  export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; }) {
    //リクエストにCookieを入れる。    
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    let resData;
    try {
        const response = await axios.get('https://localhost:8080', {
          // 0019だとnullじゃないとサーバーが起動しない。undefinedはダメだとエラーが出る。
            httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
        });
        resData = response.data;
    } catch (error) {
        console.log("axios.getでerroe:", error)
    }

    // console.log("resData: ", resData)
    console.log("resData=", resData) //この時点では動画情報持ってる
    
    // Signinしていればtrueを返す
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find(cookie => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    var CheckSignin = false
    if(sessionToken){CheckSignin = true}

    console.log("checkSingin=", CheckSignin)

//    var Posts: PostsAndCheckSignin ;
//    Posts.checkSignin = CheckSignin ;
//    Posts. = resData ;

    return {
        props: {
            posts: resData, 
            checkSignin: CheckSignin
          }
    };
}
  
  export default AllDatePage;
  


//   **** memo ****

//      <DeleteButton Unique_id={item.streamer_id} /> 

// 各種リンク
            //  {item2.Movies ? ( <td>{item2.Movies'MovieId'}</td>
            //   ) : ( <td>未登録</td>      )}

            //  {item2.MovieUrl ? ( <td>{item2.MovieUrl}</td>
            //   ) : (<td>-</td>            )}
            // {item2.MovieTitle ? (  <td>{item2.MovieTitle}</td>
            //   ) : (<td>-</td>            )} 

// SSR化する前のコード
// function AllDatePage( posts : AllData)  {
//     // data1というステートを定義。streamerの配列を持つ。
//     // setData1はステートを更新する関数。
//   const [streamers, setData1] = useState<Streamer[]>();
//   const [streamerstoMovies, setData2] = useState<StreamerMovie[]>();
//   const router = useRouter();

//   useEffect(() => {  
//     async function fetchData() {
//         try {
//             const response = await fetch('https://localhost:8080');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//             const resData = await response.json();
//             setData1(resData.streamers);
//             setData2(resData.streamers_and_moviesmovies);
//         } catch (error) {
//             console.error("There was a problem with the fetch operation:", error);
//         }
//     }
//     fetchData();
// }, []);

//   return (