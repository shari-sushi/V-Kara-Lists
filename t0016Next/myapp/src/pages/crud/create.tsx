import { domain } from '../../../env'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';
import Router, { useEffect, useState } from 'react';
// import style from '../Youtube.module.css';
import type { CrudDate, ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '../../types/vtuber_content'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios from 'axios';
import '@szhsin/react-menu/dist/index.css';
import { DropDownVt, DropDownMo, DropDownKa } from '../../components/Dropdown';
import { YouTubePlayer } from '../../components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '../../components/Conversion'
import { Header } from '../../components/layout/Layout'


type TopPagePosts = {
    //   alljoindata: AllJoinData[];
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
};
type AllDatePage = {
    posts: TopPagePosts;
    checkSignin: boolean;
}

export const AllDatePage = ({ posts, checkSignin }: AllDatePage) => {
    console.log("posts", posts)
    const vtubers = posts.vtubers
    const movies = posts.vtubers_movies
    const karaokes = posts.vtubers_movies
    if (!checkSignin) {
        // トーストか、新規タグで開いてuseContextでrouterを引き継がせて、ログイン後に元のページに戻す処理をしたい
        // さらに言えば、決定ボタン押下時にログイン状態を確認する処理も入れたい
        return (
            <div className="App">
                <h1>ログインが必要なサービスです</h1>
                <Link href={`/user/signin`} ><u>ログイン</u></Link><br />
                <Link href={`/user/signup`} ><u>会員登録</u></Link>
            </div>

        );
    };

    const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
    //↓デフォの選考基準；VTuber界での知名度〇、動画内の歌の上手さ△～〇、選曲△～〇、非オタから見た外見のきつさ×～△。より適した動画が有れば変えたい。
    const [foundMovie, setfoundMovie] = useState<string>("kORHSmXcYNc");
    const [foundKaraokeStart, setKaraokeStart] = useState<number>(0);

    //プルダウンの選択時に埋め込みに反映するuseEffect 2つ
    useEffect(() => {
        if (selectedVtuber && !selectedMovie) {
            // setKaraokeStart(4)
        }
        if (selectedVtuber && selectedMovie) {
            const foundMovie = movies.find(movies => movies.MovieUrl === selectedMovie);
            // console.log("foundMovieUrl",foundMovie?.MovieUrl);
            if (foundMovie) {
                const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
                setfoundMovie(foundYoutubeId);
                setKaraokeStart(1)
                //   console.log("foundYoutubeId", foundYoutubeId)
            }
        }
    }, [selectedVtuber, selectedMovie, movies]);

    useEffect(() => {
        if (selectedVtuber && selectedMovie && selectedKaraoke) {
            const foundMovies = karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie);
            const foundKaraoke = foundMovies.find(foundMovie => foundMovie.KaraokeId === selectedKaraoke)

            if (foundKaraoke) {
                const foundSingStart = ConvertStringToTime(foundKaraoke.SingStart);
                setKaraokeStart(foundSingStart);
                //   console.log("foundSingStart", foundSingStart)
            }
        }
        console.log("selectedKaraoke=", selectedKaraoke)
    }, [selectedVtuber, selectedMovie, selectedKaraoke, karaokes]);

    // 親選択クリア時に子もクリアするuseEffect 2つ
    useEffect(() => {
        if (!selectedVtuber) {
            setSelectedMovie("")
            setSelectedKaraoke(0)
        }
    }, [selectedVtuber, selectedMovie, selectedKaraoke]);
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
        <Header pageName="データベース登録">
            <div>
                <br />

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
                    onMovieSelect={setSelectedMovie}
                    onKaraokeClear={handleMovieClear}
                />
                <DropDownKa
                    posts={posts}
                    selectedMovie={selectedMovie}
                    onKaraokeSelect={setSelectedKaraoke}
                />
                <YouTubePlayer videoId={foundMovie} start={foundKaraokeStart} />
                <Link href="/"><button>TOPへ</button></Link>
                <CreateForm
                    posts={posts}
                    selectedVtuber={selectedVtuber}
                    selectedMovie={selectedMovie}
                    selectedKaraoke={selectedKaraoke}
                />
            </div>
        </Header>
    )
};


type selectedDate = {
    // alljoindata: AllJoinData[];
    posts: TopPagePosts;
    selectedVtuber: number;
    selectedMovie: string;
    selectedKaraoke: number;
}

