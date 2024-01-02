import React, { useState, useEffect, useMemo  } from 'react';
import Select from 'react-select';
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import {domain} from '../../../env'
import { DropStyle, TopPagePosts } from './common'

// DropDinwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき

type Options = {
  value: number;
  label: string;
}

type DropDownKaraokeProps = {
  posts:TopPagePosts;
  selectedMovie: string;
  onKaraokeSelect:(value:number) => void ;
};

// karaoke_list用
export const DropDownKaraoke = ({ posts, selectedMovie, onKaraokeSelect }:DropDownKaraokeProps) => {
  const karaokes = posts?.vtubers_movies_karaokes
  // const [movies, setData2] = useState<Karaoke[]>();
  const [karaokeOptions, setKaraokeOptions] = useState<Options[]>([]);
  const [selectedKaraoke, setSelectedKaraoke] = useState<number>(0);

  useEffect(() => {
    if (!selectedMovie) {
      setKaraokeOptions([]); // Movieが選択解除された場合、karaokeの選択肢を空にする
      return;
    }
    // if (!selectedKaraoke){
    //   setSelectedKaraoke(null);
    //   return;
    // }
    const fetchKaraokes = async () => {
      try {
        console.log("selectedMovie=",selectedMovie)
        console.log("karaokes=",karaokes)
        console.log("karaokes.MovieUrl=",karaokes[0].MovieUrl)
        // const movieUrl = {selectedMovie}
        const choiceKaraoke = karaokes.filter((karaokes:ReceivedKaraoke) => karaokes.MovieUrl === selectedMovie);
        console.log("API Response ka:", choiceKaraoke );
        let havingkaraoke = choiceKaraoke.map((karaoke:ReceivedKaraoke) => ({
          value: karaoke.KaraokeId,
          label: karaoke.SongName || ""
        }));
        if (havingkaraoke){
        setKaraokeOptions(havingkaraoke);}
      } catch (error) {
        console.error("Error fetching Karaokes:", error);
      }
      setSelectedKaraoke(0);
    };
    fetchKaraokes();
  }, [selectedMovie, karaokes]);
  return (
    <>
      <Select
        id="selectbox"
        instanceId="selectbox"     
        placeholder="歌を検索/選択" 
        className="basic-single"
         classNamePrefix="select"
        isClearable={true}  isSearchable={true}   options={karaokeOptions}
        // value={selectedKaraoke} 
        // isMulti={true}  backspaceRemovesValue={false}
        blurInputOnSelect={true} styles={DropStyle}
        onChange={option => {
        if (option){ //選んだ時にエラー吐く
          onKaraokeSelect(option.value);
          // setSelectedKaraoke(option);
        // } else {
        //   handleKaraokeClear();
        //   setMovieOptions([]);
        }    
      }}
      />
    </>
  );
};


    // 公式
    // https://react-select.com/home

    // <select  value={hoge} 
    //これがあると、その値が変化したときのみUIが変化する
    // ない場合は「制御されないコンポーネント」となり、どんな変更でもUIが変化する