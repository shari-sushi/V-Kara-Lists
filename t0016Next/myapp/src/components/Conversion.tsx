import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../Youtube.module.css';
import type { AllJoinData, ReceivedVtuber, ReceivedMovie } from '../types/vtuber_content'; //type{}で型情報のみインポート
import https from 'https';
import axios from 'axios';
import { YoutubePlayer } from '../components/YoutubePlayer'
import { domain } from '../../env'

export const ConversionTime = (SingStart: string): number => {
  const match = SingStart.match(/\d+/g);
  if (!match || match.length !== 3) {
    console.error("Invalid input format:", SingStart);
    return 0;
  }
  const hours = Number(match[0]);
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  let totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;

  console.log("totalSeconds:", totalSeconds);
  return totalSeconds;
}


export const ExtractVideoId = (url: string): string => { //(変数:型):返値の型
  const match = url.match(/v=([^&]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return '';
};