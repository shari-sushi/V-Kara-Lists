import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';
import Router, { useEffect, useState } from 'react';
// import style from '../Youtube.module.css';
import type { CrudDate, ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '../types/vtuber_content'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios from 'axios';
import '@szhsin/react-menu/dist/index.css';
import { DropDownVt, DropDownMo, DropDownKa } from '../components/Dropdown';
import { YoutubePlayer } from '../components/YoutubePlayer'
import { ConversionTime, ExtractVideoId } from '../components/Conversion'
import { domain } from '../../env'

type TopPagePosts = {
    //   alljoindata: AllJoinData[];
    vtubers: ReceivedVtuber[];
    movies: ReceivedMovie[];
    karaokes: ReceivedKaraoke[];
    vtubers_and_movies: ReceivedMovie[];
};
type AllDatePage = {
    posts: TopPagePosts;
    checkSignin: boolean;
}

export const AllDatePage = ({ posts, checkSignin }: AllDatePage) => {
    const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
    //↓デフォの選考基準；VTuber界での知名度〇、動画内の歌の上手さ△～〇、選曲△～〇、非オタから見た外見のきつくさ×～△。より適した動画が有れば変えたい。
    const [foundMovie, setfoundMovie] = useState<string>("kORHSmXcYNc");
    const [foundKaraokeStart, setKaraokeStart] = useState<number>(0);

    //プルダウンの選択時に埋め込みに反映するuseEffect 2つ
    useEffect(() => {
        if (selectedVtuber && !selectedMovie) {
            // setKaraokeStart(4)
        }
        if (selectedVtuber && selectedMovie) {
            const foundMovie = posts.movies.find(movies => movies.Movie.MovieUrl === selectedMovie);
            // console.log("foundMovieUrl",foundMovie?.MovieUrl);
            if (foundMovie) {
                const foundYoutubeId = ExtractVideoId(foundMovie.Movie.MovieUrl);
                setfoundMovie(foundYoutubeId);
                setKaraokeStart(1)
                //   console.log("foundYoutubeId", foundYoutubeId)
            }
        }
    }, [selectedVtuber, selectedMovie, posts.movies]);

    useEffect(() => {
        if (selectedVtuber && selectedMovie && selectedKaraoke) {
            const foundMovies = posts.karaokes.filter(karaoke => karaoke.Movie.MovieUrl === selectedMovie);
            const foundKaraoke = foundMovies.find(foundMovie => foundMovie.Karaoke.KaraokeId === selectedKaraoke)
            // console.log("posts.karaokes", posts.karaokes) //karaoke_listsテーブルの全データをオブジェクトの配列で
            // console.log("foundMovies", foundMovies)     //どういつURLのオブジェクトの配列
            // console.log("foundKaraoke", foundKaraoke);  //karaokeの配列

            if (foundKaraoke) {
                const foundSingStart = ConversionTime(foundKaraoke.Karaoke.SingStart);
                setKaraokeStart(foundSingStart);
                //   console.log("foundSingStart", foundSingStart)
            }
        }
    }, [selectedVtuber, selectedMovie, selectedKaraoke, posts.karaokes]);

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
        <div>
            <h1>データベース削除</h1>
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
            <YoutubePlayer videoId={foundMovie} start={foundKaraokeStart} />
            <Link href="/"><button>TOPへ</button></Link>
            <DeleteForm
                posts={posts}
                selectedVtuber={selectedVtuber}
                selectedMovie={selectedMovie}
                selectedKaraoke={selectedKaraoke}
            />
        </div>
    )
};
///////////////////////////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; }) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
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

    // Signinしていればtrueを返す
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    var CheckSignin = false
    if (sessionToken) { CheckSignin = true }

    return {
        props: {
            posts: resData,
            checkSignin: CheckSignin
        }
    };
}

export default AllDatePage;

/////////////////////////////////////////////////////////////////////////////////////
type selectedDate = {
    // alljoindata: AllJoinData[];
    posts: TopPagePosts;
    selectedVtuber: number;
    selectedMovie: string;
    selectedKaraoke: number;
}

