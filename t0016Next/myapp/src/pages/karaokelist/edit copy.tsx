import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllJoinData, Vtuber, VtuberMovie, Movie, KaraokeList } from '../../types/singdata'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import { useRouter } from 'next/router';
import https from 'https';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import {  Menu, MenuItem,  MenuButton, SubMenu} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

// import {DropDownVt, DropDownMo, DropDownKa} from '../../components/Dropdown';
import {DropDownVt2, DropDownMo2, DropDownKa2} from '../../components/TestDropdown';
import YouTube, { YouTubeProps } from 'react-youtube';

 

//分割代入？
// 型注釈IndexPage(posts: Post)
type TopPagePosts = {
  alljoindata: AllJoinData[];
  vtubers: Vtuber[];
  vtubers_and_movies: VtuberMovie[];
};
type AllDatePage= {
  posts:TopPagePosts;
  checkSignin: boolean;
}

const AllDatePage = ({ posts, checkSignin }:AllDatePage) =>  {
// const [vtubers, setData1] = useState<Vtuber[]>();
// const [movies, setData2] = useState<VtuberMovie[]>();
const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
const [selectedMovie, setSelectedMovie] = useState<string>("");
const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
console.log("selectedKaraoke",selectedKaraoke)
// console.log("posts.vtubers",posts.vtubers)
// console.log("posts.movies",posts.movies)
// console.log("posts.karaokes",posts.karaokes)

const handleMovieClear = () => {
  setSelectedMovie("");
  setSelectedKaraoke(0);
};
const handleVtuberClear = () => {
  setSelectedVtuber(0);
  handleMovieClear();
};
//   const router = useRouter();

  useEffect(() => {
    if (posts) {
      
      // setData1(posts.vtubers);
      // setData2(posts.vtubers_and_movies);
      // setData3(checkSingin)
      console.log("checkSignin=", checkSignin)
    }
  }, [posts]);//[]内の要素が変更されるたびにuseEffect内の処理が実行される。

  return ( 
    <div>
       {/* <DropDownVt onVtuberSelect={setSelectedVtuber}/>
       <DropDownMo
        selectedVtuber={selectedVtuber}
        onMovieSelect={setSelectedMovie}/>
       <DropDownKa
        selectedMovie={selectedMovie}
        onKaraokeSelect={setSelectedKaraoke}/> */}

        {/* 子へ 〇〇={}を渡している。子は引数に〇〇を分割代入することで受け取れる。 */}
      {/* <DropDownVt
        onVtuberSelect={setSelectedVtuber}
        onMovieClear={handleMovieClear}
        onKaraokeClear={handleVtuberClear} />
       <DropDownMo
        selectedVtuber={selectedVtuber}
        onMovieSelect={setSelectedMovie}
        onKaraokeClear={handleMovieClear} />
       <DropDownKa
        selectedMovie={selectedMovie}
        onKaraokeSelect={setSelectedKaraoke} /> */}

             {/* //// TestDropdown */}
      <DropDownVt2
       posts={posts}
        onVtuberSelect={setSelectedVtuber}
          //onChangeにより、onVtuber~にoptiobn.valueが渡され、=setSelectedVtuberに。
          //setSe~V~はuseStateでselectedVtuberに値を渡す→DropDownMo2に渡る。
        onMovieClear={handleMovieClear}
        onKaraokeClear={handleVtuberClear} />
       <DropDownMo2
       posts={posts}
        selectedVtuber={selectedVtuber}
        onMovieSelect={setSelectedMovie}
        onKaraokeClear={handleMovieClear} />
       <DropDownKa2
       posts={posts}
        selectedMovie={selectedMovie}
        onKaraokeSelect={setSelectedKaraoke} />
    
      <Link href="/"><button>TOPへ</button></Link>   
    </div>
  )};

  export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; }) { 
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    let resData;
    try {
        const response = await axios.get('https://localhost:8080/getalldate', {
          // 0019だとnullでサーバー起動、undefinedはダメだとエラーが出る。
            httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
        });
        resData = response.data;
    } catch (error) {
        console.log("axios.getでerroe:", error)
    }
    
    // Signinしていればtrueを返す
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    var CheckSignin = false
    if(sessionToken){CheckSignin = true}

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