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
    const karaokes = posts?.vtubers_movies_karaokes || [] as ReceivedKaraoke[];

    // ようつべ用
    const primaryYoutubeUrl = "5WzeYsoGCZc" //船長　kORHSmXcYNc, 00:08:29
    const primaryYoutubeStartTime = ConvertStringToTime("00:30:33")
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

    const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

    return (
        <Layout pageName="オリ曲" isSignin={isSignin}>
            {/* <div>videoId= {currentMovieId}, start= {start}秒 = {Math.floor(start / 60)}分 {Math.floor(start % 60)}秒</div > */}
            <div className="absolute flex justify-center w-screen h-screen opacity-85 inset-0 bg-[#1f2724] z-10 ">
                <div className='text-2xl font-bold my-[20%] bg- '>
                    開発中...... <br /><br />
                    coming soon......
                </div>
            </div>
            <div className='flex flex-col w-full max-w-[1000px] mx-auto'>
                <div className={`pt-6 flex flex-col items-center`}>
                    <div className={`flex `}>
                        <YouTubePlayer videoId={currentMovieId} start={start} />
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
}

/////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps(context: ContextType) {
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    console.log("sessionToken", sessionToken)
    let isSignin = false
    if (sessionToken) {
        isSignin = true
    }
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const options: AxiosRequestConfig = {
        headers: {
            cookie: `auth-token=${sessionToken}`,
        },
        withCredentials: true,
        httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
    };

    let resData = null;
    try {
        const res = await axios.get(`${domain.backendHost}/vcontents/orignal-song`, options);
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