export function DeleteForm({ posts, selectedVtuber, selectedMovie, selectedKaraoke }: selectedDate) {
    const router = useRouter()
    var defaultValues: CrudDate = {
        VtuberId: selectedVtuber,//入力不可とする
        VtuberName: "",
        VtuberKana: "",
        IntroMovieUrl: "",
        MovieUrl: "",
        MovieTitle: "",
        KaraokeId: selectedKaraoke,//入力不可とする
        SingStart: "",
        SongName: "",
    }

    const foundVtuber = posts?.vtubers?.find(vtuber => vtuber.Vtuber.VtuberId === selectedVtuber);
    const foundMovie = posts?.movies?.find(movie => movie.Movie.MovieUrl === selectedMovie);
    const foundMovies = posts?.karaokes?.filter(karaoke => karaoke.Karaoke.MovieUrl === selectedMovie); //movieの配列
    const foundKaraoke = foundMovies?.find(foundMovie => foundMovie.Karaoke.KaraokeId === selectedKaraoke)
    // console.log("selectedVtuber=", selectedVtuber)
    // console.log("selectedMovie=", selectedMovie)
    // console.log("selectedKaraoke",selectedKaraoke);
    // console.log("foundVtuber",foundVtuber);
    // console.log("foundMovie",foundMovie);
    // console.log("foundMovies",foundMovies);
    // console.log("foundKaraoke",foundKaraoke);

    const [crudContentType, setCrudContentType] = useState<string>("")

    type DeleteVtuber = {
        VtuberId: number;
        VtuberName: string | undefined;

    }
    type DeleteMovie = {
        VtuberId: number | undefined;
        MovieUrl: string;
    }
    type DeleteKaraoke = {
        MovieUrl: string;
        KaraokeId: number;
        SongName: string;
    }

    // const reqBody:any={}

    const axiosClient = axios.create({
        baseURL: "https://localhost:8080/v1",
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const handleClick = async () => {
        console.log("決定押下")
        console.log("choiceCrudType=", crudContentType, "\n selectedVtuber=",
            selectedVtuber, "\n selectedKaraoke", selectedKaraoke);
        if (crudContentType === "vtuber" && foundVtuber?.Vtuber.VtuberName) {
            try {
                const reqBody: DeleteVtuber = {
                    VtuberId: selectedVtuber,        //deleteで必須
                    VtuberName: foundVtuber.Vtuber.VtuberName,   //deleteで必須
                };
                const response = await axiosClient.delete("/delete/vtuber", {
                    data: reqBody,
                });
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "movie" && foundMovie?.Movie.MovieUrl) {
            try {
                const reqBody: DeleteMovie = {
                    VtuberId: selectedVtuber,     //deleteで必須
                    MovieUrl: foundMovie.Movie.MovieUrl,  //deleteで必須
                };
                const response = await axiosClient.delete("/delete/movie", {
                    data: reqBody,
                });
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "karaoke" && foundKaraoke?.Karaoke.SongName) {
            try {
                const reqBody: DeleteKaraoke = {
                    MovieUrl: selectedMovie,      //deleteで必須
                    KaraokeId: selectedKaraoke,    //deleteで必須
                    SongName: foundKaraoke.Karaoke.SongName,  //deleteで必須
                };
                const response = await axiosClient.delete("/delete/karaoke", {
                    data: reqBody,
                });
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
            console.log("selectedMovie=", selectedMovie)
        } else {
            console.log("削除するデータの種類(vtuber, movie, karaoke)の選択、またはで想定外のエラーが発生しました。")
        }
    };;


    return (
        <div>
            削除するコンテンツを選択<br />
            <button type="button" onClick={() => setCrudContentType("vtuber")} >
                ＜VTuber＞</button>
            <button type="button" onClick={() => setCrudContentType("movie")}>
                ＜歌枠動画＞</button>
            <button type="button" onClick={() => setCrudContentType("karaoke")}>
                ＜歌＞</button>
            <br /><br />
            {crudContentType === "vtuber" &&
                <div>
                    VTuber：{foundVtuber?.Vtuber.VtuberName}<br />
                    &nbsp;&nbsp; の登録を削除しまか？
                </div>}
            {crudContentType === "movie" &&
                <div>
                    VTuber：{foundVtuber?.Vtuber.VtuberName && foundVtuber?.Vtuber.VtuberName}<br />
                    の<br />
                    歌枠動画：{foundMovie?.Movie.MovieTitle}
                    を削除しますか？
                </div>}
            {crudContentType === "karaoke" &&
                <div>
                    VTuber：{foundVtuber?.Vtuber.VtuberName && foundVtuber?.Vtuber.VtuberName}<br />
                    歌枠動画：{foundMovie?.Movie.MovieTitle}<br />
                    の<br />
                    曲名：{foundKaraoke?.Karaoke.SongName}<br />
                    (再生時間：{foundKaraoke?.Karaoke.SingStart})<br />
                    &nbsp;&nbsp; の登録を削除します？
                </div>}<br />
            {crudContentType &&
                <div>
                    <button onClick={handleClick} >決定</button>
                </div>}
        </div>
    );
}