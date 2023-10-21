import { useEffect, useState, StrictMode } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllJoinData, Vtuber, VtuberMovie } from '../../types/singdata'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import YoutubePlayer from '../../components/YoutubePlayer'
import {ConversionTime, ExtractVideoId} from '../../components/Conversion'
import { DataTablePageNation } from '../../components/Table'
import { createRoot } from 'react-dom/client';
import {Checkbox} from '../../components/SomeFunction';
import { CellProps } from 'react-table';


  type PostsAndCheckSignin= {
    posts: any; // anyは避けるべき？
    checkSignin: boolean;
  }

// const AllDatePage: React.FC<PostsAndCheckSignin> = ({ posts, checkSignin }) =>  {　//どっちが良いんだ
const AllDatePage = ({ posts, checkSignin }:PostsAndCheckSignin) =>  {
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
const [isRandomOrAll, setIsRandomOrAll] = useState(true);
const pageSize = 6

type Column = {
  Header: string;
  accessor: string;
  Cell?: (cell: CellProps<any, any>) => React.ReactElement;
};
const columns:Column = [
  {Header: "VTuber", accessor: "VtuberName"},
  {Header: "歌",     accessor: "SongName",
    Cell: (cell: { row: { original: any; }; }) => { //どっちが良いんだ…
    // Cell: (cell: CellProps<any,any>) => { 
      const item = cell.row.original;
      return (
        <a href="#" onClick={(e) => {
          e.preventDefault();
          console.log("item.MovieUrl", item.MovieUrl);
          handleMovieClick(ExtractVideoId(item.MovieUrl));
          setStart(ConversionTime(item.SingStart));
        }}>
          {item.SongName}
        </a>
      )
    }
  },
  {Header: "外部リンク", accessor: "MovieUrl",
  Cell: (cell: CellProps<any,any>) => {
    const item = cell.row.original;
    return (
      <a href="#" onClick={(e) => {
        e.preventDefault();
        console.log("item.MovieUrl", item.MovieUrl);
        handleMovieClick(ExtractVideoId(item.MovieUrl));
        setStart(ConversionTime(item.SingStart));
      }}>
        YouYubeへ
      </a>
    )
  }

  }
];


  useEffect(() => {
      if (posts) {
          setAllJoinData(posts.alljoindata);
              // setData3(checkSingin)
          // console.log("checkSignin= 62", checkSignin)
          console.log("posts.alljoindata= 63", posts.alljoindata)
      }
  }, [posts]);

  console.log("data:", posts.alljoindata)

  return (
    <div>
      <Link href={`/`} ><u>TOP</u></Link>
    <h2>★歌</h2>
    <Link href={`/create`} ><u>歌を登録</u></Link>
      <YoutubePlayer videoId={currentMovieId}  start={start} />
    <Checkbox checked={isRandomOrAll}
    onChange={() => setIsRandomOrAll((state) => !state)} >：10件ずつ表示⇔全件表示</Checkbox>

    {isRandomOrAll &&
      <DataTablePageNation
      columns={columns}
      data={posts.alljoindata}
      pageSize={pageSize}/>
    }
    {!isRandomOrAll &&
      <table border={4}>
        <thead>
           <tr>
            <td>配信者名</td>
            <td>歌</td>
            <td>youtubeへ</td>
          </tr>
        </thead>
        <tbody>
          {allJoinData && allJoinData.map((allJoinData:AllJoinData, index) => (
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
      </table>
    }<br />
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
    const sessionToken = rawCookie?.split(';').find((cookie:string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
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
