import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// import { useRouter } from 'next/router'
// import { VFC, useEffect } from 'react'
// import type { GetAccessControl } from '../index.d'



// const useAccessControll = (getAccessControll: GetAccessControl) => {
//   const router = useRouter()
//   useEffect(() => {
//     const controll = async () => {
//       const accessControl = await getAccessControll()
//       if (!accessControl) return
//       router[accessControl.type](accessControl.destination)
//     }
//     controll()
//   }, [router]) 
// }

// ↑により呼び出され、
// アクセスしたページにaccessControlが定義さてていない場合にはこれが処理される
// const accessControl = () => {
//   // throw new Error('getAccessControl が定義されていません。');
//   return console.log("getAccessControlが定義されていません。")
// };

// type Props = AppProps & {
//   Component: {
//     getAccessControl?: GetAccessControl
//   }
// }

const App = ({ Component, pageProps }) => {
  // const { getAccessControl = accessControl } = Component
  // useAccessControll(getAccessControl)
  return <Component {...pageProps} />
}

export default App

// ***memo***
// const App: VFC<Props> = ({ Component, pageProps }) => {
//   const { getAccessControl = accessControl } = Component
//   useAccessControll(getAccessControl)
//   return <Component {...pageProps} />
// }