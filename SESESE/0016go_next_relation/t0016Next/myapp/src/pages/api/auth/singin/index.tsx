import { useSession } from 'next-auth/react'

function loginAuth() {
  const { data: session } = useSession()

  if (session) {
    return <div>ログイン済み: {session.user.name}</div>
  } else {
    return <div>ログインしていません。</div>
  }
}

