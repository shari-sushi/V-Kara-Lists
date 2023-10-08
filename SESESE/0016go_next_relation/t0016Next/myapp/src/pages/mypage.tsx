import isLoggedIn from "../lib/auth"
import { VFC, useEffect, useState } from "react"
import type { User } from "../types/usertype"
import { useRouter } from "next/router";
import Link from 'next/link';
import { getAllCookies } from "../lib/getallcookie";
import https from 'https';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';



type WithGetAccessControl<P> = P & {
  getAccessControl?: GetAccessControl;
}


// const MyPage: WithGetAccessControl<VFC<{ data: User }>> = ({ data }) => {
  const MyPage: WithGetAccessControl<{ data: User }> = ({ data }) => {
    const [user, setData] = useState<User[]>();

    const router = useRouter();

  useEffect(() => {
    console.log("test1")

    if (data) {
      setData(data.User);
    console.log("data:", data)
    console.log("data.User", data.User)

    console.log("test2")

      // setData2(posts.streamerstoMovies);
  }
    if (!data) {
      // router.push('/signin');
    console.log("data is nil")

    }
},[data]);
  console.log("useEffect後のdata:", data)


  return (
    <div>
      <h2>会員情報</h2>
      <ul>
        <li>メンバーID: {data.MemberId}</li>
        <li>メンバー名: {data.MemberName} </li>
        <li>パスワード: {data.Password}</li>
        <li>メアド  : {data.Email}</li>
        <li>登録日  : {data.CreatedAt?.toString()}</li>
      </ul>
      {!data ? (
        
      <Link href="/signin"><button style={{ background: 'darkblue' }}>       
                ログイン</button>  &nbsp;    
            </Link>
      ):(
    <Link href="/"><button style={{ background: 'darkblue' }}>       
    ログアウト(開発中)</button>  &nbsp;    
</Link>
      )}
    </div>
  );
}

// アクセス制御
MyPage.getAccessControl = () => {
  console.log("getAccessControl起動")
  return isLoggedIn() ? { type: 'replace', destination: '/signin' } : null
}



export default MyPage;

// export const getServerSideProps = async (context: { req: { headers: { cookie: any; }; }; }) => {
  export async function getServerSideProps (context: { req: { headers: { cookie: any; }; }; }) {
  const rawCookie = context.req.headers.cookie;

  console.log("rawCookie=", rawCookie, "\n")

  // Cookieが複数ある場合に必要？
  // cookie.trim()   cookieの文字列の前後の全ての空白文字(スペース、タブ、改行文字等)を除去する
  const sessionToken = rawCookie?.split(';').find(cookie => cookie.trim().startsWith('auth-token='))?.split('=')[1];

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
 
  let resData;
  try {
  const res = await axios.get('https://localhost:8080/users/profile', options);
  resData = res.data;
  } catch (error) {
    // throw new Error('Network response has err');
  console.log("axios.getでerroe:", error)
  }


  // console.log("res:", res.data)
  console.log("data:", resData)

  return {
    props: {
      data :resData
    }
  }
}
    // sessionToken=
    //   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    //  .eyJleHAiOjE2OTc4MTgyMDEsInVzZXJfaWQiOiJMMyJ9
    //  .-kju8WBC5CXPuXzCLJSSqyqU8vv3w2Wvbj7Qez9KcC8




  
// ****memo****
  {/* <Link href={`${data.url}&t=${data.singStart}`}>動画サイト</><br />
  {`↑${data.url}&t=${data.singStart}`}<br></br>
  <button color="red" >戻る </button>
  <Link href="/">戻る </>
  <Link href={`/edit?Unique_id=${data.unique_id}`}>編集</Link><br /> */}

  // // Fetch APiでのコード
  // const options: RequestInit = {
  //   headers: {
  //     cookie: `auth-token=${sessionToken}`,
  //   },
  //   cache: "no-store",　//cashを無効にする(?)
  //   credentials: 'include',
  // };
  // const res = await fetch('https://localhost:8080/users/profile', options);
  // const data = await res.json();
