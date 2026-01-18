import Link from "next/link"

export const FailedMessage = () => {
  return (
    <div className="flex justify-center pt-12">
      <div className="flex flex-col  items-center bg-[#657261] font-bold text-xl p-6 max-w-[1200px]">
        <span className="mb-3">データの取得に失敗しました。</span>
        <span>ページ更新してもこの文章が表示された場合は</span>
        <Link href="https://twitter.com/shari_susi" className="text-3xl text-[#b3d854] underline hover:opacity-70">
          開発者のX
        </Link>
        <span>にDMいただけますと幸いです。</span>
      </div>
    </div>
  )
}
