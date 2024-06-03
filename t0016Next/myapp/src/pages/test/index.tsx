import React, { useState } from 'react';
import Link from 'next/link';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';
import Image from 'next/image'

import { domain } from '@/../../env'
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { Layout } from '@/components/layout/Layout'
import { VtuberTable } from '@/components/table/Vtuber'
import { MovieTable } from '@/components/table/Movie'
import { KaraokeThinTable, KaraokeMinRandamTable } from '@/components/table/Karaoke'
import { ToClickTW } from '@/styles/tailwiind'
import { ContextType } from '@/types/server'
import { TestLink } from './multi';

const pageName = "test"
const pageNum = 0

// http://localhost:80/test
type TopPage = {
    posts: {
        vtubers: ReceivedVtuber[];
        vtubers_movies: ReceivedMovie[];
        vtubers_movies_karaokes: ReceivedKaraoke[];
        latest_karaokes: ReceivedKaraoke[];
    };
    isSignin: boolean;
}

const TopPage = ({ posts, isSignin }: TopPage) => {
    const vtubers = posts?.vtubers || [{} as ReceivedVtuber];
    const movies = posts?.vtubers_movies || [{} as ReceivedMovie];
    const karaokes = posts?.vtubers_movies_karaokes || [{} as ReceivedKaraoke];
    const latestKaraokes = posts?.latest_karaokes || [{} as ReceivedKaraoke];
    const [start, setStart] = useState<number>(ConvertStringToTime("00:06:45"));
    const [currentMovieId, setCurrentMovieId] = useState<string>("AlHRqSsF--8");

    const handleMovieClickYouTube = (url: string, start: number) => {
        setCurrentMovieId(ExtractVideoId(url));
        setStart(start);
    };

    return (
        <Layout pageName={pageName} isSignin={isSignin}>
            <TestLink thisPageNum={pageNum} />
            <div>
                2024.03.05
            </div>
            <div className="flex justify-center md:flex-row flex-col m-6">
                <div className="w-full h-max p-8 bg-black">
                    〇環境変数取得テスト１ <br />
                    <hr />
                    process.env.NODE_ENV={process.env.NODE_ENV}
                    <br /><br />
                    ※取得できないとき、`process.env.NODE_ENV=`と空となる
                    <br /><br />
                    ローカルで、<br />
                    npm run devでは development <br />
                    npm run build/startでは production <br />
                    となった。
                </div>
                <div className="w-full h-max p-8 bg-black">
                    〇環境変数取得テスト２ <br />
                    <hr />
                    process.env.EXSAMPLE_TEST={process.env.EXSAMPLE_TEST}
                    <br /><br />
                    ※取得できないとき、`process.env.EXSAMPLE_TEST=`と空となる
                    ※3/25時点ではEXSAMPLE_TESTを設定してない
                    <br /><br />
                </div>
            </div>
            <div className='inline-block flex-col pt-1 items-center justify-center'>
                <div className='flex flex-col '>
                    <hgroup className='pb-1 md:pb-3 '>
                        <a>videoId= {currentMovieId}, start= {start}秒 = {Math.floor(start / 60)}分 {Math.floor(start % 60)}秒</a >
                        <h1 className="flex justify-center text-xl sm:text-2xl md:text-3xl font-bold underline ">
                            V-kara (VTuber-karaoke-Lists)
                        </h1>
                        <h2 className='flex justify-center text-sm  md:text-base'>
                            「推し」の「歌枠」の聴きたい「歌」
                        </h2>
                        <h2 className='flex justify-center text-xs ms:text-sm md:text-base '>
                            「ささっと把握」、「さくっと再生」、「ばばっと布教」
                        </h2>
                    </hgroup>
                </div>

                <div className='flex flex-col justify-center'>
                    <div id="feature"
                        className={`flex flex-col md:flex-row bg-[#657261] rounded
                max-w-[1000px]  md:h-[290px] h-[400px] w-full mx-auto
                top-0 p-1
                `}
                    >
                        {/* 左側の要素 */}
                        <div className='flex flex-col mr-1 '>
                            <div className='relative flex  justify-center'>
                                <YouTubePlayer videoId={currentMovieId} start={start} />
                            </div>
                            <span className='relative flex md:top-2 justify-center md:mb-3'>
                                {"音量差 注意（特に個人→大手）"}
                            </span>
                        </div>

                        {/* 右側の要素 */}
                        <div id="right" className={`relative w-full h-full border px-1 rounded `}>
                            <span className='mx-2 mt-1 absolute w-[70%]'>最近登録された50曲</span>

                            <Link href={`/sings/karaoke`}
                                className={
                                    `${ToClickTW.regular}
                     absolute flex right-1 top-[1px]  `}>
                                <Image src="/content/note.svg" width={20} height={20} alt="Note Icon" className="h-5 mx-1" />
                                もっと見る
                            </Link>

                            <div id="table"
                                className='absolute  mt-7 h-[82%] md:h-[88%] w-[98%] md:w-[99%] '>
                                <KaraokeThinTable
                                    posts={latestKaraokes}
                                    handleMovieClickYouTube={handleMovieClickYouTube}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 表達 */}
                    <div id="feature"
                        className={`flex-col md:flex-row justify-center
                max-w-[1000px] w-full mx-auto inline-block
                top-0 p-1
                `}
                    >
                        <div className='mt-4 max-w-[1000px] '>
                            <div className='flex '>
                                <Image src="/content/human_white.svg" width={20} height={20} alt="Note Icon" className="h-5 mx-1" />

                                <h2 className='h-5 flex-1 mb-1'>配信者</h2>
                            </div>
                            <VtuberTable posts={vtubers} /><br />

                            <h2 className='flex'>
                                <Image src="/content/movie.svg" width={20} height={20} alt="Note Icon" className="h-5 mx-1" />

                                歌枠(動画)
                            </h2 >
                            <MovieTable posts={movies} handleMovieClickYouTube={handleMovieClickYouTube} /><br />
                            <h2 className='flex'>
                                <Image src="/content/note.svg" width={20} height={20} alt="Note Icon" className="h-5 mx-1" />

                                歌
                            </h2>
                            <KaraokeMinRandamTable
                                posts={karaokes}
                                handleMovieClickYouTube={handleMovieClickYouTube}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
};
export default TopPage;

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
    try {
        const res = await axios.get(`${domain.backendHost}/vcontents/dummy-top-page`, options);
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
