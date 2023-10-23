import { useRouter } from 'next/router';
import React,{ useState } from "react";
import { useForm } from 'react-hook-form';
import type { LoginUser } from "../types/usertype";
import Link from 'next/link';
import {Checkbox} from '../components/SomeFunction';



// ver1.5でsessoin管理に切り替える
export const GetLogout = () => {
  const router = useRouter();
  const fetchLogout = async () => {
    try {
      const response = await fetch(`https://localhost:8080/logout`, { 
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(data)    
      });
      console.log("logout response:", response);  
      if (!response.ok) {
          throw new Error(response.statusText);
      }  
    } catch (error) {
      console.error(error);
    }
      router.push(`/`)
  };
  return(
    <button onClick={fetchLogout}>ログアウト</button>
  )
};

export const Withdraw = () => {
  const router = useRouter();
  const [isToDecision, setIsTpoDecision]=useState<boolean>(false) 

  const fetchLogout = async () => {
    try {
      const response = await fetch(`https://localhost:8080/withdraw`, { 
          method: 'DELETE',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
      });
      console.log("withdraw response:", response);  
      if (!response.ok) {
          throw new Error(response.statusText);
      }  
    } catch (error) {
      console.error(error);
    }
      router.push(`/`)
  };
  return(
    <div>
      {!isToDecision && <div>
        <button onClick={()=> setIsTpoDecision(!isToDecision)} >
     退会手続きへ</button>
     </div>}
     {isToDecision}
     {isToDecision && <div> <br/>
    <button onClick={fetchLogout}>！！！退会確定！！！</button>
  <h2>退会について</h2>
  <li>あなたのメールアドレス、パスワードが本サイトから削除されます。</li>
  <li>それらは一時的に保管されますが、３０日後に機械的に自動で完全にされます。</li>
  <li>あなたが登録したVTuber, Movie, Sing等のデータは削除されません。</li>
  <button onClick={()=> setIsTpoDecision(!isToDecision)} >
     キャンセル</button>
   </div>}</div>
    )
};


// *******memo********
// エラー０で機能してたやつ
// export const Withdraw = () => {
//   const router = useRouter();
//   const fetchLogout = async () => {
//     try {
//       const response = await fetch(`https://localhost:8080/withdraw`, { 
//           method: 'DELETE',
//           credentials: "include",
//           headers: {
//               'Content-Type': 'application/json'
//           },
//       });
//       console.log("withdraw response:", response);  
//       if (!response.ok) {
//           throw new Error(response.statusText);
//       }  
//     } catch (error) {
//       console.error(error);
//     }
//       router.push(`/`)
//   };
//   return(
//     <div>
//     <button onClick={fetchLogout}>退会</button>
// <a>aaa</a>
//    </div>
//     )
// };