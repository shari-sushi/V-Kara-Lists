import { SongListPage, type SongListPageProps } from "@/components/content/SongListPage"
import { getSongListPageProps } from "@/features/songList/getSongListPageProps"
import { VIDEO_CATEGORY } from "@/types/vtuber_content"
import type { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "カラオケ(全曲)"

export default function SingsPage(props: SongListPageProps) {
  return <SongListPage {...props} pageName={pageName} category={VIDEO_CATEGORY.KARAOKE} />
}

export async function getServerSideProps(context: ContextType) {
  const { sessionToken, isLoggedin } = checkLoggedin(context)
  console.log("pageName, sessionToken, isLoggedin =", pageName, sessionToken, isLoggedin) // 会員、非会員、どのページかの記録のため

  return { props: await getSongListPageProps(sessionToken, isLoggedin, VIDEO_CATEGORY.KARAOKE) }
}
