import { ToClickTW } from "@/styles/tailwiind"
import Link from "next/link"

export const TitleLink = () => {
  return (
    <Link href="/" className="flex float-left bg-[#FFF6E4] text-[#000000] font-extrabold px-4 pb-1 pr-6 rounded-br-full ">
      V-kara
    </Link>
  )
}

export const TopLink = () => {
  return (
    <Link href="/" className={`${ToClickTW.hamburger} `}>
      <div className={` ml-5 sm:my-2 my-[4px] `}>TOP</div>
    </Link>
  )
}

export const KaraokeLink = () => {
  return (
    <Link href="/videos/karaoke" className={`${ToClickTW.hamburger} mt-1`}>
      <div className={` ml-5 sm:my-2 my-[4px]  `}>歌枠</div>
    </Link>
  )
}

export const LiveLink = () => {
  return (
    <Link href="/videos/live" className={`${ToClickTW.hamburger} mt-1`}>
      <div className={` ml-5 sm:my-2 my-[4px]  `}>ライブ</div>
    </Link>
  )
}

export const OriginalSongLink = () => {
  return (
    <Link href="/videos/original-song" className={`${ToClickTW.hamburger} mt-1`}>
      <div className={` ml-5 sm:my-2 my-[4px]  `}>オリ曲</div>
    </Link>
  )
}

export const CoveredSongLink = () => {
  return (
    <Link href="/videos/covered-song" className={`${ToClickTW.hamburger} mt-1`}>
      <div className={` ml-5 sm:my-2 my-[4px]  `}>歌ってみた</div>
    </Link>
  )
}

export const LoginLink = () => {
  return (
    <Link href="/user/signin" className={`${ToClickTW.hamburger} `}>
      <div className={` ml-5 sm:my-2 my-[4px] `}>ログイン</div>
    </Link>
  )
}

export const SignUpLink = () => {
  return (
    <Link href="/user/signup" className={`${ToClickTW.hamburger} my-1`}>
      <div className={` ml-5 sm:my-2 my-[4px] `}>会員登録</div>
    </Link>
  )
}

export const MyPageLink = () => {
  return (
    <Link href="/user/mypage" className={`${ToClickTW.hamburger} `}>
      <div className={` ml-5 sm:my-2 my-[4px] `}>マイページ</div>
    </Link>
  )
}

export const ProfileLink = () => {
  return (
    <Link href="/user/profile" className={`${ToClickTW.hamburger} mt-1`}>
      <div className={` ml-5 sm:my-2 my-[4px] `}>プロフィール</div>
    </Link>
  )
}

export const memo = () => {
  //ファイルのtopレベルに置いておくとESLintの自動整形が機能しなくなる
  // export const  = () => {
  //     return (
  //     )
  // }
}