export function CreateForm({ posts, selectedVtuber, selectedMovie, selectedKaraoke }: selectedDate) {
    const vtubers = posts.vtubers
    const movies = posts.vtubers_movies
    const karaokes = posts.vtubers_movies
    const router = useRouter()
    const foundVtuber = vtubers?.find(vtuber => vtuber.VtuberId === selectedVtuber);
    const foundMovie = movies?.find(movie => movie.MovieUrl === selectedMovie);
    console.log("selectedMovie=", selectedMovie)
    const foundMovies = karaokes?.filter(karaoke => karaoke.MovieUrl === selectedMovie);
    const foundKaraoke = foundMovies?.find(foundMovie => foundMovie.KaraokeId === selectedKaraoke)
    // console.log("foundKaraoke",foundKaraoke);
    // console.log("selectedKaraoke",selectedKaraoke);

    const [crudContentType, setCrudContentType] = useState<string>("")

    const [vtuberNameInput, setVtuberNameInput] = useState(foundVtuber?.VtuberName);
    const [VtuberKanaInput, setVtuberKanaInput] = useState(foundVtuber?.VtuberKana);
    const [IntroMovieUrInput, setIntroMovieUrInput] = useState(foundVtuber?.IntroMovieUrl);
    const [MovieUrlInput, setMovieUrlInput] = useState(foundMovie?.MovieUrl);
    const [MovieTitleInput, setMovieTitleInput] = useState(foundMovie?.MovieTitle);
    const [SingStartInput, setSingStartInput] = useState(foundKaraoke?.SingStart);
    const [SongNameInput, setSongNameInput] = useState(foundKaraoke?.SongName);

    type CreateVtuber = {
        VtuberId: number;
        VtuberName: string;
        VtuberKana: string;
        IntroMovieUrl: string | null;
    }
    type CreateMovie = {
        VtuberId: number;
        MovieTitle: string;
        MovieUrl: string;
    }
    type CreateKaraoke = {
        MovieUrl: string;
        KaraokeId: number;
        SongName: string;
        SingStart: string;
    }

    const axiosClient = axios.create({
        baseURL: `${domain.backendHost}/vcontents`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const { register, handleSubmit, formState: { errors }, resetField } = useForm<CrudDate>();

    // console.log("vtuberDataForFetch=", vtuberDataForFetch, "\n movieDataForFetch=", movieDataForFetch, "\n karaokeDataForFetch", karaokeDataForFetch)
    const onSubmit = async (CrudData: CrudDate) => {
        // console.log("決定押下")
        // console.log("CrudData", CrudData);
        if (crudContentType === "vtuber") {
            try {
                const reqBody: CreateVtuber = {
                    VtuberId: 0, //自動振り分け
                    VtuberName: CrudData.VtuberName,
                    VtuberKana: CrudData.VtuberKana,
                    IntroMovieUrl: CrudData.IntroMovieUrl,
                };
                const response = await axiosClient.post("/create/vtuber", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "movie") {
            try {
                const reqBody: CreateMovie = {
                    VtuberId: selectedVtuber, //既存値
                    MovieTitle: CrudData.MovieTitle,
                    MovieUrl: CrudData.MovieUrl,
                };
                const response = await axiosClient.post("/create/movie", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "karaoke") {
            try {
                const reqBody: CreateKaraoke = {
                    MovieUrl: selectedMovie,//既存値
                    KaraokeId: 0, //自動振り分け
                    SongName: CrudData.SongName,
                    SingStart: CrudData.SingStart,
                };
                const response = await axiosClient.post("/create/karaoke", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log("登録するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。")
        }
    };

    return (
        <div>
            <button type="button" onClick={() => setCrudContentType("vtuber")} >
                ＜VTuberを登録＞</button>
            <button type="button" onClick={() => setCrudContentType("movie")}>
                ＜歌枠動画を登録＞</button>
            <button type="button" onClick={() => setCrudContentType("karaoke")}>
                ＜歌を登録＞</button>
            <br /><br />
            {crudContentType === "vtuber" &&
                <div>
                    VTuberを登録します。<br />
                </div>}
            {crudContentType === "movie" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName}<br />
                    &nbsp;&nbsp; の歌枠動画を登録します。
                </div>}
            {crudContentType === "karaoke" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                    歌枠動画：{foundMovie?.MovieTitle}
                    <br />
                    &nbsp;&nbsp; の歌と開始時間を登録します。
                </div>}<br />
            <form onSubmit={handleSubmit(onSubmit)}>
                {crudContentType === "vtuber" &&
                    <div>
                        ★Vtuber: <br />
                        &nbsp;&nbsp;VTuber名:
                        <input {...register("VtuberName", { required: true })} placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                            // value={foundVtuber?.VtuberName}
                            onChange={e => setVtuberNameInput(e.target.value)}
                        /><br />
                        &nbsp;&nbsp;読み(kana):
                        <input {...register("VtuberKana", { required: true })} placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"}
                            // value={foundVtuber?.VtuberKana}
                            onChange={e => setVtuberKanaInput(e.target.value)}
                        /><br />
                        {/* {errors.VtuberName && "Vtuber is required"} */}
                        &nbsp;&nbsp;紹介動画URL(時間指定可):
                        <input {...register("IntroMovieUrl", { required: false })} placeholder={foundVtuber?.IntroMovieUrl || "例:www.youtube.com/watch?v=AlHRqSsF--8"}
                            // value={foundVtuber?.IntroMovieUrl || ""}
                            onChange={e => setIntroMovieUrInput(e.target.value)}
                        /><br />
                        {/* {errors.VtuberName && "Vtuber is required"} */}
                    </div>}
                {crudContentType === "movie" &&
                    <div>
                        ★歌枠動画: <br />
                        &nbsp;&nbsp;タイトル：
                        <input {...register("MovieTitle", { required: true })} placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                            // value={foundMovie?.MovieTitle || ""} 
                            onChange={e => setMovieTitleInput(e.target.value)}
                        /><br />
                        {/* {errors.MovieTitle && "Movie is required"} */}
                        &nbsp;&nbsp;URL:
                        <input {...register("MovieUrl", { required: true })} placeholder={foundMovie?.MovieUrl || "例：www.youtube.com/watch?v=AlHRqSsF--8"}
                            // value={foundMovie?.MovieUrl}
                            onChange={e => setMovieUrlInput(e.target.value)}
                        /><br />
                        {/* {errors.MovieUrl && "Url is required"} */}
                    </div>}
                {crudContentType === "karaoke" &&
                    <div>
                        ★歌: <br />
                        &nbsp;&nbsp;曲名：
                        <input {...register("SongName", { required: true })} placeholder={foundKaraoke?.SongName || "曲名"}
                            // value={foundKaraoke?.SongName || ""}
                            onChange={e => setSongNameInput(e.target.value)}
                        /><br />
                        {/* {errors.SongName && "Song is required"} */}
                        &nbsp;&nbsp;開始時間:
                        <input {...register("SingStart", { required: true })} placeholder={foundKaraoke?.SingStart || "例 00:05:30"}
                            // value={foundKaraoke?.SingStart}
                            onChange={e => setSingStartInput(e.target.value)}
                        /><br />
                        {/* {errors.SingStart && "SingStart is required"} */}
                    </div>}
                {/* ※ページ最上部のリストから選択後、✖でクリアすることで、入力フォームを編集できるようになります。<br/> */}
                <button type="submit" >＜決定＞</button>
                {/* <button type="submit" onClick={() => onSubmit} >＜決定＞</button>      */}
                {/* <button onClick={resetTextValue} style={{ margin: "10px", background: "gray", color: "#fff" }}>クリア</button>    */}
            </form>
            <br />  &nbsp;  &nbsp;  &nbsp;  &nbsp;
        </div>
    );
}


///////////////////////////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps(context: { req: { headers: { cookie: string }; }; }) {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    let resData;
    try {
        const response = await axios.get(`${domain.backendHost}/vcontents/getalldata`, {
            // 0019だとnullでサーバー起動、undefinedはダメだとエラーが出る。
            httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
        });
        resData = response.data;
    } catch (error) {
        console.log("axios.getでerroe:", error)
    }

    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    let checkSignin = false
    if (sessionToken) { checkSignin = true }
    console.log("resData=", resData)
    return {
        props: {
            posts: resData,
            checkSignin: checkSignin
        }
    };
}

export default AllDatePage;