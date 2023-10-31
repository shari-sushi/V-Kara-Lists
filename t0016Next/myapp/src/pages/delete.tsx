import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';
import Router, { useEffect, useState } from 'react';
// import style from '../Youtube.module.css';
import type { AllJoinData, CrudDate, Vtuber, VtuberMovie, Movie, KaraokeList } from '../types/singdata'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios from 'axios';
import '@szhsin/react-menu/dist/index.css';
import {DropDownVt, DropDownMo, DropDownKa} from '../components/Dropdown';
import {YoutubePlayer} from '../components/YoutubePlayer'
import {ConversionTime, ExtractVideoId} from '../components/Conversion'

type TopPagePosts = {
//   alljoindata: AllJoinData[];
  vtubers: Vtuber[];
  movies: Movie[];
  karaokes: KaraokeList[];
  vtubers_and_movies: VtuberMovie[];
};
type AllDatePage= {
  posts:TopPagePosts;
  checkSignin: boolean;
}

export const AllDatePage = ({ posts, checkSignin }:AllDatePage) =>  {
const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
const [selectedMovie, setSelectedMovie] = useState<string>("");
const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
//↓デフォの選考基準；VTuber界での知名度〇、動画内の歌の上手さ△～〇、選曲△～〇、非オタから見た外見のきつくさ×～△。より適した動画が有れば変えたい。
const [foundMovie, setfoundMovie] =  useState<string>("kORHSmXcYNc");
const [foundKaraokeStart, setKaraokeStart] = useState<number>(0);

//プルダウンの選択時に埋め込みに反映するuseEffect 2つ
useEffect(() => {
  if (selectedVtuber && !selectedMovie){
    // setKaraokeStart(4)
  }
  if (selectedVtuber && selectedMovie){
    const foundMovie = posts.movies.find(movies => movies.MovieUrl === selectedMovie );
    // console.log("foundMovieUrl",foundMovie?.MovieUrl);
    if (foundMovie) {
      const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
      setfoundMovie(foundYoutubeId);
      setKaraokeStart(1)
    //   console.log("foundYoutubeId", foundYoutubeId)
    }
  }
}, [selectedVtuber, selectedMovie, posts.movies]);

useEffect(() => {
  if (selectedVtuber && selectedMovie && selectedKaraoke){
    const foundMovies = posts.karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie);
    const foundKaraoke = foundMovies.find(foundMovie => foundMovie.KaraokeListId === selectedKaraoke)
    // console.log("posts.karaokes", posts.karaokes) //karaoke_listsテーブルの全データをオブジェクトの配列で
    // console.log("foundMovies", foundMovies)     //どういつURLのオブジェクトの配列
    // console.log("foundKaraoke", foundKaraoke);  //karaokeの配列

    if (foundKaraoke) {
      const foundSingStart = ConversionTime(foundKaraoke.SingStart);
      setKaraokeStart(foundSingStart);
    //   console.log("foundSingStart", foundSingStart)
    }
  }
}, [selectedVtuber, selectedMovie, selectedKaraoke, posts.karaokes]);

