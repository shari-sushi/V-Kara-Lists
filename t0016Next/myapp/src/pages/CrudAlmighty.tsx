// このページは基本的に変更不要。
// ページごとコピーして他のCRUDに利用すること。
// ただし、テンプレみたいなものなので、このままでは多分バグる。
// 詳細確認すること。


import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import style from '../Youtube.module.css';
import type { AllJoinData, CrudDate, Vtuber, VtuberMovie, Movie, KaraokeList } from '../types/singdata'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios from 'axios';
import '@szhsin/react-menu/dist/index.css';
import {DropDownVt, DropDownMo, DropDownKa} from '../components/Dropdown';
import YoutubePlayer from '../components/YoutubePlayer'
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
        <Link href="/create"><button>crudへ</button></Link>   
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
    console.log("foundKaraoke",foundKaraoke);
    console.log("selectedKaraoke",selectedKaraoke);

    const [vtuberNameInput, setVtuberNameInput] = useState(foundVtuber?.VtuberName);
    const [VtuberKanaInput, setVtuberKanaInput] = useState(foundVtuber?.VtuberKana);
    const [IntroMovieUrInput, setIntroMovieUrInput] = useState(foundVtuber?.IntroMovieUrl);
    const [MovieUrlInput, setMovieUrlInput] = useState(foundMovie?.MovieUrl);
    const [MovieTitleInput, setMovieTitleInput] = useState(foundMovie?.MovieTitle);
    const [SingStartInput, setSingStartInput] = useState(foundKaraoke?.SingStart);
    const [SongNameInput, setSongNameInput] = useState(foundKaraoke?.SongName);

    const [isToDecision, setIsTpoDecision]=useState<boolean>(false)
    const [choiceCrudType, setIsCrud] = useState<string>("")

    type CreateVtuber = {
        VtuberId:       number;
        VtuberName:     string;
        VtuberKana :    string;
        IntroMovieUrl:  string | null;
    }
    type CreateMovie = {
        VtuberId:       number;
        MovieTitle:     string;
        MovieUrl:       string;
    }
    type CreateKaraoke = {
        MovieUrl:       string;
        KaraokeListId:  number;
        SongName:       string;
        SingStart:      string;
    }
    // register：フォームフィールドを登録する関数
    // handleSubmit：フォームの送信を処理する関数
    // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
    // const router = useRouter();    // const { Unique_id } = router.query;
    // const { register, handleSubmit, formState: { errors } } = useForm<CrudDate>({defaultValues});
    const { register, handleSubmit, formState: { errors } } = useForm<CrudDate>();
    const [vtuberDataForFetch, setVtuberDataForFetch]=useState<CreateVtuber>()
    const [movieDataForFetch, setMovieDataForFetch]=useState<CreateMovie>()
    const [karaokeDataForFetch, setKaraokeDataForFetch]=useState<CreateKaraoke>()
    // フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
    const onSubmit = async (CrudData:CrudDate) => {
        console.log("CrudData", CrudData);
        console.log("choiceCrudType=", choiceCrudType, "\n selectedVtuber=",
             selectedVtuber, "\n selectedKaraoke", selectedKaraoke);
        if (choiceCrudType === "vtuber"){
                const  createVtuber:CreateVtuber={
                    VtuberId:        selectedVtuber, //createでは0
                    VtuberName:      CrudData.VtuberName,
                    VtuberKana:      CrudData.VtuberKana,
                    IntroMovieUrl:   CrudData.IntroMovieUrl,
                };
                setVtuberDataForFetch(createVtuber);
                console.log("vtuberDataForFetch=", vtuberDataForFetch)
            }else if (choiceCrudType === "movie"){
                // const VtuberId =selectedVtuber
                const createMovie:CreateMovie={
                    VtuberId:       selectedVtuber,
                    MovieTitle:     CrudData.MovieTitle,
                    MovieUrl:       CrudData.MovieUrl,
                };
                setMovieDataForFetch(createMovie)
                console.log("movieDataForFetch", movieDataForFetch)
            }else if (choiceCrudType === "karaoke"){
                const fetchCreateData:CreateKaraoke={
                    MovieUrl:       selectedMovie,
                    KaraokeListId:  selectedKaraoke, //createでは0
                    SongName:       CrudData.SongName,
                    SingStart:      CrudData.SingStart,
                };
                setKaraokeDataForFetch(fetchCreateData)
                console.log("karaokeDataForFetch=", karaokeDataForFetch)
                console.log("selectedMovie=", selectedMovie)

            } else {
                console.log("登録するデータの種類(vtuber, movie, karaoke)選択にて想定外のエラーが発生しました。")
            };
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false
            });
            try {const response = await axios.post(`https://localhost:8080/create/${ choiceCrudType }`,
            vtuberDataForFetch || movieDataForFetch || karaokeDataForFetch,
                    {
                    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // body: JSON.stringify(createDateStrage[`${choiceCrudType}DataforFetch`])
                    });
                console.log("choiceCrudType=", choiceCrudType,"\n fetchCreateData=", vtuberDataForFetch, 
                "\n movieDataForFetc=", movieDataForFetch, "\nkaraokeDataForFetch=", karaokeDataForFetch)
    
                if (!response.status) { //「HTTPｽﾃｰﾀｽｺｰﾄﾞが200番台の時に!true
                    throw new Error(response.statusText);
                    //HTTPレスポンスのｽﾃｰﾀｽに応じてテキストを返す。404ならNot Founde
                }
            } catch (error) {
                console.error(error);
                console.log("apiへアクセスを試みたものchatchした")
            }
            // router.reload()
        };      

    return (
        <div>
            ***CrudAlmighty***CrudAlmighty***CrudAlmighty***CrudAlmighty***CrudAlmighty*** <br/>
            <button type="button" onClick={()=> setIsCrud("vtuber")} >
                ＜VTuberを登録＞</button>
            <button type="button" onClick={()=> setIsCrud("movie")}>
                ＜歌枠動画を登録＞</button>
            <button type="button" onClick={()=> setIsCrud("karaoke")}>
                ＜歌を登録＞</button>
            <br/><br/>
            {choiceCrudType === "vtuber" &&
                <div>
                新規でVTuberを登録します。<br/>
                </div>}
            {choiceCrudType === "movie" && 
                <div>
                VTuber：{foundVtuber?.VtuberName}<br />
                &nbsp;&nbsp; の歌枠動画を登録します。
                </div>}
            {choiceCrudType === "karaoke" &&
                <div>
                VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                歌枠動画：{foundMovie?.MovieTitle}
                {foundKaraoke?.SongName && foundMovie?.MovieTitle}<br/>
                &nbsp;&nbsp; の歌と開始時間を登録します。
                </div>}<br/>
            <form onSubmit={handleSubmit(onSubmit)}>
                {choiceCrudType === "vtuber" &&
                <div>
                    ★Vtuber: <br />
                        &nbsp;&nbsp;VTuber名:
                            <input {...register("VtuberName", { required: true })} placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                                value={foundVtuber?.VtuberName}
                                onChange={e => setVtuberNameInput(e.target.value)}
                            /><br />               
                        &nbsp;&nbsp;読み(kana):
                            <input {...register("VtuberKana", { required: true })} placeholder={foundVtuber?.VtuberKana ||"例:imomochi_oimo"}
                                value={foundVtuber?.VtuberKana}
                                onChange={e => setVtuberKanaInput(e.target.value)}
                                /><br />
                            {/* {errors.VtuberName && "Vtuber is required"} */}
                        &nbsp;&nbsp;紹介動画URL(時間指定可):
                            <input {...register("IntroMovieUrl", { required: true })} placeholder={foundVtuber?.IntroMovieUrl ||"例:www.youtube.com/watch?v=AlHRqSsF--8"}
                                value={foundVtuber?.IntroMovieUrl || ""}
                                onChange={e => setIntroMovieUrInput(e.target.value)}
                                /><br />
                            {/* {errors.VtuberName && "Vtuber is required"} */}
                   </div>}
                      {choiceCrudType === "movie" &&
                <div>
                ★歌枠動画: <br/>
                    &nbsp;&nbsp;タイトル：
                        <input {...register("MovieTitle", { required: true })} placeholder={foundMovie?.MovieTitle ||"動画タイトル"}
                            value={foundMovie?.MovieTitle || ""} 
                            onChange={e => setMovieTitleInput(e.target.value)}
                            /><br />
                        {/* {errors.MovieTitle && "Movie is required"} */}
                    &nbsp;&nbsp;URL:
                        <input {...register("MovieUrl", { required: true })} placeholder={foundMovie?.MovieUrl ||"例：www.youtube.com/watch?v=AlHRqSsF--8"}
                            value={foundMovie?.MovieUrl}
                            onChange={e => setMovieUrlInput(e.target.value)}
                            /><br />
                        {/* {errors.MovieUrl && "Url is required"} */}
                        </div>}
                {choiceCrudType === "karaoke" &&
                <div>
                ★歌: <br/>
                    &nbsp;&nbsp;曲名：
                        <input {...register("SongName", { required: true })} placeholder={foundKaraoke?.SongName ||"曲名"}
                            value={foundKaraoke?.SongName || ""}
                            onChange={e => setSongNameInput(e.target.value)}
                            /><br />
                        {/* {errors.SongName && "Song is required"} */}
                    &nbsp;&nbsp;開始時間:
                        <input {...register("SingStart", { required: true })} placeholder={foundKaraoke?.SingStart ||"例 00:05:30"}
                            value={foundKaraoke?.SingStart}
                            onChange={e => setSingStartInput(e.target.value)}
                        /><br />
                    {/* {errors.SingStart && "SingStart is required"} */}
                </div>}
            {/* ※ページ最上部のリストから選択後、✖でクリアすることで、入力フォームを編集できるようになります。<br/> */}
                <button type="submit" >＜決定＞</button>
                        <br />  &nbsp;  &nbsp;  &nbsp;  &nbsp;
            </form>
        </div>
    );
}
