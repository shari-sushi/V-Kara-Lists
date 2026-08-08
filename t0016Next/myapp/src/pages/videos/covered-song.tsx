import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "covered-song"

type Props = { isSignin: boolean }

const CoveredSongPage = ({ isSignin }: Props) => <DevelopingContentPage pageName={pageName} title="歌ってみた" isSignin={isSignin} />

export default CoveredSongPage

export async function getServerSideProps(context: ContextType) {
  const { isLoggedin } = checkLoggedin(context)
  return { props: { isSignin: isLoggedin } as Props }
}
