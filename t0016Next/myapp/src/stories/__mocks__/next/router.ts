// Storybook用 next/router モック
const useRouter = () => ({
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  pathname: "/",
  query: {},
  asPath: "/",
  route: "/",
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  isFallback: false,
  isReady: true,
  isLocaleDomain: false,
})

const router = useRouter()

export { useRouter, router }
export default useRouter
