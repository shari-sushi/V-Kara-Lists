///////////////////////////////////////////////////////////////////////
// test中：testに必要な部分の可読性向上のためコード改行等めちゃくちゃ//
///////////////////////////////////////////////////////////////////////
import React, { useState, useEffect, useMemo  } from 'react';
import Select from 'react-select';
import type { AllData, Vtuber, Movie, KaraokeList, AllJoinData, VtuberMovie } from '../types/singdata';
import dynamic from 'next/dynamic';
import {domain} from '../../env'

// 不要なら消したい。現状、エラーが出てしまったため使ってるだけ。
const DynamicReactSelect = dynamic(() => import('react-select'), {
  ssr: false
});
// 使い方…
// <div>
//<DynamicReactSelect ~~
//</div>

// DropDinwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき

const dropStyle =({
     container: (base:any) => ({
      ...base,
      width: '300px'
  }),
  control: (base:any) => ({ //controlでholder、optionで選択肢の文字サイズを指定
    ...base,
    fontSize: '12px'  // ここで文字サイズを指定
    
  }),
}
)

type Options = {
  value: number;
  label: string;
}

type MovieOptions = {
  value: string;
  label: string;
}

type TopPagePosts = {
  vtubers: Vtuber[];
  movies: Movie[];
  karaokes:KaraokeList[];
};

type DropDownVt={
  posts:TopPagePosts;
  onVtuberSelect: (value: number) => void;  
  onMovieClear: () => void;                 
  onKaraokeClear: () => void;               
}

 //onVtuberSelectはVtuberが選択されたときに親コンポーネントへ通知するためのコールバック関数
 export const DropDownVt = ({posts, onVtuberSelect, onMovieClear, onKaraokeClear }:DropDownVt) => {
  // console.log("DropDownVt2のposts", posts)
  const handleVtuberClear = () => {
    onVtuberSelect(0);
    onMovieClear();
    onKaraokeClear();
  };
  const [vtuberOptions, setVtuberOptions] = useState<Options[]>([]); //配列の初期値が　[] となる。

  useEffect(() => {
    const fetchVtubers = () => { //適切な名前が思いつけば変える
      try {
        let havingVt = posts.vtubers.map((vtuber:Vtuber) => ({
          value: vtuber.VtuberId,
          label: vtuber.VtuberName
        }));
        console.log("havingVt", havingVt)
        setVtuberOptions(havingVt);
      } catch (error) {
        console.error("Error fetching vtubers:", error);
      }
    };
    fetchVtubers();
  }, [posts.vtubers]);
  return (
    <><Select
        id="selectbox"
        instanceId="selectbox"
        placeholder="Vtuber名を検索/選択"  //  defaultValue= で何か変わる
        className="basic-single"  classNamePrefix="select"
        isClearable={true} isSearchable={true} name="VTuber"  //何のためにあるかわからん
        options={vtuberOptions} //選択候補
        defaultMenuIsOpen={true}   blurInputOnSelect={true}    styles={dropStyle}
        // value={onVtuberSelect}
        onChange={option => { //ここでSelectで選んだものがoptionに格納されるのか？←挙動的に多分違う
            // 要：選択中のmovieをクリアする関数
            onMovieClear(),
            onKaraokeClear()
          if (option) {
            console.log("Selected Vtuber value:", option.value); //1 になる(おいもの場合)
            onVtuberSelect(option.value);
          } else {
            handleVtuberClear();
          }
        }}  />   </>  );};

type DropDownMo = {
  posts:TopPagePosts;
  selectedVtuber: number;
  onMovieSelect:(value: string) => void; 
  onKaraokeClear:(value: number) => void;  
};

// const option[]:Options{
//   0:{value:"", label:""}
// }

