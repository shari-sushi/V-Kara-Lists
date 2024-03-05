import { useEffect, useState } from 'react';
import Link from 'next/link';
import https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

import { domain } from '@/../env'
import type { ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import type { ContextType } from '@/types/server'
import { Layout } from '@/components/layout/Layout'
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer'
import { ConvertStringToTime, ExtractVideoId } from '@/components/Conversion'
import { CreateForm, CreatePageProps } from '@/components/form/CreateContentForm';
import { NotLoggedIn } from '@/components/layout/Main';

const pageName = "コンテンツ登録"

export const CreatePage = ({ posts, isSignin }: CreatePageProps) => {
    if (!isSignin) {
        return (
            <Layout pageName={pageName} isSignin={isSignin}>
                <div>
                    < NotLoggedIn />
                </div>
            </Layout>
        )
    };

    const movies = posts?.vtubers_movies || [] as ReceivedMovie[];
    const karaokes = posts?.vtubers_movies_karaokes || [] as ReceivedKaraoke[];

    const [selectedVtuber, setSelectedVtuber] = useState<number>(0);
    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);
    const [currentVideoId, setCurrentVideoId] = useState<string>("9ehwhQJ50gs");
    const [currentStart, setCurrentStart] = useState<number>(0);

    useEffect(() => {
        const foundMovie = movies.find(movies => movies.MovieUrl === selectedMovie)
        if (foundMovie) {
            const foundYoutubeId = ExtractVideoId(foundMovie.MovieUrl);
            setCurrentVideoId(foundYoutubeId);
            setCurrentStart(1)
        }
    }, [selectedMovie]);

    const clearMovieHandler = () => {
        //中身空でもKaraokeのoptinosを空にしてくれるんだが…
        // でもこの関数をまるっと消すとダメ

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
        <Layout pageName={pageName} isSignin={isSignin}>
            <div id="body" className='flex flex-col w-full'>
                <div id="explain" className='flex justify-center text-sm my-4 ' >
                    <div className='' >
                        <div className='my-3'>
                            <h1 className='bg-gray-600 w-[180px]'>〇会員について</h1>
                            <li>現在、データの編集・削除の権限はそのデータ登録者本人とサイト管理者のみが所持しています。</li>
                            <li>ご自身の登録データは
                                <Link href="/user/mypage" className='underline underline-offset-1'>
                                    マイページ
                                </Link>
                                で確認できます。
                            </li>
                        </div>

                        <div className=''>
                            <h1 className='bg-gray-600 w-[180px]'>〇ゲストユーザーについて</h1>
                            <li>不要なデータでもお試し登録okです(後で削除していただけたら幸いです。)</li>
                            <li>登録データは「最近登録された50曲」には表示されません。</li>
                            <li>登録データは予告無く、削除または別ユーザーへ管理権限を譲渡することがあります。</li>
                        </div>
                    </div>
                </div>

                <div id="feature"
                    className={`flex flex-col w-full max-w-[1000px] mx-auto`}>
                    <div className='inline-block flex-col top-0 mx-auto '>
                        <div className='inline-block mx-auto md:mx-0 md:min-h-[255px] p-0 md:px-3'>
                            <YouTubePlayer videoId={currentVideoId} start={currentStart} />
                        </div>
                    </div>

                    <div id="form" className={`
                       inline-block flex-col top-0 max-w-[1000px] h-[600px]
                    `}
                    >
                        <div className='mt-1'>
                            <CreateForm
                                posts={posts}
                                selectedVtuber={selectedVtuber}
                                selectedMovie={selectedMovie}
                                selectedKaraoke={selectedKaraoke}
                                setSelectedVtuber={setSelectedVtuber}
                                setSelectedMovie={setSelectedMovie}
                                setSelectedKaraoke={setSelectedKaraoke}
                                clearMovieHandler={clearMovieHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
};

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
export default CreatePage;