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

const pageName = "オリ曲"

type PostsAndCheckSignin = {
    posts: { vtubers_movies_karaokes: ReceivedKaraoke[] };
    isSignin: boolean;
}

export default function SingsPage({ posts, isSignin }: PostsAndCheckSignin) {
    const karaokes = posts?.vtubers_movies_karaokes || [] as ReceivedKaraoke[];

    const primaryYoutubeUrl = "HcpFGZNusBw" //船長　kORHSmXcYNc, 00:08:29
    const primaryYoutubeStartTime = ConvertStringToTime("")
    const [currentMovieId, setCurrentMovieId] = useState<string>(primaryYoutubeUrl);
    const [start, setStart] = useState<number>(primaryYoutubeStartTime)
    const handleMovieClickYouTube = (url: string, start: number) => {
        setCurrentMovieId(ExtractVideoId(url));
        setStart(start);
    }

    const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

    return (
        <Layout pageName={pageName} isSignin={isSignin}>
            <div className="absolute flex justify-center w-screen h-screen opacity-85 inset-0 bg-[#1f2724] z-10 ">
                <div className='text-2xl font-bold my-[20%] bg- '>
                    開発中...... <br /><br />
                    coming soon......

                    <button></button>
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
    let isSignin = false
    if (sessionToken) {
        isSignin = true
    }
    console.log("pageName, sessionToken, isSigni =", pageName, sessionToken, isSignin) //アクセス数記録のため

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const options: AxiosRequestConfig = {
        headers: {
            cookie: `auth-token=${sessionToken}`,
        },
        withCredentials: true,
        httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
    };

    let resData = null;
    // try {
    // const res = await axios.get(`${domain.backendHost}/vcontents/orignal-song`, options);
    // resData = res.data;
    // } catch (error) {
    // console.log("erroe in axios.get:", error);
    // }
    return {
        props: {
            posts: resData,
            isSignin: isSignin,
        }
    }
}

