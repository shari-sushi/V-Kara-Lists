import Head from "next/head"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { GestLogin, GestLoginForHamburger } from "../button/User"
import { HeaderCss } from "@/styles/tailwiind"
import { ToClickTW } from "@/styles/tailwiind"
import { CreateLink, DeleteLink, EditLink, KaraokeLink, OriginalSongLink, LoginLink, MyPageLink, ProfileLink, SignUpLink, TitleLink, TopLink } from "../button/link/Humbarger"
import Image from "next/image"
import { ToggleVideoPositionButton } from "../button/ToggleVideoPositionButton"
import { useVideo } from "@/providers/VideoProvider"

type LayoutProps = {
  pageName: string
  children: any
  isSignin: boolean
}

export function Layout({ pageName, children, isSignin }: LayoutProps) {
  return (
    <div className="h-full">
      <Head>
        <link rel="icon" href="/shari.ico" />
        <title>{`V-kara/${pageName}`}</title>
      </Head>
      <Header pageName={pageName} />
      <main className="flex flex-col min-h-screen p-4 pt-8 ">
        <div className="md:absolute md:right-1 ">
          <span className="flex-1 "> {pageName}</span>
          <span className="flex-1 px-1">|</span>
          <span className="flex-1 ">{(isSignin && "ログイン中") || "非ログイン中"}</span>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}

type HeaderProps = {
  pageName: string
}
const Header = ({ pageName }: HeaderProps) => {
  const pathName = usePathname()
  const { isSignin } = useAuth()
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { togglePosition } = useVideo()

  return (
    <header className={`${HeaderCss.regular} flex justify-between w-full z-40`}>
      {/* 左側: タイトル */}
      <div>
        <a href="#pageTop" />
        <TitleLink />
      </div>

      {/* 右側 */}
      <div className="flex items-center">
        {/* デスクトップのみ: インライン nav（md以上） */}
        <div className="hidden md:flex items-center">
          <div className="px-1">
            <Link href="/" className={`${ToClickTW.regular} mr-1`}>
              TOP
            </Link>
            <Link href="/sings/karaoke" className={`${ToClickTW.regular} mr-1`}>
              カラオケ
            </Link>
            <Link href="/sings/original-song" className={`${ToClickTW.regular} mr-1`}>
              オリ曲
            </Link>
            /
          </div>

          {isSignin && (
            <div className="px-1">
              <span className="pr-1">データの</span>
              <Link href="/crud/create" className={`${ToClickTW.regular} pr-1`}>
                登録
              </Link>
              <span className="pr-1">:</span>
              <Link href="/crud/edit" className={`${ToClickTW.regular} pr-1`}>
                編集
              </Link>
              <span className="pr-1">:</span>
              <Link href="/crud/delete" className={`${ToClickTW.regular} pr-1`}>
                削除
              </Link>
              /
            </div>
          )}

          {!isSignin && (
            <div className="pr-1">
              <Link href="/user/signup" className={`${ToClickTW.regular} mr-1`}>
                会員登録
              </Link>
              <span className="pr-1">:</span>
              <Link href="/user/signin" className={`${ToClickTW.regular} mr-1`}>
                ログイン
              </Link>
              <span className="pr-1">:</span>
              <GestLogin />
            </div>
          )}

          {isSignin && (
            <div>
              <Link href="/user/mypage" className={`${ToClickTW.regular} pr-1`}>
                マイページ
              </Link>
              {pathName === "/user/mypage" && (
                <>
                  <span className="pr-1">:</span>
                  <Link href="/user/profile" className={`${ToClickTW.regular} px-1`}>
                    プロフィール
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* ハンバーガーボタン: 常時表示 */}
        <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-[#657261] rounded-lg">
          <Image src="/user/hamburger.svg" className="h-7" width={24} height={20} alt={""} />
        </button>
      </div>

      {/* サイドバー（デスクトップ・モバイル共通） */}
      {isOpen && (
        <div>
          <button onClick={() => setIsOpen(false)} className="absolute w-screen h-screen opacity-85 inset-0 bg-[#1f2724] z-10" />
          <div className={`absolute right-0 flex float-right flex-col h-screen w-[40%] min-w-44 bg-[#657261] z-40 scroll-smooth`}>
            <button onClick={() => setIsOpen(!isOpen)} className="absolute right-0 top-0 h-7 hover:bg-[#1f2724] rounded-lg">
              <Image src="/user/cross_bold.svg" className="h-7" width={24} height={20} alt={""} />
            </button>

            <div id="area" className="flex flex-col h-full">
              <hr id="hr1" className="flex w-[50%] my-4" />
              <hr className=" w-[40%] my-4" />
              <hr className=" w-[10%] my-4" />
              <div id="menu" className="absolute flex flex-col right-0 w-36 sm:w-48 mt-[20%] rounded">
                <div className="w-fit text-xl -ml-2 bg-[#657261]">目次</div>

                <div className="flex flex-col">
                  <TopLink />
                  <KaraokeLink />
                  <OriginalSongLink />
                </div>
                <hr className="w-[60%] top-10 right-0 my-3" />

                {!isSignin && (
                  <div className="flex flex-col">
                    <SignUpLink />
                    <LoginLink />
                    <GestLoginForHamburger />
                    <hr className="w-[60%] top-10 right-0 my-3" />
                  </div>
                )}

                {isSignin && (
                  <div>
                    <div className="flex flex-col h-32">
                      <CreateLink />
                      <EditLink />
                      <DeleteLink />
                    </div>

                    <hr className="flex w-[50%] mb-3" />

                    <div className="flex flex-col">
                      <MyPageLink />
                      <ProfileLink />
                    </div>
                    <hr className="flex w-[50%] my-3 ml-28" />
                  </div>
                )}
                <div className="mt-10" />
                <div className="w-fit text-xl -ml-2">設定</div>
                <div className={`${ToClickTW.hamburger} h-8 pl-2`} onClick={() => togglePosition()}>
                  <ToggleVideoPositionButton textSize="text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

const Footer = () => {
  // videoPlayer用のスペース。videoStateで管理して動的にしたい
  return <div style={{ height: 200 }} />
}

// NOTE: Footerの残骸。playerを非表示にできるようにしたときに使う予定
// const pathName = usePathname();
// const { isSignin } = useAuth();
// return (
//   <footer className={`${FooterTW.regular}`}>
//     <div className="flex float-right">
//       <Link href="/" className="mx-1">
//         TOP
//       </Link>
//       :
//       <Link href="/sings/karaoke" className="mx-1">
//         {" "}
//         カラオケ
//       </Link>
//       :
//       <Link href="/sings/original-song" className="mx-1">
//         {" "}
//         オリ曲
//       </Link>
//       /
//       {isSignin && (
//         <div className="mx-1">
//           <Link href="/crud/create" className="mx-1">
//             登録
//           </Link>
//           :
//           <Link href="/crud/edit" className="mx-1">
//             編集
//           </Link>
//           :
//           <Link href="/crud/delete" className="mx-1">
//             削除
//           </Link>
//           /
//         </div>
//       )}
//       {!isSignin && (
//         <div className="mx-1">
//           <Link href="/user/signup" className="mx-1">
//             会員登録
//           </Link>
//           :
//           <Link href="/user/signin" className="mx-1">
//             ログイン
//           </Link>
//         </div>
//       )}
//       {isSignin && (
//         <div className="">
//           <Link href="/user/mypage" className="mx-1">
//             マイページ
//           </Link>
//           {pathName === "/user/mypage" && (
//             <div>
//               :
//               <Link href="/user/profile" className="mx-1">
//                 プロフィール
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     <div id="pageTop" className="flex float-left bg-[#FFF6E4] text-[#000000] font-extrabold px-4 pb-1 pr-6 rounded-tr-full ">
//       V-kara
//     </div>
//   </footer>
// );
