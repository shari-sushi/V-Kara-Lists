import { Layout } from "@/components/layout/Layout"

type DevelopingContentPageProps = {
  pageName: string
  title: string
  isSignin: boolean
}

// ライブ・オリ曲・歌ってみた共通の仮ページ。
// DB再設計(#398)でVideo/VideoSongに統一されたが、これらの一覧UIの作り込みは別issueで行うため
// 開発中の案内のみを表示する(歌枠は #414 以前の画面を /sings/karaoke に復元済み #458)。
export const DevelopingContentPage = ({ pageName, title, isSignin }: DevelopingContentPageProps) => {
  return (
    <Layout pageName={pageName} isSignin={isSignin}>
      <div className="flex flex-col items-center pt-8">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <div className="max-w-[600px] w-full bg-[#657261] rounded p-6 text-center">
          <p className="font-bold text-lg mb-2">現在開発中です</p>
          <p className="text-sm">このコンテンツの一覧表示は準備中です。しばらくお待ちください。</p>
        </div>
      </div>
    </Layout>
  )
}
