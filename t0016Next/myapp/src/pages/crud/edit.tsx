import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

import { domain } from '@/../env'
import type { CrudDate, ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content'; //type{}で型情報のみインポート
import { Header } from '@/components/layout/Layout'
import { DropDownVtuber } from '@/components/dropDown/Vtuber';
import { DropDownMovie } from '@/components/dropDown/Movie';
import { DropDownKaraoke } from '@/components/dropDown/Karaoke';
import { YouTubePlayer } from '@/components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { GestLogin, } from '@/components/authButton'
import {
    ValidateEditVtuberName,
    ValidateEditVtuberKana,
    ValidateEditIntroMovieUrl,
    ValidateEditMovieTitle,
    ValidateEditSingStart,
    ValidateEditSongName,
} from '@/features/regularExpression/VtuberContent'


type TopPagePosts = {
    vtubers: ReceivedVtuber[];
    vtubers_movies: ReceivedMovie[];
    vtubers_movies_karaokes: ReceivedKaraoke[];
};
type EditPageProps = {
    posts: TopPagePosts;
    isSignin: boolean;
}

export const EditPage = ({ posts, isSignin }: EditPageProps) => {
    const movies = posts?.vtubers_movies || [{} as ReceivedMovie];
    const karaokes = posts?.vtubers_movies_karaokes || [{} as ReceivedKaraoke];
    if (!isSignin) {
        // トーストか、新規タグで開いてuseContextでrouterを引き継がせて、ログイン後に元のページに戻す処理をしたい
        // さらに言えば、決定ボタン押下時にログイン状態を確認する処理も入れたい
        // ↑引き継がなくてもrouter.ロールバック？で戻れるでしょ
        return (
            <div className="App">
                <h1>ログインが必要なサービスです</h1>
                <Link href={`/user/signin`} ><u>ログイン</u></Link><br />
                <Link href={`/user/signup`} ><u>会員登録</u></Link>
                <GestLogin /> &nbsp;
            </div>
        );
    };

    const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
    const [currentVideoId, setCurrentVideoId] = useState<string>("AAsRtnbDs-0");
    const [currentStart, setCurrentStart] = useState<number>(27);


    useEffect(() => {
        if (!selectedVtuber) {

        }
    }, [selectedVtuber])

    useEffect(() => {
        const foundMovie = movies.find(movies => movies.MovieUrl === selectedMovie)
        if (foundMovie) {
            const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
            setCurrentVideoId(foundYoutubeId);
            setCurrentStart(1)
        }
    }, [selectedMovie]);

    const clearMovieHandler = () => { //中身空でもKaraokeのoptinosを空にしてくれるんだが…
        // setSelectedKaraoke(0);
    };

    useEffect(() => {
        if (selectedVtuber && selectedMovie && selectedKaraoke) {
            const foundMovies = karaokes.filter(karaoke => karaoke.MovieUrl === selectedMovie);
            const foundKaraoke = foundMovies.find(foundMovie => foundMovie.KaraokeId === selectedKaraoke)
            if (foundKaraoke) {
                const foundSingStart = ConvertStringToTime(foundKaraoke.SingStart);
                setCurrentStart(foundSingStart);
            }
        }
    }, [selectedMovie, selectedKaraoke]);

    return (
        <Header pageName="データベース編集" isSignin={isSignin}>
            <div>
                {"※現在、データの編集・削除はデータ登録者とサイト管理者しかできないようにロックしています。"} <br />
                {"他ユーザーも利用しやすいように正確に登録してください。"} <br />
                {"ご自身の登録データはmypageで確認できます"}
                <br />
                <div>
                    extra~~(selectedMovie)= {ExtractVideoId(selectedMovie)} <br />
                    currentMovieId= {currentVideoId}
                </div>
                <DropDownVtuber
                    posts={posts != null ? posts : {} as TopPagePosts}
                    onVtuberSelect={setSelectedVtuber}
                />
                <DropDownMovie
                    posts={posts}
                    selectedVtuber={selectedVtuber}
                    setSelectedMovie={setSelectedMovie}
                    clearMovieHandler={clearMovieHandler}
                />
                <DropDownKaraoke
                    posts={posts}
                    selectedMovie={selectedMovie}
                    onKaraokeSelect={setSelectedKaraoke}
                />
                <YouTubePlayer videoId={currentVideoId} start={currentStart} />
                <EditForm
                    posts={posts}
                    selectedVtuber={selectedVtuber}
                    selectedMovie={selectedMovie}
                    selectedKaraoke={selectedKaraoke}
                />
            </div>
        </Header >
    )
};
/////////////////////////////////////////////////////////////////////////////////////////

type SelectedDate = {
    posts: TopPagePosts;
    selectedVtuber: number;
    selectedMovie: string;
    selectedKaraoke: number;
}
type EditVtuber = {
    VtuberId: number;
    VtuberName: string | null;
    VtuberKana: string | null;
    IntroMovieUrl: string | null;
}
type EditMovie = {
    VtuberId: number;
    MovieTitle: string | null;
    MovieUrl: string;
}
type EditKaraoke = {
    MovieUrl: string;
    KaraokeId: number;
    SongName: string | null;
    SingStart: string | null;
}

export function EditForm({ posts, selectedVtuber, selectedMovie, selectedKaraoke }: SelectedDate) {
    const vtubers = posts?.vtubers
    const movies = posts?.vtubers_movies
    const karaokes = posts?.vtubers_movies_karaokes
    // let defaultValues: CrudDate = {
    //     VtuberId: selectedVtuber,//入力不可とする
    //     VtuberName: "",
    //     VtuberKana: "",
    //     IntroMovieUrl: "",
    //     MovieUrl: "",
    //     MovieTitle: "",
    //     KaraokeId: selectedKaraoke,//入力不可とする
    //     SingStart: "",
    //     SongName: "",
    // }

    const foundVtuber = vtubers?.find(vtuber => vtuber.VtuberId === selectedVtuber);
    const foundMovie = movies?.find(movie => movie.MovieUrl === selectedMovie);
    const foundMovies = karaokes?.filter(karaoke => karaoke.MovieUrl === selectedMovie);
    const foundKaraoke = foundMovies?.find(foundMovie => foundMovie.KaraokeId === selectedKaraoke)

    const [vtuberNameInput, setVtuberNameInput] = useState(foundVtuber?.VtuberName);
    const [VtuberKanaInput, setVtuberKanaInput] = useState(foundVtuber?.VtuberKana);
    const [IntroMovieUrInput, setIntroMovieUrInput] = useState(foundVtuber?.IntroMovieUrl);
    const [MovieUrlInput, setMovieUrlInput] = useState(foundMovie?.MovieUrl);
    const [MovieTitleInput, setMovieTitleInput] = useState(foundMovie?.MovieTitle);
    const [SingStartInput, setSingStartInput] = useState(foundKaraoke?.SingStart);
    const [SongNameInput, setSongNameInput] = useState(foundKaraoke?.SongName);

    const [crudContentType, setCrudContentType] = useState<string>("")


    const axiosClient = axios.create({
        baseURL: `${domain.backendHost}/vcontents`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const { register, handleSubmit, formState: { errors } } = useForm<CrudDate>();

    const onSubmit = async (CrudData: CrudDate) => {
        if (crudContentType === "vtuber" && foundVtuber && selectedVtuber) {
            try {
                const reqBody: EditVtuber = {
                    VtuberId: selectedVtuber,    //変更不可
                    VtuberName: CrudData.VtuberName || foundVtuber.VtuberName,
                    VtuberKana: CrudData.VtuberKana || foundVtuber.VtuberKana,
                    IntroMovieUrl: CrudData.IntroMovieUrl || foundVtuber.IntroMovieUrl,
                };
                const response = await axiosClient.post("/edit/vtuber", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "movie" && foundMovie && selectedMovie) {
            try {
                const reqBody: EditMovie = {
                    VtuberId: selectedVtuber,                             //変更不可
                    MovieTitle: CrudData.MovieTitle || foundMovie?.MovieTitle,
                    MovieUrl: selectedMovie,  //変更不可
                };
                const response = await axiosClient.post("/edit/movie", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else if (crudContentType === "karaoke" && foundKaraoke && selectedMovie && selectedKaraoke) {
            try {
                const reqBody: EditKaraoke = {
                    MovieUrl: selectedMovie,      //変更不可
                    KaraokeId: selectedKaraoke,    //変更不可
                    SongName: CrudData.SongName || foundKaraoke?.SongName,
                    SingStart: CrudData.SingStart || foundKaraoke?.SingStart,
                };
                const response = await axiosClient.post("/edit/karaoke", reqBody);
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log("編集するデータの種類(vtuber, movie, karaoke)の選択で想定外のエラーが発生しました。")
        }
    };;

    return (
        <div>
            編集するコンテンツを選択：
            <button type="button" onClick={() => setCrudContentType("vtuber")} >
                ＜VTuber＞</button>
            <button type="button" onClick={() => setCrudContentType("movie")} >
                ＜歌枠(動画)＞</button>
            <button type="button" onClick={() => setCrudContentType("karaoke")} >
                ＜歌(karaoke)＞</button>
            <br /><br />
            {
                crudContentType === "vtuber" &&
                <div>
                    VTuberを編集します。<br />
                </div>
            }
            {
                crudContentType === "movie" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName}<br />
                    &nbsp;&nbsp; の歌枠動画を編集します。
                </div>
            }
            {
                crudContentType === "karaoke" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName && foundVtuber?.VtuberName}<br />
                    歌枠動画：{foundMovie?.MovieTitle}
                    <br />
                    &nbsp;&nbsp; の歌と開始時間を編集します。
                </div>}<br />

            <form onSubmit={handleSubmit(onSubmit)}>
                {crudContentType === "vtuber" &&
                    <div>
                        空欄にした場合、既存データが維持されます<br />
                        ★Vtuber: <br />
                        &nbsp;&nbsp;VTuber名:
                        <input {...register("VtuberName", ValidateEditVtuberName)}
                            placeholder={foundVtuber?.VtuberName || "例:妹望おいも"}
                            onChange={e => setVtuberNameInput(e.target.value)}
                        /><br />
                        {errors.VtuberName?.message}
                        <br />

                        &nbsp;&nbsp;読み(kana):
                        <input {...register("VtuberKana", ValidateEditVtuberKana)}
                            placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"}
                            onChange={e => setVtuberKanaInput(e.target.value)}
                        /><br />
                        {errors.VtuberKana?.message}
                        <br />

                        &nbsp;&nbsp;紹介動画URL(時間指定可):
                        <input {...register("IntroMovieUrl", ValidateEditIntroMovieUrl)}
                            placeholder={foundVtuber?.IntroMovieUrl || "例:www.youtube.com/watch?v=AlHRqSsF--8"}
                            onChange={e => setIntroMovieUrInput(e.target.value)}
                        /><br />
                        {errors.IntroMovieUrl?.message} <br />
                    </div>}

                {crudContentType === "movie" &&
                    <div>
                        ★歌枠動画: <br />
                        &nbsp;&nbsp;タイトル：
                        <input {...register("MovieTitle", ValidateEditMovieTitle)}
                            placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                            onChange={e => setMovieTitleInput(e.target.value)}
                        /><br />
                        {errors.MovieTitle?.message}
                        <br />
                        &nbsp;&nbsp;URL:歌枠(動画)のURLは変更できません。
                        <br />
                        {!selectedVtuber && <div><br />プルダウンメニューからVtuberを選択してください</div>}
                    </div>}

                {crudContentType === "karaoke" &&
                    <div>
                        ★歌: <br />
                        &nbsp;&nbsp;曲名：
                        <input {...register("SongName", ValidateEditSingStart)}
                            placeholder={foundKaraoke?.SongName || "曲名"}
                            onChange={e => setSongNameInput(e.target.value)}
                        /><br />
                        {errors.SongName?.message}
                        <br />

                        &nbsp;&nbsp;開始時間:
                        <input {...register("SingStart", ValidateEditSongName)}
                            placeholder={foundKaraoke?.SingStart || "例 00:05:30"}
                            onChange={e => setSingStartInput(e.target.value)}
                        /><br />
                        {errors.SingStart?.message}

                        {!(selectedVtuber || selectedMovie) && <div><br />プルダウンメニューからVtuberと歌枠(動画)を選択してください</div>}
                    </div>}

                {!crudContentType && <>  登録するコンテンツを選択してください < br /></>}
                {crudContentType && <>
                    <button type="submit" >＜決定＞</button></>}
                <br /><br />

                {crudContentType == "vtuber" && "** url文末に & t=\"秒数\" のように入力できます。"}<br />
                {crudContentType == "vtuber" && "  例: www.youtube.com/watch?v=7QStB569mto&t=290"}<br />
            </form>
            <br /> &nbsp;
        </div >
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

    try {
        const res = await axios.get(`${domain.backendHost}/vcontents/`, options);
        const resData = res.data;
        return {
            props: {
                posts: resData,
                isSignin: isSignin,
            }
        }
    } catch (error) {
        console.log("erroe in axios.get:", error);
    }
    return {
        props: {
            posts: null,
            isSignin: isSignin,
        }
    }
}

export default EditPage;