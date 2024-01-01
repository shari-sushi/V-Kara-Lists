import { useRouter } from 'next/router';
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import type { LoginUser } from "../types/user";
import Link from 'next/link';
import { Checkbox } from '../components/SomeFunction';
import { domain } from '../../env'



// ver1.5でsessoin管理に切り替える
export const GetLogout = () => {
  const router = useRouter();
  const fetchLogout = async () => {
    try {
      const response = await fetch(`${domain.backendHost}/users/logout`, {
        method: 'PUT',
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
  return (
    <button onClick={fetchLogout}>ログアウト</button>
  )
};

export const Withdraw = () => {
  const router = useRouter();
  const [isToDecision, setIsToDecision] = useState<boolean>(false)
  const fetchWithdraw = async () => {
    try {
      const response = await fetch(`${domain.backendHost}/users/withdraw`, {
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
  return (
    <div>
      {!isToDecision &&
        <div>
          <button onClick={() => setIsToDecision(!isToDecision)} >
            退会手続きへ</button>
        </div>}
      {isToDecision && <div> <br />
        <button onClick={() => setIsToDecision(!isToDecision)} >
          キャンセル</button>
        <h2>退会について</h2>
        <li>あなたのメールアドレス、パスワードが本サイトから削除されます。</li>
        <li>上述の情報は３０日後に自動で完全削除されます。</li>
        <li>あなたが登録したアカウント情報以外のデータは削除されません。</li>
        <li>なお、ゲストアカウントは退会できません。</li>
        <button onClick={fetchWithdraw}>！！！退会確定！！！</button>
      </div>}
    </div>
  )
};

export const GestLogin = () => {
  const router = useRouter();
  const fetchWithdraw = async () => {
    try {
      const response = await fetch(`${domain.backendHost}/users/gestlogin`, {
        method: 'get',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.status != 200) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
    router.push(`/`)
  };
  return (
    <button onClick={fetchWithdraw} style={{ background: 'brown' }}>
      ゲストログイン
    </button>
  )
};