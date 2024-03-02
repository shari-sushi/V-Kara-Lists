import Head from "next/head";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useState } from "react";

import { GestLogin, GestLoginForHamburger } from '../button/User'
import { HeaderCss, FooterTW } from '@/styles/tailwiind'
import { ToClickTW } from '@/styles/tailwiind'
import { getWindowSize } from "@/features/layout/Layout";
import { CreateLink, DeleteLink, EditLink, KaraokeLink, OriginalSongLink, LoginLink, MyPageLink, ProfileLink, SignUpLink, TitleLink, TopLink } from "../button/link/Humbarger";

export function NotLoggedIn() {
    return (
        <div className="h-full ">
            <h1 className="text-lg pt-8">ログインが必要なコンテンツです</h1> <br />
            <div className="flex flex-col md:flex-none">
                <div className="flex flex-row">
                    <Link href="/user/signup" className={`${ToClickTW.regular} flex mr-4 w-[93px] justify-center`}>
                        会員登録
                    </Link>
                    <Link href="/user/signin" className={`${ToClickTW.regular} flex w-[93px] justify-center`}>
                        ログイン
                    </Link>
                </div>
                <span className="pl-2 pb-8">
                    データ登録とそのデータの編集、削除ができます。
                </span>
                <div className="w-28">
                    <GestLogin />
                </div>
                <span className="pl-2">
                    データ登録できますが、そのデータは誰にでも編集・削除できます。
                </span>
            </div>
        </div >
    );
}