// 親選択クリア時に子もクリアするuseEffect 2つ
useEffect(() => {
  if (!selectedVtuber){
    setSelectedMovie("")
    setSelectedKaraoke(0)
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
//   setSelectedKaraoke(0); //20231026 後付け　これがあると消えなくなる
};
  useEffect(() => {
    if (posts) {
    //   console.log("checkSignin=", checkSignin)
    }
  }, [posts]);

  return ( 
    <div>
        <h1>DB削除</h1>
        <DropDownVt
            posts={posts}
            onVtuberSelect={setSelectedVtuber}
            //onChangeにより、onVtuber~にoptiobn.valueが渡され、=setSelectedVtuberに。
            //setSe~V~はuseStateでselectedVtuberに値を渡す→DropDownMo2に渡る。
            onMovieClear={handleMovieClear}
            onKaraokeClear={handleVtuberClear}
        />
        <DropDownMo
            posts={posts}
            selectedVtuber={selectedVtuber}
            onMovieSelect={setSelectedMovie} //このファイルではstringになってる
            onKaraokeClear={handleMovieClear}
        />
        <DropDownKa
            posts={posts}
            selectedMovie={selectedMovie}
            onKaraokeSelect={setSelectedKaraoke}
        />
        <YoutubePlayer videoId={foundMovie}  start={foundKaraokeStart} />
        <Link href="/"><button>TOPへ</button></Link>   
        <Link href="/CrudAlmighty"><button>CrudAlmightyへ</button></Link>   
        <DeleteForm
            posts={posts}
            selectedVtuber={selectedVtuber}
            selectedMovie={selectedMovie}
            selectedKaraoke={selectedKaraoke}
        />
    </div>
  )};
///////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////
type selectedDate ={
    // alljoindata: AllJoinData[];
    posts:TopPagePosts;
    selectedVtuber:number;
    selectedMovie:string;
    selectedKaraoke:number;
}

export function DeleteForm({posts,selectedVtuber, selectedMovie, selectedKaraoke}:selectedDate) {
    const router = useRouter()
    var defaultValues:CrudDate = {
        VtuberId:  selectedVtuber,//入力不可とする
        VtuberName:"",
        VtuberKana:"",
        IntroMovieUrl:"",
        MovieUrl: "",
        MovieTitle: "",
        KaraokeListId: selectedKaraoke,//入力不可とする
        SingStart: "",
        SongName: "",    
    }

    const foundVtuber = posts?.vtubers.find(vtuber => vtuber.VtuberId === selectedVtuber);
    const foundMovie = posts?.movies.find(movie => movie.MovieUrl === selectedMovie);
    const foundMovies = posts.karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie); //movieの配列
    const foundKaraoke = foundMovies.find(foundMovie => foundMovie.KaraokeListId === selectedKaraoke)
    // console.log("selectedVtuber=", selectedVtuber)
    // console.log("selectedMovie=", selectedMovie)
    // console.log("selectedKaraoke",selectedKaraoke);
    // console.log("foundVtuber",foundVtuber);
    // console.log("foundMovie",foundMovie);
    // console.log("foundMovies",foundMovies);
    // console.log("foundKaraoke",foundKaraoke);
 
    const [crudContentType, setCrudContentType] = useState<string>("")

    type DeleteVtuber = {
        VtuberId:       number;
        VtuberName:     string|undefined;

    }
    type DeleteMovie = {
        VtuberId:       number|undefined;
        MovieUrl:       string;
    }
    type DeleteKaraoke = {
        MovieUrl:       string;
        KaraokeListId:  number;
        SongName:       string;
    }

    const [vtuberDataForFetch, setVtuberDataForFetch]=useState<DeleteVtuber>()
    const [movieDataForFetch, setMovieDataForFetch]=useState<DeleteMovie>()
    const [karaokeDataForFetch, setKaraokeDataForFetch]=useState<DeleteKaraoke>()
    console.log("vtuberDataForFetch=", vtuberDataForFetch, "\n movieDataForFetch=", movieDataForFetch, "\n karaokeDataForFetch", karaokeDataForFetch)
    const handleClick = () => {
        console.log("決定押下")
        console.log("choiceCrudType=", crudContentType, "\n selectedVtuber=",
             selectedVtuber, "\n selectedKaraoke", selectedKaraoke);
        if (crudContentType === "vtuber" && foundVtuber?.VtuberName){
                const  deleteVtuber:DeleteVtuber={
                    VtuberId:        selectedVtuber,        //deleteで必須
                    VtuberName:      foundVtuber.VtuberName,   //deleteで必須
                };
                setVtuberDataForFetch(deleteVtuber);
                console.log("vtuberDataForFetch=", vtuberDataForFetch)
            }else if (crudContentType === "movie" && foundMovie?.MovieUrl){
                // const VtuberId =selectedVtuber
                const deleteMovie:DeleteMovie={
                    VtuberId:       selectedVtuber,     //deleteで必須
                    MovieUrl:       foundMovie.MovieUrl,  //deleteで必須
                };
                setMovieDataForFetch(deleteMovie)
                console.log("movieDataForFetch", movieDataForFetch)
            }else if (crudContentType === "karaoke" && foundKaraoke?.SongName){
                const deleteKaraoke:DeleteKaraoke={
                    MovieUrl:       selectedMovie,      //deleteで必須
                    KaraokeListId:  selectedKaraoke,    //deleteで必須
                    SongName:       foundKaraoke.SongName,  //deleteで必須
                };
                setKaraokeDataForFetch(deleteKaraoke)
                console.log("karaokeDataForFetch=", karaokeDataForFetch)
                console.log("selectedMovie=", selectedMovie)
            } else {
                console.log("削除するデータの種類(vtuber, movie, karaoke)の選択、またはで想定外のエラーが発生しました。")
            }};;
    
    const httpsAgent = new https.Agent({rejectUnauthorized: false});
    useEffect(()=>{
        const fetchData = async () => {
            console.log("choiceCrudType=", crudContentType,"\n vtuberDataForFetch=", vtuberDataForFetch, 
            "\n movieDataForFetch=", movieDataForFetch, "\nkaraokeDataForFetch=", karaokeDataForFetch)
                if(vtuberDataForFetch || movieDataForFetch || karaokeDataForFetch){
                try {const response = await axios.delete(`https://localhost:8080/delete/${ crudContentType }`, {
                    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: vtuberDataForFetch || movieDataForFetch || karaokeDataForFetch
                });
                   
                    if (!response.status) { //「HTTPｽﾃｰﾀｽｺｰﾄﾞが200番台の時に!true
                        throw new Error(response.statusText);
                        //HTTPレスポンスのｽﾃｰﾀｽに応じてテキストを返す。404ならNot Founde
                    }
                } catch (error) {
                    console.error(error);
                    console.log("apiへアクセスを試みたものchatchした")
                }
            }
        };
        fetchData();
        // router.reload()
    }, [vtuberDataForFetch, movieDataForFetch, karaokeDataForFetch]);

    return (
        <div>
            削除するコンテンツを選択<br/>
            <button type="button" onClick={()=> setCrudContentType("vtuber")} >
                ＜VTuber＞</button>
            <button type="button" onClick={()=> setCrudContentType("movie")}>
                ＜歌枠動画＞</button>
            <button type="button" onClick={()=> setCrudContentType("karaoke")}>
                ＜歌＞</button>
            <br/><br/>
            {crudContentType === "vtuber" &&
                <div>
                 VTuber：{foundVtuber?.VtuberName}<br />
                &nbsp;&nbsp; の登録を削除しまか？
                </div>}
            {crudContentType === "movie" && 
                <div>
                 VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                 の<br/>
                歌枠動画：{foundMovie?.MovieTitle}
                を削除しますか？
                </div>}
            {crudContentType === "karaoke" &&
                <div>
                VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                歌枠動画：{foundMovie?.MovieTitle}<br/>
                の<br/>
                曲名：{foundKaraoke?.SongName}<br/>
                (再生時間：{foundKaraoke?.SingStart})<br/>
                &nbsp;&nbsp; の登録を削除します？
                </div>}<br/>
            {crudContentType &&
                <div>
                    <button onClick={handleClick} >決定</button>
                </div>}
            <br />  &nbsp;  &nbsp;  &nbsp;  &nbsp;
        </div>
    );
}