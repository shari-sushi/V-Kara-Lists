// import isLoggedIn from "../lib/auth"
import { useEffect, useState } from "react"
import type { User } from "../../types/user"
import { useRouter } from "next/router";
import Link from 'next/link';
// import { getAllCookies } from "../lib/getallcookie";
import https from 'https';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { GetLogout, Withdraw } from '../../components/authButton';
import { domain } from '../../../env'

type Mypage = {
    listener: User;
    checkAuth: boolean;
}



const MyPage = ({ listener, checkAuth }: Mypage) => {
    // if (checkAuth === false) {
    //   const message = "ログインしてください"
    //   window.alert(message)
    //   alert(message);
    // }; Node.js開発環境だとダメっぽい？
    // console.log("listener, checkAuth",listener, checkAuth)
    return (
        <div>
            <h2>会員情報</h2>
            {listener && checkAuth ? (
                <ul>
                    <li>メンバーID: {listener?.ListenerId}</li>
                    <li>メンバー名: {listener?.ListenerName} </li>
                    <li>パスワード: {listener?.Password}</li>
                    <li>メアド  : {listener?.Email}</li>
                    <li>登録日  : {listener.CreatedAt?.toString()}</li>
                    <GetLogout />
                    <Withdraw />
                </ul>
            ) : (
                <div>
                    ログインしてください <br />
                    <Link href="/signin">
                        <button style={{ background: '' }}>
                            ログインへ</button>
                    </Link>
                    <Link href="/signup"><button>
                        会員登録へ</button>
                    </Link>
                </div>
            )}
            <br />
            <Link href="/"><button>TOPへ</button>
            </Link>
        </div>
    );
}

export default MyPage;


type ContextType = {
    req: { headers: { cookie?: string; }; };
    res: {
        writeHead: (statusCode: number, headers: Record<string, string>) => void;
        end: () => void;
    };
};

export async function getServerSideProps(context: ContextType) {
    const rawCookie = context.req.headers.cookie;
    console.log("rawCookie=", rawCookie, "\n")
    var CheckSignin = false

    // Cookieが複数ある場合に必要？
    // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];

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
        const res = await axios.get(`${domain.backendHost}/v1/users/profile`, options);
        resData = res.data;
        CheckSignin = true
    } catch (error) {
        console.log("erroe in axios.get:", error);
        return {
            props: {
                listener: resData,
                checkAuth: CheckSignin,
            }
        };
    }
    return {
        props: {
            listener: resData, checkAuth: CheckSignin,
        }
    }
}