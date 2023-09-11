// https://zenn.dev/junnuj/articles/fb0ca45967c6c2

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

 
console.log("session=",session);

  return (
    <main>
      <div>{status}</div>
      <div>{session?.user?.MemberId}</div>
      <div>{session?.user?.MemberName}</div>
      <div>テスト</div>
      {/* <div>{session?.user?.name}</div> */}
      {/* <div>{session?.user?.email}</div> */}
      {/* <div>{session?.user?.MemberId}</div> */}
      {/* <div>{session?.user?.MemberName}</div> */}
      <button onClick={() => signOut()}>サインアウト</button>
    </main>
  );
}
