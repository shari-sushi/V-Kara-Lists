import { GetServerSideProps } from "next"
import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { SongListPage, type SongListPageProps } from "@/components/content/SongListPage"
import { getSongListPageProps } from "@/features/songList/getSongListPageProps"
import { VIDEO_CATEGORY } from "@/types/vtuber_content"
import { checkLoggedin } from "@/util/webStrage/cookie"

// 歌枠(karaoke)は #414 以前の画面を /sings/karaoke に復元したため(#458)、ここでは扱わずリダイレクトする。
const KARAOKE_PAGE_PATH = "/sings/karaoke"

const CATEGORY_TITLES = {
  live: "ライブ",
  "original-song": "オリ曲",
  "covered-song": "歌ってみた",
} as const

type VideoCategoryPath = keyof typeof CATEGORY_TITLES

const LIVE_PAGE_NAME = "ライブ(全曲)"

// ライブは歌枠と同じ「1動画に複数曲」の形なので、歌枠の一覧画面をそのまま使う。
// オリ曲・歌ってみたは開発中の案内のまま。
type Props = { kind: "live"; pageProps: SongListPageProps } | { kind: "developing"; isSignin: boolean; category: VideoCategoryPath }

const VideoCategoryPage = (props: Props) => {
  if (props.kind === "live") {
    return <SongListPage {...props.pageProps} pageName={LIVE_PAGE_NAME} category={VIDEO_CATEGORY.LIVE} />
  }
  return <DevelopingContentPage pageName={props.category} title={CATEGORY_TITLES[props.category]} isSignin={props.isSignin} />
}

export default VideoCategoryPage

export const getServerSideProps: GetServerSideProps<Props, { category: string }> = async (context) => {
  const { category } = context.params ?? {}
  if (category === "karaoke") {
    return { redirect: { destination: KARAOKE_PAGE_PATH, permanent: false } }
  }
  if (!category || !(category in CATEGORY_TITLES)) {
    return { notFound: true }
  }

  const { sessionToken, isLoggedin } = checkLoggedin(context)
  if (category === "live") {
    // 他ページはsessionTokenもログに出しているが、認証トークンをログに残さないためここでは出さない
    console.log("pageName, isLoggedin =", LIVE_PAGE_NAME, isLoggedin) // 会員、非会員、どのページかの記録のため
    return { props: { kind: "live", pageProps: await getSongListPageProps(sessionToken, isLoggedin, VIDEO_CATEGORY.LIVE) } }
  }
  return { props: { kind: "developing", isSignin: isLoggedin, category: category as VideoCategoryPath } }
}
