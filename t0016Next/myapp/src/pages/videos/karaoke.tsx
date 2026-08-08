import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "karaoke"

type Props = { isSignin: boolean }

const KaraokePage = ({ isSignin }: Props) => <DevelopingContentPage pageName={pageName} title="歌枠" isSignin={isSignin} />

export default KaraokePage

export async function getServerSideProps(context: ContextType) {
  const { isLoggedin } = checkLoggedin(context)
  return { props: { isSignin: isLoggedin } as Props }
}
