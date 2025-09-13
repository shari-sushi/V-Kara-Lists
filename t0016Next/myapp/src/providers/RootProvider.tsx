import { VideoProvider } from "./VideoProvider"
import { AuthProvider } from "./AuthProvider"

interface RootProviderProps {
  children: React.ReactNode
  isSignin: boolean
}

export const RootProvider = ({ children, isSignin }: RootProviderProps) => {
  return (
    <AuthProvider isSignin={isSignin}>
      <VideoProvider>{children}</VideoProvider>
    </AuthProvider>
  )
}
