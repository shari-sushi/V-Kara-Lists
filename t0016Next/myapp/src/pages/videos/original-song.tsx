import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "original-song"

type Props = { isSignin: boolean }

const OriginalSongPage = ({ isSignin }: Props) => <DevelopingContentPage pageName={pageName} title="オリ曲" isSignin={isSignin} />

export default OriginalSongPage

export async function getServerSideProps(context: ContextType) {
  const { isLoggedin } = checkLoggedin(context)
  return { props: { isSignin: isLoggedin } as Props }
}
