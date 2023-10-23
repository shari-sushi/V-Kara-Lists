// import isLoggedIn from "../lib/auth"
import { useEffect, useState } from "react"
import type { User } from "../types/usertype"
import { useRouter } from "next/router";
import Link from 'next/link';
// import { getAllCookies } from "../lib/getallcookie";
import https from 'https';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import {GetLogout} from '../components/authButton';

type Mypage ={
  listener:User;
  checkAuth:boolean;
}

const MyPage = ({ listener, checkAuth}:Mypage) => {
  console.log("listener, checkAuth",listener, checkAuth)
  return (
    <div>
      <h2>会員情報</h2>
      {listener ? (  
      <ul>
        <li>メンバーID: {listener?.ListenerId}</li>
        <li>メンバー名: {listener?.ListenerName} </li>
        <li>パスワード: {listener?.Password}</li>
        <li>メアド  : {listener?.Email}</li>
        <li>登録日  : {listener.CreatedAt?.toString()}</li>
      <GetLogout/>
      </ul>
      ):(
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

// // アクセス制御
// MyPage.getAccessControl = () => {
//   console.log("getAccessControl起動")
//   return isLoggedIn() ? { type: 'replace', destination: '/signin' } : null
// }

export default MyPage;

type ContextType = {
  req: { headers: { cookie?: string;  };  };
  res: {
    writeHead: (statusCode: number, headers: Record<string, string>) => void;
    end: () => void;
  };
};

export async function getServerSideProps (context: ContextType){
  const rawCookie = context.req.headers.cookie;
  console.log("rawCookie=", rawCookie, "\n")
  var CheckSignin = false

  // Cookieが複数ある場合に必要？
  // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
  const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    // Signinしていればtrueを返す
    // if(!sessionToken){
    //   context.res.writeHead(302, { Location: '/' });
    //   context.res.end();
    //   return { props: {} }; // コードの構造上必要なので空のオブジェクトを返してるが、ここまで処理は進まない。
    //   }

  // サーバーの証明書が認証されない自己証明書でもHTTPSリクエストを継続する
  const httpsAgent = new https.Agent({rejectUnauthorized: false});

  const options: AxiosRequestConfig = {
    headers: {
      'Cache-Control': 'no-store', //cache(キャッシュ)を無効にする様だが、必要性理解してない
      cookie: `auth-token=${sessionToken}`,
    },
    withCredentials: true,  //HttpヘッダーにCookieを含める
    httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
  };

  let resData=null;
  try {
  const res = await axios.get('https://localhost:8080/users/profile', options);
  resData = res.data;
  CheckSignin = true
  } catch (error) {
    console.log("erroe in axios.get:", error);
    // context.res.writeHead(302, { Location: '/' }); //writeheadで設定
    // context.res.end();                             //endを呼び出してレスポンス終了しクライアントに送信
    return { 
      props: {
        listener :resData, 
        checkAuth:CheckSignin,
      }}; // コードの構造上必要なので空のオブジェクトを返してるが、ここまで処理は進まない。
  }
  return {
    props: {
      listener :resData, checkAuth:CheckSignin,
    }
  }
}
    // sessionToken=
    //   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    //  .eyJleHAiOjE2OTc4MTgyMDEsInVzZXJfaWQiOiJMMyJ9
    //  .-kju8WBC5CXPuXzCLJSSqyqU8vv3w2Wvbj7Qez9KcC8