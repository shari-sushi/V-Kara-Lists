import { domain } from '../../../env'
import React, { useEffect, useState, StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import Link from 'next/link';
import { CellProps } from 'react-table';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import style from '../../style/Youtube.module.css';
import type { ReceivedKaraoke, ReceivedVtuber, ReceivedMovie } from '../../types/vtuber_content'; //type{}で型情報のみインポート
import { YouTubePlayer } from '../../components/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '../../components/Conversion'
import { Checkbox } from '../../components/SomeFunction';
import { KaraokeTable, KaraokePagenatoinTable } from '../../components/table/Karaoke';
import { Header } from '../../components/layout/Layout'


type PostsAndCheckSignin = {
    posts: { vtubers_movies_karaokes: ReceivedKaraoke[] };
    checkSignin: boolean;
}

export const YouTubePlayerContext = React.createContext({} as {
    currentMovieId: string
    setCurrentMovieId: React.Dispatch<React.SetStateAction<string>>
    start: number
    setStart: React.Dispatch<React.SetStateAction<number>>
    handleMovieClickYouTube(movieId: string, time: number): void
})

export default function AllDatePage({ posts, checkSignin }: PostsAndCheckSignin) {
    const karaokes = posts.vtubers_movies_karaokes || {}

    // ようつべ用
    const primaryYoutubeUrl = "kORHSmXcYNc"
    const primaryYoutubeStartTime = ConvertStringToTime("00:08:29")// 60 * 8 + 29 //60*25か60*47かなー, 60*7+59, 60*8+29
    const [currentMovieId, setCurrentMovieId] = useState<string>(primaryYoutubeUrl);
    const [start, setStart] = useState<number>(primaryYoutubeStartTime)
    const [isRandomOrAll, setIsRandomOrAll] = useState(false);
    const handleMovieClickYouTube = (url: string, start: number) => {
        // setCurrentMovieId(ExtractVideoId(url));
        // setStart(start);
        console.log("handleMovieClickYouTube")
        if (currentMovieId == ExtractVideoId(url)) {
            setStart(-1); //timeに変化が無いと受け付けてもらえないので、苦肉の策
            setStart(start);
            console.log("同じ")
        } else {
            setCurrentMovieId(ExtractVideoId(url));
            // setStart(start);
            //以下をonReady発火させられれば、ユーザー環境による差を少なくできる気がする
            setStart(-1);
            setTimeout(function () {
                setStart(start);
                console.log("別")
            }, 1300); //local環境で、1100ms 高確率で✖, 1300ms:✖が少なくない //短すぎるとエラーになる注意
        }
    };


    return (
        <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube, currentMovieId, setCurrentMovieId, start, setStart }}>
            <Header pageName="Sings" checkSignin={checkSignin}>
                <div>
                    <a>{checkSignin && "ログイン中" || '非ログイン中'}</a><br />
                    <br />
                    <button onClick={() => setStart(600)}>10分</button>
                    <button onClick={() => setStart(900)}>15分</button> <br />
                    <a>videoId= {currentMovieId}, start= {start}秒 = {Math.floor(start / 60)}分 {Math.floor(start % 60)}秒</a >
                    <br /><br />
                    <YouTubePlayer videoId={currentMovieId} start={start} />
                    <Checkbox checked={isRandomOrAll}
                        onChange={() => setIsRandomOrAll((state) => !state)} >：分割表示⇔全件表示(全{karaokes?.length}件)
                        &nbsp; {isRandomOrAll && "全件表示中(昇順/降順 可)" || "分割表示中"}
                    </Checkbox>

                    {isRandomOrAll
                        && <KaraokeTable posts={karaokes} />
                        || <KaraokePagenatoinTable posts={karaokes} />
                    }
                </div>
            </Header>
        </YouTubePlayerContext.Provider>
    )
};

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
    var checkSignin = false
    if (sessionToken) {
        checkSignin = true
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
        const res = await axios.get(`${domain.backendHost}/vcontents/sings`, options);
        resData = res.data;
    } catch (error) {
        console.log("erroe in axios.get:", error);
    }
    return {
        props: {
            posts: resData,
            checkSignin: checkSignin,
        }
    }
}

