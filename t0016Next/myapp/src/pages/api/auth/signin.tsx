import { useSession } from 'next-auth/react'

function loginAuth() {
  const { data: session } = useSession()

  if (session) {
    return <div>ログイン済み: {session.user.name}</div>
  } else {
    return <div>ログインしていません。</div>
  }
}




// const ExampleComponent = () => {
//     const { data: session } = useSession();
//     return (
//       <div>
//         { session && (
//           <p>ログイン認証ok</p>
//         )}
//       </div>
//     );