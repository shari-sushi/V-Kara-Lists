import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import dynamic from 'next/dynamic';
import { domain } from '../../../env'
import { DropStyle, TopPagePosts } from './common'

type DropDownVtuberProps = {
    posts: TopPagePosts;
    onVtuberSelect: (value: number) => void;
    onMovieClear: () => void;
    onKaraokeClear: () => void;
}

type vtuberListsProps = {
    value: number,
    label: string,
}

const vtuberLists = (posts: TopPagePosts): vtuberListsProps[] => { //適切な名前が思いつけば変える
    try {
        let vtuberLists = posts.vtubers.map((vtuber: ReceivedVtuber) => ({
            value: vtuber.VtuberId,
            label: vtuber.VtuberName
        }));
        console.log("havingVt", vtuberLists)
        // setVtuberOptions(havingVt);
        return vtuberLists
    } catch (error) {
        console.error("Error fetching vtubers:", error);
        return []
    }
};
//onVtuberSelectはVtuberが選択されたときに親コンポーネントへ通知するためのコールバック関数
export const DropDownVtuber = ({ posts, onVtuberSelect, onMovieClear, onKaraokeClear }: DropDownVtuberProps) => {
    // console.log("DropDownVt2のposts", posts)
    const handleVtuberClear = () => {
        onVtuberSelect(0);
        onMovieClear();
        onKaraokeClear();
    };
    // const [vtuberOptions, setVtuberOptions] = useState<Options[]>([]); 

    // useEffect(() => {

    const vtuberOptions = vtuberLists(posts);
    // }, [posts.vtubers]);
    return (
        <>
            <Select
                id="selectbox"
                instanceId="selectbox"
                placeholder="Vtuber名を検索/選択"  //  defaultValue= で何か変わる
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="VTuber"  //何のためにあるかわからん
                options={vtuberOptions} //選択候補
                defaultMenuIsOpen={true}
                blurInputOnSelect={true}
                styles={DropStyle}
                // value={onVtuberSelect}
                onChange={option => { //ここでSelectで選んだものがoptionに格納されるのか？←挙動的に多分違う
                    onMovieClear(),
                        onKaraokeClear()
                    if (option) {
                        console.log("Selected Vtuber value:", option.value); //1 になる(おいもの場合)
                        onVtuberSelect(option.value);
                    } else {
                        handleVtuberClear();
                    }
                }}
            />
        </>
    );
};