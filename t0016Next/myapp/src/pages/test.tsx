import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllJoinData, Vtuber, VtuberMovie } from '../types/singdata'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import YoutubePlayer from '../components/YoutubePlayer'
import {ConversionTime, ExtractVideoId} from '../components/Conversion'

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 動作確認、テスト用ページ


  export async function getServerSideProps(context: { req: { headers: { cookie: any; }; }; }) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    let resData;
    try {
        const response = await axios.get('https://localhost:8080', {
            httpsAgent: process.env.NODE_ENV === "production" ? undefined : httpsAgent
        });
        resData = response.data;
    } catch (error) {
        console.log("axios.getでerroe:", error)
    }

    console.log("resData=", resData) //この時点では動画情報持ってる
    const rawCookie = context.req.headers.cookie;
    const sessionToken = rawCookie?.split(';').find((cookie: string) => cookie.trim().startsWith('auth-token='))?.split('=')[1];
    var CheckSignin = false
    if(sessionToken){CheckSignin = true}
    console.log("checkSingin=", CheckSignin)

    return {
        props: {
            posts: resData, 
            checkSignin: CheckSignin
          }
    };
}
  
  // export default AllDatePage;
