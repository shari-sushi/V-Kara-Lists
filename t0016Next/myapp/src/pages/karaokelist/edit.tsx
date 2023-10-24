import { useEffect, useState } from 'react';
import Link from 'next/link';
// import style from '../Youtube.module.css';
import type { AllJoinData, Vtuber, VtuberMovie, Movie, KaraokeList } from '../../types/singdata'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
// import { useRouter } from 'next/router';
import https from 'https';
import axios from 'axios';
// import { AxiosRequestConfig } from 'axios';
// import {  Menu, MenuItem,  MenuButton, SubMenu} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
// import {DropDownVt, DropDownMo, DropDownKa} from '../../components/Dropdown';
import {DropDownVt2, DropDownMo2, DropDownKa2} from '../../components/TestDropdown';
// import YouTube, { YouTubeProps } from 'react-youtube';
import {YoutubePlaye} from '../../components/YoutubePlayer'
import {ConversionTime, ExtractVideoId} from '../../components/Conversion'



type TopPagePosts = {
  alljoindata: AllJoinData[];
  vtubers: Vtuber[];
  movies: Movie[];
  karaokes: KaraokeList[];
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
const [foundMovie, setfoundMovie] =  useState<string>("kORHSmXcYNc");
const [foundKaraokeStart, setKaraokeStart] = useState<number>(0);


console.log("posts.vtubers",posts.vtubers)
console.log("posts.movies",posts.movies)
console.log("posts.karaokes",posts.karaokes)
console.log("posts,alljoindata",posts.alljoindata)
console.log("selectedVtuber",selectedVtuber)
console.log("selectedMovie",selectedMovie)
console.log("selectedKaraoke",selectedKaraoke)
// const allJoin = posts.alljoindata

//プルダウンの選択時に埋め込みに反映するuseEffect 2つ
useEffect(() => {
  if (selectedVtuber && !selectedMovie){
    // setKaraokeStart(4)
  }
  if (selectedVtuber && selectedMovie){
    const foundMovie = posts.movies.find(movies => movies.MovieUrl === selectedMovie );
    console.log("foundMovieUrl",foundMovie?.MovieUrl);
    if (foundMovie) {
      const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
      setfoundMovie(foundYoutubeId);
      setKaraokeStart(1)
      console.log("foundYoutubeId", foundYoutubeId)
    }
  }
}, [selectedVtuber, selectedMovie, posts.movies]);
useEffect(() => {
  if (selectedVtuber && selectedMovie && selectedKaraoke){
    const foundKaraoke = posts.karaokes.find(karaokes => karaokes.MovieUrl === selectedMovie && karaokes.SongName === selectedKaraoke.label);
    console.log("foundKaraoke",foundKaraoke?.SingStart);
    if (foundKaraoke) {
      const foundSingStart = ConversionTime(foundKaraoke.SingStart);
      setKaraokeStart(foundSingStart);
      console.log("foundSingStart", foundSingStart)
    }
  }
}, [selectedVtuber, selectedMovie, selectedKaraoke, posts.karaokes]);

// 親選択クリア時に子もクリアするuseEffect 2つ
useEffect(() => {
  if (!selectedVtuber){
    setSelectedMovie("")
    setSelectedKaraoke(0)
    console.log("動いてはいる")
  }
},[selectedVtuber, selectedMovie, selectedKaraoke]);
const handleMovieClear = () => {
  setSelectedMovie("");
  setSelectedKaraoke(0);
  // console.log('isClearable value:', props.isClearable);
};
const handleVtuberClear = () => {
  setSelectedVtuber(0);
  handleMovieClear();
};
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
        onKaraokeSelect={setSelectedKaraoke}
        />
    
    <YoutubePlayer videoId={foundMovie}  start={foundKaraokeStart} />
 

    
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