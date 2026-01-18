import "../styles/global.css"
import { RootProvider } from "@/providers/RootProvider"
import { VideoLayout } from "@/components/layout/VideoLayout"
import Script from "next/script"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function App({ Component, pageProps }) {
  const isSignin = pageProps.isSignin || false
  const router = useRouter()
  const isProduction = process.env.NODE_ENV === "production"

  // SPA ページ遷移で PV を飛ばす
  useEffect(() => {
    if (!isProduction) return

    const handleRouteChange = (url) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", "G-XZY96J18P3", {
          page_path: url,
        })
      }
    }

    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events, isProduction])

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-XZY96J18P3" strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XZY96J18P3');
        `}
      </Script>

      <RootProvider isSignin={isSignin}>
        <div className="h-full w-full relative">
          <Component {...pageProps} />
          <VideoLayout />
        </div>
      </RootProvider>
    </>
  )
}
