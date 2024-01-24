import React from "react";

import { Layout } from '@/components/layout/Layout'
import { SigninForm } from "@/components/form/User";

export function SigninPage() {

    return (
        <Layout pageName={"開発者用ページ"} isSignin={false}>
            <div className="flex justify-center m-6">
                <div className="w-full h-max p-8 bg-black">
                    〇環境変数取得テスト１ <br />
                    <hr />
                    process.env.NODE_ENV={process.env.NODE_ENV}
                    <br /><br />
                    ※取得できないとき、"process.env.NODE_ENV="と空となる
                    <br /><br />
                    ローカルで、<br />
                    npm run devでは development <br />
                    npm run build/startでは production <br />
                    となった。
                </div>
                <div className="w-full h-max p-8 bg-black">
                    〇環境変数取得テスト２ <br />
                    <hr />
                    process.env.EXSAMPLE_TEST={process.env.EXSAMPLE_TEST}
                    <br /><br />
                    ※取得できないとき、"process.env.EXSAMPLE_TEST="と空となる
                    ※1/24時点ではEXSAMPLE_TESTを設定してない
                    <br /><br />
                </div>
            </div>
        </Layout >
    );
}

export default SigninPage;

