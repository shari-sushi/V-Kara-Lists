import { GetServerSideProps } from "next"
import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { checkLoggedin } from "@/util/webStrage/cookie"

const CATEGORY_TITLES = {
  karaoke: "歌枠",
  live: "ライブ",
  "original-song": "オリ曲",
  "covered-song": "歌ってみた",
} as const

type VideoCategory = keyof typeof CATEGORY_TITLES

type Props = { isSignin: boolean; category: VideoCategory }

const VideoCategoryPage = ({ isSignin, category }: Props) => (
  <DevelopingContentPage pageName={category} title={CATEGORY_TITLES[category]} isSignin={isSignin} />
)

export default VideoCategoryPage

export const getServerSideProps: GetServerSideProps<Props, { category: string }> = async (context) => {
  const { category } = context.params ?? {}
  if (!category || !(category in CATEGORY_TITLES)) {
    return { notFound: true }
  }

  const { isLoggedin } = checkLoggedin(context)
  return { props: { isSignin: isLoggedin, category: category as VideoCategory } }
}
