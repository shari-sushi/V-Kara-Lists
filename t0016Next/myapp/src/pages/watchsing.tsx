import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import YouTube from 'react-youtube';
import DeleteButton from '../components/DeleteButton';
import type { AllData, Streamer, StreamerMovie } from '../types/singdata'; //type{}で型情報のみインポート


export default function ShowPage( posts : AllData ) {
  const [data, setData] = useState(null);
      //dataというstate(状態)を定義、初期値をpostとした。setDataで更新できる
  const [prevSong, setPrevSong] = useState(null);
  const [nextSong, setNextSong] = useState(null);
  const router = useRouter();
    //現在のルーティング(url)を取得。
  const { movie_url } = router.query;
    //routerからUnique_idを取得
   // console.log("router.queryしたid=", Unique_id);  →ここだとundefinedになる

  useEffect(() => {
    if (movie_url) { //idが定義されている場合に処理
      console.log("Fetching data for movie_url=", movie_url);
      fetch(`http://localhost:8080/sing?movie_url=${movie_url}`)
      .then(response => response.json())
       
      .then(data => {
        console.log(data);
        setData(data.karaoke_lists);
        // setPrevSong(Number(data.SingId) - 1);
        // setNextSong(Number(data.sing_id) + 1);
          //number型を期待させてる
        });
        // console.log("id=", Unique_id)
    }
  }, [movie_url]);
  
   if (!data) {
    // const time = data.singStart;
    return <div>Loading...show page</div>;
    }

    // const YouTubeComponent = () => {
    // // urlがliveの時
    // if (data.url.split("/")[3] == "live" ){
    //   return <YouTube videoId={data.url.split("/")[4]} />;
    //   //  YouTube タグのvideoIdは動画IDのみが欲しい
    //   // ~.split("v=")[1] ：　~をv=で分割して2つ目(インデックス[1])を取得
    // }else{
    // // urlがwatchの時              ※※※未テスト※※※
    //   return <YouTube videoId={data.url.split("v=")[1]}
    //    />;
    // }};
    // console.log(YouTubeComponent());

    // const YouTubeComponent = () => {
    //   const videoId = data.url.split('v=')[1]; // Extract video ID from URL
    //   const startTime = convertTimeToSeconds(data.singStart); // Convert start time to seconds (if necessary)
    //   return <YouTube videoId={videoId} opts={{ playerVars: { start: startTime } }} />;
    // } 

  return (
    <div>
      <h2>歌情報詳細</h2>
      <ul>
        <a>配信者名　　　　：</a>{data.StreamerName}<br />
        <a>歌ID　　　　：</a>{data.unique_id}<br />
        <a>動画タイトル ：</a>{data.movie} <br />
        <a>動画URL　　 ：</a>{data.url}<br />
        <a>歌い出し　　：</a>{data.singStart}<br />
        <a>曲名　　　　：</a>{data.song}<br />
        {/* <YouTubeComponent /> */}
        
        {prevSong > 0 && <Link href={`/show?Unique_id=${prevSong}`}><u>前の曲</u></Link>}<br />
        <Link href={`/show?Unique_id=${nextSong}`}><u>次の曲</u></Link><br />
          <br />
        
        {/* <YouTubeComponent/> */}
        <Link href={`${data.url}&t=${data.singStart}`} ><u>YouTubeへ</u></Link>
        {` ← ${data.url}&t=${data.singStart}`}<br />
      
      <button onClick={() => router.push(`/`)} style={{ background: 'blue' }}>
        戻る</button> &nbsp;
      <button onClick={() => router.push(`/edit?Unique_id=${data.unique_id}`)} style={{ background: 'blue' }}>
        編集</button>
        <DeleteButton Unique_id={movie_url} />

       </ul>
       {/* デザインはcssにまとめること */}
    </div>
  );
}



// https://www.youtube.com/live/AlHRqSsF--8&t=51:08 ✖
// https://www.youtube.com/live/AlHRqSsF--8&t=3068s　✖
// https://www.youtube.com/watch?v=AlHRqSsF--8&t=3068s　〇
// https://www.youtube.com/watch?v=AlHRqSsF--8&t=51:08　✖
// →liveで時間指定できない→qsl側変更、また、登録時に注意喚起が必要（呼び出し時に自動変換する？）
// 時間は秒に変換する必要アリ