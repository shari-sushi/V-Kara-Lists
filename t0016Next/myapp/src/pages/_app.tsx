// https://zenn.dev/junnuj/articles/fb0ca45967c6c2

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}> 
      <Component {...pageProps} />
    </SessionProvider>
  );
}

{/* <SessionProvider session={session}> でsession情報を参照している */}

export default MyApp;


// ----------------
// import { SessionProvider } from 'next-auth/react'; //セッションへアクセスするモジュール
// import { useState, useEffect } from 'react';
// import type { AllData, Streamer, StreamerMovie } from '../types/singdata'; //type{}で型情報のみインポート
// import type { User } from '../types/usertype'; //type{}で型情報のみインポート



// function MyApp({ Component, pageProps: { session, ...otherProps } }) {
//     console.log(session);
  
//     return (
//       <SessionProvider session={session}>
//         <Component {...otherProps} />
//       </SessionProvider>
//     );
//   }
  
//   export default MyApp;
// ーーーーーーーー

// function UserProfile({ User:MemberId }) {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     async function fetchUserData() {
//       const response = await fetch(`/api/users/${MemberId}`);
//       const data = await response.json();
//       setUserData(data);
//     }

//     fetchUserData();
//   }, [MemberId]); // userIdが変わるたびにデータを再フェッチ

//   return (
//     <div>
//       {userData ? (
//         <>
//           <h1>{userData.name}</h1>
//           <p>{userData.description}</p>
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }


// // 【Next.js・Typescript】NexAuthを使ってログイン認証をする
// // 参考　https://zenn.dev/furai_mountain/articles/b54c83f3dd4558
// function MyApp({
//    Component, 
//    pageProps: { session, ...pageProps } }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }

// export default MyApp;