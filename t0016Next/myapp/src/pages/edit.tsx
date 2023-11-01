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
import {YoutubePlayer } from '../components/YoutubePlayer'
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
        <h1>DB編集</h1>
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
        <CreateForm
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

export function CreateForm({posts,selectedVtuber, selectedMovie, selectedKaraoke}:selectedDate) {
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

    // type  CrudDate:
    const foundVtuber = posts?.vtubers.find(vtuber => vtuber.VtuberId === selectedVtuber);
    const foundMovie = posts?.movies.find(movie => movie.MovieUrl === selectedMovie);
    const foundMovies = posts.karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie);
    const foundKaraoke = foundMovies.find(foundMovie => foundMovie.KaraokeListId === selectedKaraoke)
    console.log("selectedVtuber=", selectedVtuber)
    console.log("selectedMovie=", selectedMovie)
    console.log("selectedKaraoke",selectedKaraoke);
    console.log("foundVtuber",foundVtuber);
    console.log("foundMovie",foundMovie);
    console.log("foundMovies",foundMovies);
    console.log("foundKaraoke",foundKaraoke);

    const [vtuberNameInput, setVtuberNameInput] = useState(foundVtuber?.VtuberName);
    const [VtuberKanaInput, setVtuberKanaInput] = useState(foundVtuber?.VtuberKana);
    const [IntroMovieUrInput, setIntroMovieUrInput] = useState(foundVtuber?.IntroMovieUrl);
    const [MovieUrlInput, setMovieUrlInput] = useState(foundMovie?.MovieUrl);
    const [MovieTitleInput, setMovieTitleInput] = useState(foundMovie?.MovieTitle);
    const [SingStartInput, setSingStartInput] = useState(foundKaraoke?.SingStart);
    const [SongNameInput, setSongNameInput] = useState(foundKaraoke?.SongName);

    const [crudContentType, setCrudContentType] = useState<string>("")

    type EditVtuber = {
        VtuberId:       number;
        VtuberName:     string|null;
        VtuberKana :    string|null;
        IntroMovieUrl:  string | null;
    }
    type EditMovie = {
        VtuberId:       number;
        MovieTitle:     string|null;
        MovieUrl:       string;
    }
    type EditKaraoke = {
        MovieUrl:       string;
        KaraokeListId:  number;
        SongName:       string|null;
        SingStart:      string|null;
    }

    const axiosClient = axios.create({
        baseURL: "https://localhost:8080",
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const { register, handleSubmit, formState: { errors } , resetField} = useForm<CrudDate>();

    const onSubmit = async (CrudData:CrudDate) => {
        console.log("決定押下")
        console.log("CrudData", CrudData);
        console.log("choiceCrudType=", crudContentType, "\n selectedVtuber=",
             selectedVtuber, "\n selectedKaraoke", selectedKaraoke);
        if (crudContentType === "vtuber" && foundVtuber && selectedVtuber){
            try {
                const  reqBody:EditVtuber={
                    VtuberId:        selectedVtuber,    //変更不可
                    VtuberName:      CrudData.VtuberName || foundVtuber.VtuberName,
                    VtuberKana:      CrudData.VtuberKana || foundVtuber.VtuberKana,
                    IntroMovieUrl:   CrudData.IntroMovieUrl ||foundVtuber.IntroMovieUrl,
                };
                const response = await axiosClient.post("/edit/vtuber", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
                } catch (err) {
                    console.error(err);
                }
        }else if (crudContentType === "movie" && foundMovie && selectedMovie){
            try {
            // const VtuberId =selectedVtuber
            const reqBody:EditMovie={
                VtuberId:       selectedVtuber,                             //変更不可
                MovieTitle:     CrudData.MovieTitle || foundMovie?.MovieTitle,
                MovieUrl:       selectedMovie,  //変更不可
            };
            const response = await axiosClient.post("/edit/movie", reqBody);
            if (!response.status) {
                throw new Error(response.statusText);
            }
        } catch (err) {
        console.error(err);
        }
        }else if (crudContentType === "karaoke" && foundKaraoke && selectedMovie && selectedKaraoke){
            try{
                const reqBody:EditKaraoke={
                    MovieUrl:       selectedMovie,      //変更不可
                    KaraokeListId:  selectedKaraoke,    //変更不可
                    SongName:       CrudData.SongName || foundKaraoke?.SongName,
                    SingStart:      CrudData.SingStart || foundKaraoke?.SingStart,
                };
                const response = await axiosClient.post("/edit/karaoke", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
            console.log("selectedMovie=", selectedMovie)
        } else {
            console.log("編集するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。")
        }
    };;
    
    return(
        <div>
            <button type="button" onClick={()=> setCrudContentType("vtuber")} >
                ＜VTuberを編集＞</button>
            <button type="button" onClick={()=> setCrudContentType("movie")}>
                ＜歌枠動画を編集＞</button>
            <button type="button" onClick={()=> setCrudContentType("karaoke")}>
                ＜歌を編集＞</button>
            <br/><br/>
            {crudContentType === "vtuber" &&
                <div>
                VTuberを編集します。<br/>
                </div>}
            {crudContentType === "movie" && 
                <div>
                VTuber：{foundVtuber?.VtuberName}<br />
                &nbsp;&nbsp; の歌枠動画を編集します。
                </div>}
            {crudContentType === "karaoke" &&
                <div>
                VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                歌枠動画：{foundMovie?.MovieTitle}
               <br/>
                &nbsp;&nbsp; の歌と開始時間を編集します。
                </div>}<br/>
            <form onSubmit={handleSubmit(onSubmit)}>
                {crudContentType === "vtuber" &&
                <div>
                    空欄にした場合、既存データが維持されます<br/>
                    ★Vtuber: <br />
                        &nbsp;&nbsp;VTuber名:
                            <input {...register("VtuberName", { required: false })} placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                                // value={foundVtuber?.VtuberName}
                                onChange={e => setVtuberNameInput(e.target.value)}
                            /><br />               
                        &nbsp;&nbsp;読み(kana):
                            <input {...register("VtuberKana", { required: false })} placeholder={foundVtuber?.VtuberKana ||"例:imomochi_oimo"}
                                // value={foundVtuber?.VtuberKana}
                                onChange={e => setVtuberKanaInput(e.target.value)}
                                /><br />
                            {/* {errors.VtuberName && "Vtuber is required"} */}
                        &nbsp;&nbsp;紹介動画URL(時間指定可):
                            <input {...register("IntroMovieUrl", { required: false })} placeholder={foundVtuber?.IntroMovieUrl ||"例:www.youtube.com/watch?v=AlHRqSsF--8"}
                                // value={foundVtuber?.IntroMovieUrl || ""}
                                onChange={e => setIntroMovieUrInput(e.target.value)}
                                /><br />
                            {/* {errors.VtuberName && "Vtuber is required"} */}
                   </div>}
                      {crudContentType === "movie" &&
                <div>
                ★歌枠動画: <br/>
                    &nbsp;&nbsp;タイトル：
                        <input {...register("MovieTitle", { required: false })} placeholder={foundMovie?.MovieTitle ||"動画タイトル"}
                            // value={foundMovie?.MovieTitle || ""} 
                            onChange={e => setMovieTitleInput(e.target.value)}
                            /><br />
                        {/* {errors.MovieTitle && "Movie is required"} */}
                    &nbsp;&nbsp;URL:歌枠動画のURLの変更はできません。
                       <br />
                        {/* {errors.MovieUrl && "Url is required"} */}
                        </div>}
                {crudContentType === "karaoke" &&
                <div>
                ★歌: <br/>
                    &nbsp;&nbsp;曲名：
                        <input {...register("SongName", { required: false })} placeholder={foundKaraoke?.SongName ||"曲名"}
                            // value={foundKaraoke?.SongName || ""}
                            onChange={e => setSongNameInput(e.target.value)}
                            /><br />
                        {/* {errors.SongName && "Song is required"} */}
                    &nbsp;&nbsp;開始時間:
                        <input {...register("SingStart", { required: false })} placeholder={foundKaraoke?.SingStart ||"例 00:05:30"}
                            // value={foundKaraoke?.SingStart}
                            onChange={e => setSingStartInput(e.target.value)}
                        /><br />
                    {/* {errors.SingStart && "SingStart is required"} */}
                </div>}
                    {/* ※ページ最上部のリストから選択後、✖でクリアすることで、入力フォームを編集できるようになります。<br/> */}
                <button type="submit" >＜決定＞</button>   
            </form>
            <br />  &nbsp;  &nbsp;  &nbsp;  &nbsp;
        </div>
    );
}