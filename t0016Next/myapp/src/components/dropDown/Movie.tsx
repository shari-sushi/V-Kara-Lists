import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';
import { DropStyle, TopPagePosts } from './common'

// DropDinwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき

type MovieOptions = {
    value: string;
    label: string;
}

type DropDownMovieProps = {
    posts: TopPagePosts;
    // posts:ReceivedMovie[];
    selectedVtuber: number;
    onMovieSelect: (value: string) => void;
    onKaraokeClear: (value: number) => void;
};

export const DropDownMovie = ({ posts, selectedVtuber, onMovieSelect, onKaraokeClear }: DropDownMovieProps) => {
    const movies = posts?.vtubers_movies
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
                console.log("selectedV=", selectedVtuber)
                const choicesMovie = movies.filter((movies: ReceivedMovie) => movies.VtuberId === selectedVtuber);
                console.log("API Response Mo:choicesMovie:", choicesMovie);
                let havingMovies = choicesMovie.map((movie: ReceivedMovie) => ({
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
    }, [selectedVtuber, movies]);

    return (
        <><Select
            id="selectbox"
            instanceId="selectbox"
            placeholder="動画タイトルを検索/選択"
            className="basic-single"
            classNamePrefix="select"
            // value={selectedMovie}
            isClearable={true}
            isSearchable={true}
            name="movie"
            blurInputOnSelect={true}  //defaultでtrueなら不要。スマホでアクセスしないと確認できないと思う。
            captureMenuScroll={true} //スマホ用、タブレット用。使ってみてからt/f判断。
            styles={DropStyle}
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
