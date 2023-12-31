import Head from "next/head";
import styles from '../../styles/Home.module.css'
import Link from 'next/link';
import { GestLogin, GetLogout } from '../authButton'
// import { styles } from '../components/globals'
import { domain } from '../../../env'
// export const appName = "Sample App"

export function Header({ pageName, children, checkSignin }) {
    // console.log("children", children)
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header >
                <h1 className={styles.title}>{pageName}   &nbsp;</h1>
                <Link href="/test"><button >テスト</button></Link> &nbsp;
                <Link href="/karaoke/singsTest"><button >歌テスト</button></Link> &nbsp;
                <Link href="/"><button >TOP</button></Link> &nbsp;
                {checkSignin &&
                    <>
                        <Link href="/karaoke/sings"><button >歌</button></Link> &nbsp;
                        <Link href="/crud/create"><button >CREATE</button></Link> &nbsp;
                        <Link href="/crud/edit"><button >EDIT</button></Link> &nbsp;
                        <Link href="/crud/delete"><button >DALETE</button></Link> &nbsp;
                    </>
                }
                <br />
                {!checkSignin &&
                    <>
                        <Link href="/user/signup"><button style={{ background: 'brown' }}>
                            会員登録</button>
                        </Link> &nbsp;
                        <Link href="/user/signin"><button style={{ background: 'brown' }}>
                            ログイン</button>
                        </Link> &nbsp;
                        <GestLogin />
                    </>
                } &nbsp;
                {checkSignin &&
                    <>
                        <Link href="/user/mypage"><button style={{ background: 'brown' }}>
                            マイページ</button>
                        </Link> &nbsp;
                        <GestLogin />
                    </>
                }

            </header>
            <main className={styles.original}>
                {children}
            </main>
        </div >
    );
}

