import Head from "next/head";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from '@/styles/Home.module.css'
import { GestLogin } from '../button/User'
// import { styles } from '../components/globals'

export function Header({ pageName, children, isSignin }) {
    const pathName = usePathname();
    return (
        <div>
            <Head>
                <link rel="icon" href="/shari.ico" />
                <title>V-kara/{pageName}</title>
            </Head>
            <header className={styles.header}>
                <h1 className={styles.title}>{pageName} &nbsp;</h1>
                <Link href="/test"><button >テスト</button></Link>/ &nbsp;
                <Link href="/"><button >TOP</button></Link> &nbsp;
                <Link href="/karaoke/sings"><button >歌</button></Link>/ &nbsp;
                {isSignin &&
                    <>
                        データの
                        <Link href="/crud/create"><button >登録</button></Link>:
                        <Link href="/crud/edit"><button >編集</button></Link>:
                        <Link href="/crud/delete"><button >削除</button></Link> &nbsp;
                        /
                    </>
                }
                <br />
                {!isSignin &&
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
                {isSignin &&
                    <>
                        <Link href="/user/mypage"><button class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded">
                            マイページ</button>
                        </Link> &nbsp;

                        {pathName === "/user/mypage" &&
                            <>
                                <Link href="/user/profile"><button style={{ background: 'brown' }}>
                                    プロフィール</button>
                                </Link> &nbsp;
                            </>}
                        <GestLogin />

                    </>
                }
            </header >
            <main className={styles.original}>
                {children}
            </main>
        </div >
    );
}

