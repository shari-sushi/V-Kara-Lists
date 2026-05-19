import { VideoProvider } from "./VideoProvider"
import { AuthProvider } from "./AuthProvider"
import { HamburgerMenuProvider } from "./HamburgerMenuProvider"
import { NoticeProvider } from "./NoticeProvider"

interface RootProviderProps {
  children: React.ReactNode
  isSignin: boolean
}

export const RootProvider = ({ children, isSignin }: RootProviderProps) => {
  return (
    <AuthProvider isSignin={isSignin}>
      <VideoProvider>
        <HamburgerMenuProvider>
          <NoticeProvider>{children}</NoticeProvider>
        </HamburgerMenuProvider>
      </VideoProvider>
    </AuthProvider>
  )
}
