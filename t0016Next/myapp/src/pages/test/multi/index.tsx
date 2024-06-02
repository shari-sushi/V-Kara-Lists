import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout'
import TestLink from './component';
import { YouTubePlayer } from '@/components/moviePlayer/YoutubePlayer';

const pageNum = 0
const pageName = "test"
// http://localhost:80/test/multi
const TopPage = () => {
    const currentMovieId = "HLvwenXhslI"
    const start = 0
    return (
        <Layout pageName={pageName} isSignin={false}>
            <TestLink thisPageNum={pageNum} />
            視聴回数カウント確認用。※youtubeページで直接見ないこと。
            5/27時点で1回。
            <YouTubePlayer videoId={currentMovieId} start={start} />
        </Layout>
    );
};
export default TopPage;
