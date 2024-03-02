import { useEffect, useState } from "react"
import https from 'https';
import axios, { AxiosRequestConfig } from "axios";

import { domain } from '@/../env'
import type { User } from "@/types/user"
import { GetLogout, Withdraw } from '@/components/button/User';
import { Layout } from "@/components/layout/Layout";
import { NotLoggedIn } from "@/components/layout/Main";

type Mypage = {
    listener: User;
    isSignin: boolean;
}

const Profile = ({ listener, isSignin }: Mypage) => {
    if (!isSignin) {
        return (
            <Layout pageName={"MyPage"} isSignin={isSignin}>
                <div>
                    < NotLoggedIn />
                </div>
            </Layout>
        )
    };

    return (
        <Layout pageName={"MyPage"} isSignin={isSignin}>
            <div className="mt-6">
                <h2>会員情報</h2>
                <ul>
                    <li>メンバー名: {listener?.ListenerName} </li>
                    <li>登録日  : {listener?.CreatedAt?.toString()}</li>
                    <br />
                    <GetLogout /> <br /><br />

                    <Withdraw />
                </ul>
            </div>
        </Layout>
    );
}

export default Profile;


/////////////////////////////////////////////////////////////////////////////
import { ContextType } from '@/types/server'

export async function getServerSideProps(context: ContextType) {
    const rawCookie = context.req.headers.cookie;
    console.log("rawCookie=", rawCookie, "\n")

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

    let resData = null;
    try {
        const res = await axios.get(`${domain.backendHost}/users/profile`, options);
        resData = res.data;
        isSignin = true
    } catch (error) {
        console.log("erroe in axios.get:", error);
        return {
            props: {
                listener: resData,
                isSignin: isSignin,
            }
        };
    }
    return {
        props: {
            listener: resData,
            isSignin: isSignin,
        }
    }
}