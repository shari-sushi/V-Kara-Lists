import React, { useState, useEffect } from 'react';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import Link from 'next/link';

import { domain } from '@/../env'
import { Layout } from '@/components/layout/Layout'
import { ToClickTW } from '@/styles/tailwiind';
import type { ReceivedKaraoke, ReceivedMovie, ReceivedVtuber } from '@/types/vtuber_content';
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { KaraokePagenatoinTable } from "@/components/table/Karaoke"
import { DropDownAllMovie } from '@/components/dropDown/Movie';
import { NotFoundVtuber } from '@/components/layout/Main';
import { GetServerSidePropsContext } from 'next';

const pageName = "Vtuber特設ページ"

type VtuberPage = {
    posts: {
        vtubers: ReceivedVtuber[];
        vtubers_movies: ReceivedMovie[];
        vtubers_movies_karaokes: ReceivedKaraoke[];
    };
    isSignin: boolean;
}

export default function SingsPage({ posts, isSignin }: VtuberPage) {
    const movies = posts?.vtubers_movies || [] as ReceivedMovie[];
    const karaokes = posts?.vtubers_movies_karaokes || [] as ReceivedKaraoke[];

    const primaryYoutubeUrl = "kORHSmXcYNc" //船長　 
    const primaryYoutubeStartTime = ConvertStringToTime("00:08:29")
    const [currentMovieId, setCurrentMovieId] = useState<string>(primaryYoutubeUrl);
    const [start, setStart] = useState<number>(primaryYoutubeStartTime)
    const handleMovieClickYouTube = (url: string, start: number) => {
        setCurrentMovieId(ExtractVideoId(url));
        setStart(start);
    }

    const [selectedPost, setSelectedPost] = useState<ReceivedKaraoke>({} as ReceivedKaraoke)

    const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [filteredKaraokes, setFilteredKarakes] = useState<ReceivedKaraoke[]>([]);
    const clearMovieHandler = () => {
    };

    useEffect(() => {
        const filterdkaraokes = FilterKaraokesByUrl(karaokes, selectedMovie)
        setFilteredKarakes(filterdkaraokes)
    }, [selectedVtuber, selectedMovie]);

    if (movies.length == 0) {
        return (
            <Layout pageName={pageName} isSignin={isSignin}>
                <div className='flex flex-col w-full max-w-[1000px] mx-auto'>
                    <div className={`pt-6 flex flex-col items-center`}>
                        <div className={`flex`}>
                            <div id="feature"
                                className={`flex flex-col md:flex-row bg-[#657261] rounded
                                max-w-[1000px]  md:h-[265px] h-full w-full mx-auto
                                top-0 p-1 `
                                }
                            >
                                {/* 左側の要素 */}
                                <div className='flex flex-col mr-1 '>
                                    <div className='relative flex  justify-center'>
                                        <YouTubePlayer videoId={currentMovieId} start={start} />
                                    </div>
                                </div>

                                {/* 右側の要素 */}
                                <div id="right" className={`relative  px-1 rounded border`}>
                                    <NotFoundVtuber />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageName={`pageName`} isSignin={isSignin}>
            <div className='flex flex-col w-full max-w-[1000px] mx-auto'>
                <div className={`pt-6 flex flex-col items-center`}>
                    <div className={`flex`}>
                        <div id="feature"
                            className={`flex flex-col md:flex-row bg-[#657261] rounded
                                max-w-[1000px]  md:h-[265px] h-full w-full mx-auto
                                top-0 p-1
                            `}
                        >
                            {/* 左側の要素 */}
                            <div className='flex flex-col mr-1 '>
                                <div className='relative flex  justify-center'>
                                    <YouTubePlayer videoId={currentMovieId} start={start} />
                                </div>
                            </div>

                            {/* 右側の要素 */}
                            <div id="right" className={`relative  px-1 rounded border`}>
                                <div className='flex py-3 text-black bg-[#FFF6E4] justify-center rounded-xl'>
                                    <span className='text-xl font-bold mr-2'> {karaokes?.[0].VtuberName}</span>
                                    <span className='mt-1'>の歌枠</span>
                                </div>
                                <span >動画絞込み（入力できます）</span>
                                <DropDownAllMovie
                                    posts={posts}
                                    setSelectedMovie={setSelectedMovie}
                                    clearMovieHandler={clearMovieHandler}
                                />
                                <div className='pt-5'>
                                    <span>お探しの歌枠や歌がありませんか？</span> <br />
                                    <Link className={`${ToClickTW.regular} justify-center float-right px-3 mr-2`}
                                        href="/crud/create" >データを登録する</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <KaraokePagenatoinTable
                        posts={filteredKaraokes}
                        handleMovieClickYouTube={handleMovieClickYouTube}
                        setSelectedPost={setSelectedPost}
                    />
                </div>
            </div>
        </Layout>
    )
}

const FilterKaraokesByUrl = (karaokes: ReceivedKaraoke[], selectedMovie: string) => {
    if (selectedMovie == "") {
        return karaokes
    } else {
        const choiceKaraoke = karaokes.filter((karaokes: ReceivedKaraoke) => karaokes.MovieUrl === selectedMovie);
        return choiceKaraoke
    }
}

/////////////////////////////////////////////////////////////////////////////
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const kana = context.query.vtuber_kana;

    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    let isSignin = false
    if (sessionToken) {
        isSignin = true
    }

    console.log("pageName, kana, sessionToken, isSigni =", pageName, kana, sessionToken, isSignin) //アクセス数記録のため

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
        const res = await axios.get(`${domain.backendHost}/vcontents/vtuber/${kana}`, options);
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

