import { useRouter } from "next/router";
import Link from 'next/link';
import Router, { useEffect, useState } from 'react';
import style from '../Youtube.module.css';
import type { CrudDate, ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import { DropDownVtuber } from '@/components/dropDown/Vtuber';
import { DropDownMovie } from '@/components/dropDown/Movie';
import { DropDownKaraoke } from '@/components/dropDown/Karaoke';
import { YouTubePlayer } from '@/components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { domain } from '@/../env'

//////////////////////////////////////////
//////////////////////////////////////////
/////ボタン化したほうが良いのでは？///////
//////////////////////////////////////////
//////////////////////////////////////////
type TopPagePosts = {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
};
type DeletePageProps = {
    posts: TopPagePosts;
    isSignin: boolean;
}

export const DeletePage = ({ posts, isSignin }: DeletePageProps) => {
    const vtubers = posts.vtubers
    const movies = posts.vtubers_movies
    const karaokes = posts.vtubers_movies_karaokes
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
            const foundMovies = movies.filter(karaoke => karaoke.MovieUrl === selectedMovie);
            const foundKaraoke = karaokes.find(karaoke => karaoke.KaraokeId === selectedKaraoke)
            // console.log("movies", movies) //karaoke_listsテーブルの全データをオブジェクトの配列で
            // console.log("foundMovies", foundMovies)     //どういつURLのオブジェクトの配列
            // console.log("foundKaraoke", foundKaraoke);  //karaokeの配列

            if (foundKaraoke) {
                const foundSingStart = ConvertStringToTime(foundKaraoke.SingStart);
                setKaraokeStart(foundSingStart);
                //   console.log("foundSingStart", foundSingStart)
            }
        }
    }, [selectedVtuber, selectedMovie, selectedKaraoke, movies]);

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
            //   console.log("isSignin=", isSignin)
        }
    }, [posts]);

    return (
        <div>
            <h1>データベース削除</h1>
            <DropDownVtuber
                posts={posts}
                onVtuberSelect={setSelectedVtuber}
                //onChangeにより、onVtuber~にoptiobn.valueが渡され、=setSelectedVtuberに。
                //setSe~V~はuseStateでselectedVtuberに値を渡す→DropDownMo2に渡る。
                onMovieClear={handleMovieClear}
                onKaraokeClear={handleVtuberClear}
            />
            <DropDownMovie
                posts={posts}
                selectedVtuber={selectedVtuber}
                onMovieSelect={setSelectedMovie} //このファイルではstringになってる
                onKaraokeClear={handleMovieClear}
            />
            <DropDownKaraoke
                posts={posts}
                selectedMovie={selectedMovie}
                onKaraokeSelect={setSelectedKaraoke}
            />
            <YouTubePlayer videoId={foundMovie} start={foundKaraokeStart} />
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

export default DeletePage;
/////////////////////////////////////////////////////////////////////////////////////////
type selectedDate = {
    // alljoindata: AllJoinData[];
    posts: TopPagePosts;
    selectedVtuber: number;
    selectedMovie: string;
    selectedKaraoke: number;
}

export function DeleteForm({ posts, selectedVtuber, selectedMovie, selectedKaraoke }: selectedDate) {
    const vtubers = posts?.vtubers
    const movies = posts?.vtubers_movies
    const karaokes = posts?.vtubers_movies_karaokes
    const router = useRouter()
    let defaultValues: CrudDate = {
        VtuberId: selectedVtuber, //入力不可とする
        VtuberName: "",
        VtuberKana: "",
        IntroMovieUrl: "",
        MovieUrl: "",
        MovieTitle: "",
        KaraokeId: selectedKaraoke, //入力不可とする
        SingStart: "",
        SongName: "",
    }

    const foundVtuber = vtubers.find(vtuber => vtuber.VtuberId === selectedVtuber);
    const foundMovie = movies.find(movie => movie.MovieUrl === selectedMovie);
    const foundMovies = karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie);
    const foundKaraoke = karaokes.find(karaoke => karaoke.KaraokeId === selectedKaraoke)

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

    const axiosClient = axios.create({
        baseURL: `${domain.backendHost}/vcontents`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const handleClick = async () => {
        console.log("決定押下")
        console.log("choiceCrudType=", crudContentType, "\n selectedVtuber=",
            selectedVtuber, "\n selectedKaraoke", selectedKaraoke);
        if (crudContentType === "vtuber" && foundVtuber?.VtuberName) {
            try {
                const reqBody: DeleteVtuber = {
                    VtuberId: selectedVtuber,        //deleteで必須
                    VtuberName: foundVtuber.VtuberName,   //deleteで必須
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
        } else if (crudContentType === "movie" && foundMovie?.MovieUrl) {
            try {
                const reqBody: DeleteMovie = {
                    VtuberId: selectedVtuber,     //deleteで必須
                    MovieUrl: foundMovie.MovieUrl,  //deleteで必須
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
        } else if (crudContentType === "karaoke" && foundKaraoke?.SongName) {
            try {
                const reqBody: DeleteKaraoke = {
                    MovieUrl: selectedMovie,      //deleteで必須
                    KaraokeId: selectedKaraoke,    //deleteで必須
                    SongName: foundKaraoke.SongName,  //deleteで必須
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
                    VTuber：{foundVtuber?.VtuberName}<br />
                    &nbsp;&nbsp; の登録を削除しまか？
                </div>}
            {crudContentType === "movie" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                    の<br />
                    歌枠動画：{foundMovie?.MovieTitle}
                    を削除しますか？
                </div>}
            {crudContentType === "karaoke" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                    歌枠動画：{foundMovie?.MovieTitle}<br />
                    の<br />
                    曲名：{foundKaraoke?.SongName}<br />
                    (再生時間：{foundKaraoke?.SingStart})<br />
                    &nbsp;&nbsp; の登録を削除します？
                </div>}<br />
            {crudContentType &&
                <div>
                    <button onClick={handleClick} >決定</button>
                </div>}
        </div>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////

type ContextType = {
    req: { headers: { cookie?: string; }; };
    res: {
        writeHead: (statusCode: number, headers: Record<string, string>) => void;
        end: () => void;
    };
};

export async function getServerSideProps(context: ContextType) {
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    console.log("sessionToken", sessionToken)
    let isSignin = false
    if (sessionToken) {
        isSignin = true
    }
    // サーバーの証明書が認証されない自己証明書でもHTTPSリクエストを継続する
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const options: AxiosRequestConfig = {
        headers: {
            'Cache-Control': 'no-store', //cache(キャッシュ)を無効にする様だが、必要性理解してない
            cookie: `auth-token=${sessionToken}`,
        },
        withCredentials: true,  //HttpヘッダーにCookieを含める
        httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
    };

    let resData = null;
    try {
        const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
        resData = res.data;
    } catch (error) {
        console.log("erroe in axios.get:", error);
    }
    return {
        props: {
            posts: resData,
            isSignin: isSignin,
        }
    }
}