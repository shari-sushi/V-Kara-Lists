import "../styles/global.css";
import { RootProvider } from "@/providers/RootProvider";


export default function App({ Component, pageProps }) {
  const isSignin = pageProps.isSignin || false;

  return (
    <RootProvider isSignin={isSignin}>
      <div className="h-full w-full relative">
        <Component {...pageProps} />
      </div>
    </RootProvider>
  );
}
