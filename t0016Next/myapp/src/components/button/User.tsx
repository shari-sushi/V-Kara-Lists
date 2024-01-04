import { useRouter } from 'next/router';
import React, { useState } from "react";
import Link from 'next/link';

import { domain } from '@/../env'

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
    <Link href="">
      <button onClick={fetchLogout}>ログアウト</button>
    </Link>
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
            退会ボタンを開く</button>
        </div>}
      {isToDecision && <div> <br />
        <h2>退会について</h2>
        <li>・メールアドレスとパスワードは30日間の保管の後、完全に削除されます。</li>
        <li>・保管期間中はアカウントを復元できます。</li>
        <li>・削除されたアカウントが登録したVtuberや動画等の登録データはサイト運営によって管理されます。</li>
        <li>・ゲストアカウントは退会できません。</li>
        <br />
        <button onClick={() => setIsToDecision(!isToDecision)} >キャンセル</button>
        <button onClick={fetchWithdraw}>退会確定</button>
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
    <Link href="">
      <button onClick={fetchWithdraw} style={{ background: 'brown' }}>
        ゲストログイン
      </button>
    </Link>
  )
};