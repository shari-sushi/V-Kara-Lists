import Head from "next/head";
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { GestLogin } from '../components/authButton'
// import { styles } from '../components/globals'

export const appName = "Sample App"

function Layout({ pageName, children }) {
    console.log(pageName)
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header >
                <h1 className={styles.title}>{pageName}   &nbsp;</h1>
                <Link href="/test"><button >テスト</button></Link> &nbsp;
                <Link href="/create"><button >CREATE</button></Link> &nbsp;
                <Link href="/edit"><button >EDIT</button></Link> &nbsp;
                <Link href="/delete"><button >DALETE</button></Link> &nbsp;
                <br />
                <Link href="/signup"><button style={{ background: 'brown' }}>
                    会員登録</button>
                </Link> &nbsp;
                <Link href="/signin"><button style={{ background: 'brown' }}>
                    ログイン</button>
                </Link> &nbsp;
                <Link href="/mypage"><button style={{ background: 'brown' }}>
                    マイページ</button>
                </Link> &nbsp;
                <GestLogin />
            </header>
            <main className={styles.original}>
                {children}
            </main>
        </div >
    );
}

export default Layout;
