import { useRouter } from "next/router";
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import style from '../Youtube.module.css';
import type { CrudDate, ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content'; //type{}で型情報のみインポート
// import DeleteButton from '../components/DeleteButton';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import { YouTubePlayer } from '@/components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { domain } from '@/../env'
import { Header } from '@/components/layout/Layout'
import { VtuberDeleteTable } from '@/components/table/Vtuber'
import { MovieDeleteTable } from '@/components/table/Movie'
import { KaraokeDeleteTable } from '@/components/table/Karaoke'

export const ToDeleteContext = React.createContext({} as {
    toDeleteVtuberId: number;
    setToDeleteVtuberId: React.Dispatch<React.SetStateAction<number>>;
    toDeleteMovieUrl: string;
    setToDeleteMovieUrl: React.Dispatch<React.SetStateAction<string>>;
    toDeleteKaraokeId: number;
    setToDeleteKaraokeId: React.Dispatch<React.SetStateAction<number>>;
    setCurrentVideoId: React.Dispatch<React.SetStateAction<string>>;
    setCurrentStart: React.Dispatch<React.SetStateAction<number>>;
})

type MyPagePosts = {
    vtubers_movies_karaokes_u_created: ReceivedKaraoke[];
    vtubers_movies_u_created: ReceivedMovie[];
    vtubers_u_created: ReceivedVtuber[];
}

type Mypage = {
    posts: MyPagePosts;
    isSignin: boolean;
}

export const DeletePage = ({ posts, isSignin }: Mypage) => {
    const vtubers = posts?.vtubers_u_created != null ? posts.vtubers_u_created : [{} as ReceivedVtuber];
    const movies = posts?.vtubers_movies_u_created != null ? posts.vtubers_movies_u_created : [{} as ReceivedMovie];
    const karaokes = posts?.vtubers_movies_karaokes_u_created != null ? posts.vtubers_movies_karaokes_u_created : [{} as ReceivedKaraoke];

    const [toDeleteVtuberId, setToDeleteVtuberId] = useState<number>(0);
    const [toDeleteMovieUrl, setToDeleteMovieUrl] = useState<string>("");
    const [toDeleteKaraokeId, setToDeleteKaraokeId] = useState<number>(0);
    const [currentVideoId, setCurrentVideoId] = useState<string>("LnL8i4c8sfo");
    const [currentStart, setCurrentStart] = useState<number>(0);

    //プルダウンの選択時に埋め込みに反映するuseEffect 2つ
    useEffect(() => {
        if (toDeleteVtuberId && !toDeleteMovieUrl) {
        }
        if (toDeleteVtuberId && toDeleteMovieUrl) {
            const foundMovie = movies.find(movies => movies.MovieUrl === toDeleteMovieUrl);
            if (foundMovie) {
                const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
                setCurrentVideoId(foundYoutubeId);
                setCurrentStart(1)
            }
        }
    }, [toDeleteVtuberId, toDeleteMovieUrl, movies]);

    useEffect(() => {
        if (toDeleteVtuberId && toDeleteMovieUrl && toDeleteKaraokeId) {
            const foundMovies = movies.filter(karaoke => karaoke.MovieUrl === toDeleteMovieUrl);
            const foundKaraoke = karaokes.find(karaoke => karaoke.KaraokeId === toDeleteKaraokeId)
            if (foundKaraoke) {
                const foundSingStart = ConvertStringToTime(foundKaraoke.SingStart);
                setCurrentStart(foundSingStart);
            }
        }
    }, [toDeleteVtuberId, toDeleteMovieUrl, toDeleteKaraokeId, movies]);

    return (
        <Header pageName="データベース削除" isSignin={isSignin}>
            <div>
                selectedVtuberId: {toDeleteVtuberId} <br />
                selectedMovieUrl: {toDeleteMovieUrl} <br />
                selectedKaraokeId: {toDeleteKaraokeId}<br />
                <ToDeleteContext.Provider
                    value={{
                        toDeleteVtuberId, setToDeleteVtuberId,
                        toDeleteMovieUrl, setToDeleteMovieUrl,
                        toDeleteKaraokeId, setToDeleteKaraokeId,
                        setCurrentStart, setCurrentVideoId,
                    }}>
                    <YouTubePlayer videoId={currentVideoId} start={currentStart} /><br />
                    <VtuberDeleteTable posts={vtubers}
                    /><br />
                    <MovieDeleteTable posts={movies} /><br />
                    <KaraokeDeleteTable posts={karaokes} />
                    <DeleteButton
                        posts={posts}
                        selectedVtuberId={toDeleteVtuberId}
                        selectedMovieUrl={toDeleteMovieUrl}
                        selectedKaraokeId={toDeleteKaraokeId}
                    /><br />
                </ToDeleteContext.Provider>
            </div>
        </Header >
    )
};

export default DeletePage;
/////////////////////////////////////////////////////////////////////////////////////////
type selectedDate = {
    posts: MyPagePosts;
    selectedVtuberId: number;
    selectedMovieUrl: string;
    selectedKaraokeId: number;
}

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

export function DeleteButton({ posts, selectedVtuberId, selectedMovieUrl, selectedKaraokeId }: selectedDate) {
    const vtubers = posts?.vtubers_u_created != null ? posts.vtubers_u_created : [{} as ReceivedVtuber];
    const movies = posts?.vtubers_movies_u_created != null ? posts.vtubers_movies_u_created : [{} as ReceivedMovie];
    const karaokes = posts?.vtubers_movies_karaokes_u_created != null ? posts.vtubers_movies_karaokes_u_created : [{} as ReceivedKaraoke];

    const foundVtuber = vtubers.find(vtuber => vtuber.VtuberId === selectedVtuberId);
    const foundMovie = movies.find(movie => movie.MovieUrl === selectedMovieUrl);
    const foundKaraoke = karaokes.find(karaoke => karaoke.KaraokeId === selectedKaraokeId)

    const [crudContentType, setCrudContentType] = useState<string>("")
    useEffect(() => {
        if (selectedVtuberId) {
            setCrudContentType("vtuber")
            console.log("setCrudContentType(\"vtuber\")")
        }
    }, [selectedVtuberId])
    useEffect(() => {
        if (selectedMovieUrl) {
            setCrudContentType("movie")
        }
    }, [selectedMovieUrl])
    useEffect(() => {
        if (selectedKaraokeId) {
            setCrudContentType("karaoke")
        }
    }, [selectedKaraokeId])


    const axiosClient = axios.create({
        baseURL: `${domain.backendHost}/vcontents`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const handleClick = async () => {
        if (crudContentType === "vtuber" && foundVtuber?.VtuberName) {
            try {
                const reqBody: DeleteVtuber = {
                    VtuberId: selectedVtuberId,        //deleteで必須
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
                    VtuberId: selectedVtuberId,     //deleteで必須
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
                    MovieUrl: selectedMovieUrl,      //deleteで必須
                    KaraokeId: selectedKaraokeId,    //deleteで必須
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
            console.log("selectedMovieUrl=", selectedMovieUrl)
        } else {
            console.log("削除するデータの種類(vtuber, movie, karaoke)の選択、またはで想定外のエラーが発生しました。")
        }
    };;

    const { setToDeleteVtuberId, setToDeleteMovieUrl, setToDeleteKaraokeId } = useContext(ToDeleteContext);
    const canselClickHandler = () => {
        setCrudContentType("");
        setToDeleteVtuberId(0);
        setToDeleteMovieUrl("");
        setToDeleteKaraokeId(0);
    }

    return (
        <div>
            {crudContentType === "vtuber" &&
                <div>
                    VTuber：{foundVtuber?.VtuberName}<br />
                    &nbsp;&nbsp; を削除しまか？
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
                    &nbsp;&nbsp; を削除しますか？
                </div>}<br />
            {crudContentType &&
                <div>
                    <button onClick={handleClick} >決定</button>
                    <button onClick={() => canselClickHandler()} >キャンセル</button>
                </div>}
        </div>
    );
}

//////////////////////////////////////////////////////
type ContextType = {
    req: { headers: { cookie?: string; }; };
    res: {
        writeHead: (statusCode: number, headers: Record<string, string>) => void;
        end: () => void;
    };
};

export async function getServerSideProps(context: ContextType) {
    const rawCookie = context.req.headers.cookie;

    // Cookieが複数ある場合に必要？
    // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
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
        const res = await axios.get(`${domain.backendHost}/users/mypage`, options);
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