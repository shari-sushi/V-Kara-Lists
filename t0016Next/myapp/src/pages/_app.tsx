
import { SessionProvider } from 'next-auth/react'; //セッションへアクセスするモジュール
import { useState, useEffect } from 'react';
import type { AllData, Streamer, StreamerMovie } from '../types/singdata'; //type{}で型情報のみインポート
import type { User } from '../types/usertype'; //type{}で型情報のみインポート


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



function MyApp({
   Component, 
   pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}




// function MyApp({
//   Component,
//   pageProps: { session, ...pageProps },
//   router,
// }: AppPropsWithLayout) {
//   useEffect(() => {
//     // ここに全ページ共通で行う処理
//     router.push("/login");
//   }, []);}

export default MyApp;