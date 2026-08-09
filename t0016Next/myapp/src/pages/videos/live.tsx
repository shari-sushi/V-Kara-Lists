import { DevelopingContentPage } from "@/components/content/DevelopingContentPage"
import { ContextType } from "@/types/server"
import { checkLoggedin } from "@/util/webStrage/cookie"

const pageName = "live"

type Props = { isSignin: boolean }

const LivePage = ({ isSignin }: Props) => <DevelopingContentPage pageName={pageName} title="ライブ" isSignin={isSignin} />

export default LivePage

export async function getServerSideProps(context: ContextType) {
  const { isLoggedin } = checkLoggedin(context)
  return { props: { isSignin: isLoggedin } as Props }
}