// 
//  movie用
export const DropDownMo = ({ posts, selectedVtuber, onMovieSelect, onKaraokeClear }:DropDownMo) => {
  //const [selectedVtuber, setSelectedVtuber] = useState(null);
  const handleMovieClear = () => {
    onMovieSelect("");
    onKaraokeClear(0);
  };
  const [movieOptions, setMovieOptions] = useState<MovieOptions[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");

  useEffect(() => {
    if (!selectedVtuber) {
      setMovieOptions([]); // Vtuberが選択解除された場合、movieの選択肢を空にする
      return;
    }
    const filterMoviesOfSelectedVtuber = async () => {
      try {
          console.log("selectedV=",selectedVtuber)
          const choicesMovie = posts.movies.filter((movies:Movie) => movies.VtuberId === selectedVtuber);   
          console.log("API Response Mo:choicesMovie:", choicesMovie);
          let havingMovies = choicesMovie.map((movie:Movie) => ({
            value: movie.MovieUrl,
            label: movie.MovieTitle || ""
          }));
          console.log("havingMovie", havingMovies)
          console.log("havingMovie.values", havingMovies.values)
          setMovieOptions(havingMovies);
        } catch (error) {
          console.error("Error fetching movies:", error);
      };
      setSelectedMovieId("");
    };
    filterMoviesOfSelectedVtuber();
  }, [selectedVtuber, posts.movies]);

  return (
    <><Select
        id="selectbox"
        instanceId="selectbox"
        placeholder="動画タイトルを検索/選択" className="basic-single"  classNamePrefix="select"
        // value={selectedMovie}
        isClearable={true}  isSearchable={true} name="movie"
        blurInputOnSelect={true}  //defaultでtrueなら不要。スマホでアクセスしないと確認できないと思う。
        captureMenuScroll={true} //スマホ用、タブレット用。使ってみてからt/f判断。
        styles={dropStyle}
        // options={movieOptions}
        options={movieOptions}
        onChange={option => {
        console.log("movieのvalue 前", selectedMovieId, "optin=", option?.value)
            // 要：選択中のkaraokeをクリアする関数
          if (option) { //option = {lavelu:string, value:string}であり、console.log("option", option.value)できる
            console.log("option", option.value)
            onMovieSelect(option.value);
            setSelectedMovieId(option.value);
          console.log("movieのvalue if(option)", selectedMovieId)
          } else {
            handleMovieClear();
            setMovieOptions([]);
          }
          console.log("movieのvalue outside of if", selectedMovieId) //null 
        }}
      />
    </>
  );
};

type DropDownKaProps = {
  posts: AllData;
  selectedMovie: string;
  onKaraokeSelect:(value:number) => void ;
};

// karaoke_list用
export const DropDownKa = ({ posts, selectedMovie, onKaraokeSelect }:DropDownKaProps) => {
  // const [movies, setData2] = useState<KaraokeList[]>();
  const [karaokeListOptions, setKaraokeOptions] = useState<Options[]>([]);
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
        console.log("karaokes=",posts.karaokes)
        console.log("karaokes.MovieUrl=",posts.karaokes[0].MovieUrl)
        // const movieUrl = {selectedMovie}
        const choiceKaraoke = posts.karaokes.filter((karaokes:KaraokeList) => karaokes.MovieUrl === selectedMovie);
        console.log("API Response ka:", choiceKaraoke );
        let havingkaraokeList = choiceKaraoke.map((karaoke:KaraokeList) => ({
          value: karaoke.KaraokeListId,
          label: karaoke.SongName || ""
        }));
        if (havingkaraokeList){
        setKaraokeOptions(havingkaraokeList);}
      } catch (error) {
        console.error("Error fetching KaraokeLists:", error);
      }
      setSelectedKaraoke(0);
    };
    fetchKaraokes();
  }, [selectedMovie, posts.karaokes]);
  return (
    <>
      <Select
              id="selectbox"
              instanceId="selectbox"     
      placeholder="歌を検索/選択"  className="basic-single"  classNamePrefix="select"
        isClearable={true}  isSearchable={true}   options={karaokeListOptions}
        // value={selectedKaraoke} 
        // isMulti={true}  backspaceRemovesValue={false}
        blurInputOnSelect={true} styles={dropStyle}
      onChange={option => {
        if (option){ //選んだ時にエラー吐く
          onKaraokeSelect(option.value);
          // setSelectedKaraoke(option);
        // } else {
        //   handleKaraokeClear();
        //   setMovieOptions([]);
        }    
      }}     />    </>
  );
};


    // 公式
    // https://react-select.com/home

    // <select  value={hoge} 
    //これがあると、その値が変化したときのみUIが変化する
    // ない場合は「制御されないコンポーネント」となり、どんな変更でもUIが変化する