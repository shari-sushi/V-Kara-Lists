import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllJoinData, Vtuber, VtuberMovie } from '../types/singdata'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import YoutubePlayer from '../components/YoutubePlayer'
import {ConversionTime, ExtractVideoId} from '../components/Conversion'

import App, {DataTable} from '../components/Table'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


  type PostsAndCheckSignin= {
    posts: any; // anyは避けるべき？
    checkSignin: boolean;
  }

  const columns = [
    {
      Header: "VTuber",
      accessor: "VtuberName"
    },
    {
      Header: "歌",
      accessor: "SongName"
    },
    {
      Header: "ページ内再生",
      accessor: "MovieUrl",
    }
  ];

const AllDatePage: React.FC<PostsAndCheckSignin> = ({ posts, checkSignin }) =>  {
const [start,setStart]=useState<number>(60*8+29) //60*25か60*47かなー, 60*7+59, 60*8+29
const [allJoinData, setAllJoinData]=useState<AllJoinData>();
const extractVideoId = (url: string): string => { //(変数:型):返値の型
  const match = url.match(/v=([^&]+)/);
  if (match && match[1]) {
      return match[1];
  }
  return ''; 
};

const [currentMovieId, setCurrentMovieId] = useState<string>("kORHSmXcYNc");
const handleMovieClick = (movieId: string) => {
  setCurrentMovieId(movieId);
};

  useEffect(() => {
      if (posts) {
          setAllJoinData(posts.alljoindata);
              // setData3(checkSingin)
          console.log("checkSignin=", checkSignin)
          console.log("posts.alljoindata=", posts.alljoindata)
      }
  }, [posts]);

  return (
    <div>
      <Link href={`/`} ><u>TOP</u></Link>
      {/* <App
        data={posts.alljoindata}
        columns={columns}
        handleMovieClick={handleMovieClick}
        ExtractVideoId={ExtractVideoId}
        setStart={setStart}
        start={start}/> */}
          {/*歌一覧  */}

    <h2>★歌</h2>
    {/* <h3>{posts}</h3> */}
    <Link href={`/karaokerist/sings`} ><u>全歌一覧</u></Link> <br />
    <br />
    <Link href={`/create`} ><u>歌を登録</u></Link>
    <DataTable
        data={posts.alljoindata}
        handleMovieClick={handleMovieClick} 
        ExtractVideoId={ExtractVideoId}
        ConversionTime={ConversionTime}
        setStart={setStart}    />
      <YoutubePlayer videoId={currentMovieId}  start={start} />
      <table border={4}>
        <thead>
           <tr>
            <td>配信者名</td>
            <td>歌</td>
            <td>youtubeへ</td>
          </tr>
        </thead>
        <tbody>
          {allJoinData && allJoinData.map((allJoinData, index) => (
            <tr key={index}>
          <td>{allJoinData.VtuberName}</td>
            {allJoinData.SongName ? (
               <td><a href="#" onClick={(e) => {
                e.preventDefault();
                handleMovieClick(ExtractVideoId(allJoinData.MovieUrl));
                setStart(ConversionTime(allJoinData.SingStart));
                console.log("start:",start)
              }}>{allJoinData.SongName}</a></td>
            ) : (
              <td>未登録</td>
            )}
          
          {allJoinData.MovieUrl ? (
               <td><a href={`https://${allJoinData.MovieUrl}`} target="_blank" rel="noopener noreferrer">YouTubeへ</a></td>
            ) : (
              <td>未登録</td>
            )}
            </tr>
            ))}
        </tbody>
      </table><br />
</div>
  )};

  export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; }) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    let resData;
    try {
        const response = await axios.get('https://localhost:8080', {
            httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
        });
        resData = response.data;
    } catch (error) {
        console.log("axios.getでerroe:", error)
    }

    console.log("resData=", resData) //この時点では動画情報持ってる
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find(cookie => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    var CheckSignin = false
    if(sessionToken){CheckSignin = true}
    console.log("checkSingin=", CheckSignin)

    return {
        props: {
            posts: resData, 
            checkSignin: CheckSignin
          }
    };
}
  
  export default AllDatePage;
