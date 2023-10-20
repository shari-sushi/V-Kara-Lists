import React, { useState, useEffect, useMemo  } from 'react';
import Select from 'react-select';
import type { AllJoinData, Vtuber, Movie, KaraokeList } from '../types/singdata';
// import Creatable from 'react-select/creatable' 後々の更新で歌検索として実装したい

// import { colourOptions } from '../data';

// 今は使ってないけど、絶対必要になる。
// const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
//   <label style={{ marginRight: '1em' }}>
//     <input type="checkbox" {...props} />
//     {children}
//   </label>
// );

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

type Karaoke = {
  MovieUrl: string;
  KaraokeListId: number;
  SingStart: string;
  SongName: string;
  KaraokeListInputerId: number;
};

type Movie = {
  MovieUrl: string;
  MovieTitle: string;
  VtuberId: number;
  MovieInputerId: number;
};

type Vtuber = {
  VtuberId: number;
  VtuberName: string;
  VtuberKana: string;
  IntroMovieUrl: string | null;
  VtuberInputerId: number;
};

type Posts = {
  karaokes: Karaoke[];
  movies: Movie[];
  vtubers: Vtuber[];
};


 //onVtuberSelectはVtuberが選択されたときに親コンポーネントへ通知するためのコールバック関数
 export const DropDownVt = ({onVtuberSelect, onMovieClear, onKaraokeClear }) => {
  const handleVtuberClear = () => {
    onVtuberSelect(null);   //nillになる
    onMovieClear();         //undefinedになる
    onKaraokeClear();
  };
  const [vtuberOptions, setVtuberOptions] = useState([]);
  useEffect(() => {
    const fetchVtubers = async () => {
      try {
        let response = await fetch("https://localhost:8080/getvtuber");
        let data = await response.json();
        console.log("API Response Vt:", data);
        let havingVt = data.vtubers.map((vtuber:Vtuber) => ({
          value: vtuber.VtuberId,
          label: vtuber.VtuberName
        }));
        setVtuberOptions(havingVt);
      } catch (error) {
        console.error("Error fetching vtubers:", error);
      }
    };
    fetchVtubers();
  }, []);
  return (
    <>
      <Select
        placeholder="Vtuber名を検索/選択"  //  defaultValue= で何か変わる
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        name="VTuber"  //何のためにあるかわからん
        options={vtuberOptions}
        defaultMenuIsOpen={true}
        blurInputOnSelect={true}
        // isDisabled={false} isRtl={false} Value= //その他オプションのメモ
        styles={dropStyle}
    
        onChange={option => {
          if (option) {
            console.log("Selected Vtuber:", option);
            onVtuberSelect(option.value);
          } else {
            handleVtuberClear();
          }
        }}
      />
    </>
  );
};

// type DropDownMoProps = {
//   selectedVtuber: Vtuber;
//   onMovieSelect:Movie;
// };
// export const DropDownMo: React.FC<DropDownMoProps> = ({ selectedVtuber ,onMovieSelect}) => {
 
//  movie用
export const DropDownMo = ({ selectedVtuber, onMovieSelect, onKaraokeClear }) => {
// export const DropDownMo = ({ selectedVtuber ,onMovieSelect}) => {  
  //const [selectedVtuber, setSelectedVtuber] = useState(null);
  const handleMovieClear = () => {
    onMovieSelect(null);
    onKaraokeClear();
  };
  const [movieOptions, setMovieOptions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!selectedVtuber) {
      setMovieOptions([]); // Vtuberが選択解除された場合、movieの選択肢を空にする
      return;
    }
    const fetchMovies = async () => {
      try {
        let response = await fetch("https://localhost:8080/getmovie",{
          method: 'POSt',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ VtuberID: selectedVtuber })
          })
        let data = await response.json();
        console.log("API Response Mo:", data);
        let havingMovie = data.movies.map((movie:Movie) => ({
          value: movie.MovieUrl,
          label: movie.MovieTitle
        }));
        setMovieOptions(havingMovie);
      } catch (error) {
        console.error("Error fetching vtubers:", error);
      }
        setSelectedMovie(null);
    };
    fetchMovies();
  }, [selectedVtuber]);
  return (
    <>
      <Select
      placeholder="動画タイトルを検索/選択"
        className="basic-single"
        classNamePrefix="select"
        // value={changeValue}
        isClearable={true}
        isSearchable={true}
        name="movie"
        options={movieOptions}
        blurInputOnSelect={true}  //defaultでtrueなら不要。スマホでアクセスしないと確認できないと思う。
        captureMenuScroll={true} //スマホ用、タブレット用。使ってみてからt/f判断。
        // value={vtuberOptions.find(opt => opt.value === selectedVtuber)}
        // loadingMessage="loading" 
        styles={dropStyle}
        onChange={option => {
          if (option) {
            onMovieSelect(option);
          } else {
            handleMovieClear();
          }}}
      />
    </>
  );
};

// karaoke_list用
export const DropDownKa = ({ selectedMovie, onKaraokeSelect }) => {
  // const [movies, setData2] = useState<KaraokeList[]>();
  const [karaokeListOptions, setMovieOptions] = useState([]);
  const [selectedKaraoke, setSelectedKaraoke] = useState(null);

  useEffect(() => {
    if (!selectedMovie) {
      setMovieOptions([]); // Movieが選択解除された場合、karaokeの選択肢を空にする
      return;
    }
    // if (!selectedKaraoke){
    //   setSelectedKaraoke(null);
    //   return;
    // }
    const fetchMovies = async () => {
      try {
        console.log("selectedMovie=",selectedMovie)
        let response = await fetch("https://localhost:8080/getkaraokelist",{
          method: 'POSt',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ MovieUrl: selectedMovie.value })
          // body: JSON.stringify({ MovieId: selectedMovie ? selectedMovie.value : null })
          })
        let data = await response.json();
        console.log("API Response ka:", data);
        let havingkaraokeList = data.karaoke_lists.map((karaoke:KaraokeList) => ({
          value: karaoke.KaraokeListId,
          label: karaoke.SongName
        }));
        setMovieOptions(havingkaraokeList);
      } catch (error) {
        console.error("Error fetching vtubers:", error);
      }
      setSelectedKaraoke(null);
    };
    fetchMovies();
  }, [selectedMovie]);
  return (
    <>
      <Select
      placeholder="歌を検索/選択"
        className="basic-single"
        classNamePrefix="select"
        isClearable={true}
        isSearchable={true}
        options={karaokeListOptions}
        value={selectedKaraoke}
        isMulti={true} 
        backspaceRemovesValue={false}
        blurInputOnSelect={true}
        styles={dropStyle}
      onChange={option => {
        // if (option){ //選んだ時にエラー吐く
        console.log("Selected Karaoke1:", option); 
        if (typeof onKaraokeSelect === 'function') {
          console.log("Selected Karaoke2:", option); 
          onKaraokeSelect(option);
        }    
            // }  
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