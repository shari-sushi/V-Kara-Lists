import Link from "next/link"
import { Layout } from "@/components/layout/Layout"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "Top"

type TopPageProps = {
  isSignin: boolean
}

// DB再設計(#398)により、動画・歌のデータモデルが Movie/Karaoke から Video/VideoSong に刷新された。
// 一覧UIの作り込みは別issueで行うため、topページは開発中の案内と4コンテンツへの導線のみを表示する。
const TopPage = ({ isSignin }: TopPageProps) => {
  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="flex flex-col items-center pt-8">
        <hgroup className="pb-6 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold underline">V-Karaoke (VTuber-Karaoke-Lists)</h1>
          <h2 className="text-sm md:text-base">「推し」の「歌枠」の聴きたい「歌」</h2>
        </hgroup>

        <div className="max-w-[600px] w-full bg-[#657261] rounded p-6 text-center">
          <p className="font-bold text-lg mb-2">現在開発中です</p>
          <p className="text-sm">
            動画・歌のデータモデルを刷新中のため、一覧表示は準備中です。しばらくお待ちください。
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link href="/videos/karaoke" className="underline hover:opacity-70">
            歌枠
          </Link>
          <Link href="/videos/live" className="underline hover:opacity-70">
            ライブ
          </Link>
          <Link href="/videos/original-song" className="underline hover:opacity-70">
            オリ曲
          </Link>
          <Link href="/videos/covered-song" className="underline hover:opacity-70">
            歌ってみた
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default TopPage

export async function getServerSideProps(context: ContextType) {
  const { isLoggedin } = checkLoggedin(context)

  return {
    props: {
      isSignin: isLoggedin,
    } as TopPageProps,
  }
}
