import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import dynamic from 'next/dynamic';

import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import { DropStyle, TopPagePosts } from './common'

type DropDownVtuberProps = {
    posts: TopPagePosts;
    onVtuberSelect: (value: number) => void;
}

type vtuberListsProps = {
    value: number,
    label: string,
}

const composeVtuberOptions = (posts: ReceivedVtuber[]): vtuberListsProps[] => {
    try {
        const vtuberLists = posts.map((vtuber: ReceivedVtuber) => ({
            value: vtuber.VtuberId,
            label: vtuber.VtuberName
        }));
        console.log("vtuberLists", vtuberLists)
        return vtuberLists
    } catch (error) {
        console.error("Error in vtuberLists:", error);
        return []
    }
};

export const DropDownVtuber = ({ posts, onVtuberSelect }: DropDownVtuberProps) => {
    const vtubers = posts?.vtubers || [{} as ReceivedVtuber]
    const vtuberOptions = composeVtuberOptions(vtubers);

    return (
        <>
            <Select
                id="selectbox"
                instanceId="selectbox"
                placeholder="Vtuberを検索/選択"
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="VTuber"
                options={vtuberOptions}
                defaultMenuIsOpen={true}
                blurInputOnSelect={true}
                styles={DropStyle}
                onChange={option => {
                    if (option) {
                        onVtuberSelect(option.value);
                    } else {
                        onVtuberSelect(0);
                    }
                }}
            />
        </>
    );
};