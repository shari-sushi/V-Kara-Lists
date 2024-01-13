import React, { useState } from 'react';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

import { domain } from '@/../env'
import type { ReceivedKaraoke } from '@/types/vtuber_content';
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { KaraokePagenatoinTable } from '@/components/table/Karaoke';
import { Layout } from '@/components/layout/Layout'
import { ContextType } from '@/types/server'

type PostsAndCheckSignin = {
    posts: { vtubers_movies_karaokes: ReceivedKaraoke[] };
    isSignin: boolean;
}

export default function SingsPage({ posts, isSignin }: PostsAndCheckSignin) {
    const karaokes = posts?.vtubers_movies_karaokes || [{} as ReceivedKaraoke];

    // ようつべ用
    const primaryYoutubeUrl = "kORHSmXcYNc"
    const primaryYoutubeStartTime = ConvertStringToTime("00:08:29")
    const [currentMovieId, setCurrentMovieId] = useState<string>(primaryYoutubeUrl);
    const [start, setStart] = useState<number>(primaryYoutubeStartTime)
    const handleMovieClickYouTube = (url: string, start: number) => {
        console.log("handleMovieClickYouTube")
        // if (currentMovieId == ExtractVideoId(url)) {
        // setStart(-1); //timeに変化が無いと受け付けてもらえないので、苦肉の策
        // setStart(start);
        // console.log("同")
        // } else {
        setCurrentMovieId(ExtractVideoId(url));
        // setStart(start);
        //以下をonReady発火させられれば、ユーザー環境による差を少なくできるかも
        // setStart(-1);
        // setTimeout(function () {
        setStart(start);
        // console.log("別")
        // }, 1400); //短すぎるとエラーになる注意
    }
};

const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

return (
    <Layout pageName="Sings" isSignin={isSignin}>
        {/* <div>videoId= {currentMovieId}, start= {start}秒 = {Math.floor(start / 60)}分 {Math.floor(start % 60)}秒</div > */}
        <div className='flex flex-col w-full max-w-[1000px] mx-auto'>
            <div className={`pt-6 flex flex-col items-center`}>
                <div className={`flex `}>
                    <YouTubePlayer videoId={currentMovieId} start={start} />
                    {/* <div className='flex '>
                        <div className='bg-[#B7A692] text-black min-w-[350px] max-w-[300px] h-44 '>
                            <h2 className=' font-bold  '>選択した楽曲</h2>
                            <hr className='border-black ' />
                            Vtubre: {selectedPost.VtuberName} <br />
                            動画: {selectedPost.MovieTitle} <br />
                            URL: {selectedPost.MovieUrl} <br />
                            曲名: {selectedPost.SongName} <br />
                            歌開始: {selectedPost.SingStart} <br />
                        </div>
                    </div> */}
                </div>
                <div className="flex flex-col w-full">
                    <KaraokePagenatoinTable
                        posts={karaokes}
                        handleMovieClickYouTube={handleMovieClickYouTube}
                        setSelectedPost={setSelectedPost}
                    />
                </div>
            </div>
        </div>
    </Layout>
)
};


/////////////////////////////////////////////////////////////////////////////
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
        const res = await axios.get(`${domain.backendHost}/vcontents/sings`, options);
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

