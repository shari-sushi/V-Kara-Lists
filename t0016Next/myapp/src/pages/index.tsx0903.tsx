import { useEffect, useState } from 'react';
import Link from 'next/link';
import YouTube from 'react-youtube';
import style from '../Youtube.module.css';
import type { AllData, Streamer, StreamerMovie } from '../types/singdata'; //type{}で型情報のみインポート
import DeleteButton from '../components/DeleteButton';
import { useRouter } from 'next/router';


// import { getAllCookies } from '../components/GetCookies';  //Cookiesのため

// const Example = () => {
//   const opts = {
//     height: '390',
//     width: '640',
//     playerVars: {
//       // https://developers.google.com/youtube/player_parameters
//       autoplay: 1,
//     },
//   };}

//分割代入？
// 型注釈IndexPage(posts: Post)
function AllDatePage( posts : AllData )  {

  // const [data, setData] = useState<AllColumnsData[]>([]);
  // const [data, setData] = useState<AllColumnsData>({ streamers: [], movies: [] });
  const [data1, setData1] = useState<Streamer[]>();
  const [data2, setData2] = useState<StreamerMovie[]>();

  const router = useRouter();

  useEffect(() => {  //useEffect:関数の実行タイミングをReactのレンダリング後まで遅らせるhook
    
    // //↓Cookiesのために書いた7行…
    // const cookie = getAllCookies();
    // const options: RequestInit = {
    //   headers: {
    //     cookie,
    //   },
    //   cache: "no-store",
    // };

    fetch('http://localhost:8080/')

      .then(response => response.json())
       
      .then(data => {
        console.log(data);
        setData1(data.streamers);
        setData2(data.streamers_and_moviesmovies);
      });
  }, []);

  return (

    <div>
      <h1>TOP画面</h1><br />
        <h3>"推し"の"歌枠"の聴きたい"歌"を再生しよう。 <br />
        推しが歌った"歌"を一目で把握、布教しよう。
        </h3><br />

        {/*  ログイン機能 */}
        <button onClick={() => router.push(`/member/login`)} style={{ background: 'brown' }}>
        ログイン</button>   &nbsp;
        <button onClick={() => router.push(`/member/signup`)} style={{ background: 'brown' }}>
        メンバー登録</button>
       <br />
       ↑ゲストログイン可能です
        
        <br /><br />

        {/* 一覧表示 */}
        {/* 配信者一覧 */}
        <h2>★配信者</h2>
        <Link href={`/create`} ><u>推し登録</u></Link>

      <table border={4} >
        <thead> {/* ← tabeleのhead */}
          <tr>
            <td>ID</td>
            <td>推し</td>
            <td>読み</td>
            <td>紹介動画</td>
            <td>リンク</td>
            <td>リンク</td>
            <td>編集</td>
          </tr>
        </thead>
    
        <tbody>
        {data1 && data1.map((item1, index) => (
       <tr key={index}>
         <td>{item1.StreamerId}</td>
         <td>{item1.StreamerName}</td>
         <td>{item1.NameKana}</td>
       
              {item1.SelfIntroUrl ? (
          <td><Link href={item1.SelfIntroUrl}>youtubeへ</Link></td>
        ) : (
          <td>未登録</td>
        )}

          <td><Link href={`/movie?streamer_id=${item1.StreamerId}`}>歌枠</Link></td>
          <td><Link href={`/sing?streamer_id=${item1.StreamerId}`}>歌</Link></td>
        
              {/* if (${item.self_intro_url} != undefined){
                return(
                <td><Link href={`${item.self_intro_url}`}>youtube</Link></td>
              ) else (
                return (
                <td>未登録</td>
              )
            } */}
              {/* http://localhost:3000/show?Unique_id=1　になった */}
              <td><Link href={`/edit?Unique_id=${item1.StreamerId}`}>編集</Link></td>
              {/* <td><Link href={`/posts/${item.streamer_id}`}>編集</Link></td> */}
              {/* <DeleteButton Unique_id={item.streamer_id} /> */}
            </tr>
            ))}
        </tbody>
      </table><br />

      {/*動画一覧  */}
      <h2>★動画</h2>
      <Link href={`/create`} ><u>歌枠を登録</u></Link>
      <table border={4} >
        <thead>
           <tr>
            <td>配信者名</td>
            <td>動画ID</td>
            <td>動画名(クリックで視聴)</td>
            <td>動画url</td>
            <td>編集</td>
          </tr>
        </thead>
        <tbody>
          {data2 && data2.map((item2, index) => (
            <tr key={index}>
              <td>{item2.StreamerName}</td>
              <td>{item2.MovieId}</td>        
              <td><Link href={`/sing?movie_url=${item2.MovieUrl}`}>{item2.MovieTitle}</Link></td>
              <td>{item2.MovieUrl}</td>

              {/* {item2.Movies ? ( <td>{item2.Movies'MovieId'}</td>
              ) : ( <td>未登録</td>      )}

             {item2.MovieUrl ? ( <td>{item2.MovieUrl}</td>
              ) : (<td>-</td>            )}
            {item2.MovieTitle ? (  <td>{item2.MovieTitle}</td>
              ) : (<td>-</td>            )} */}
 
              {/* http://localhost:3000/show?Unique_id=1　になった */}
              <td><Link href={`/posts/${item2.StreamerId}`}>編集</Link></td>
              {/* <DeleteButton Unique_id={item.streamer_id} /> */}
            </tr>
            ))}
        </tbody>
      </table><br />
    </div>
  )};

export default AllDatePage;