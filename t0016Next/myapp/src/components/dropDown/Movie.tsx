import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import type { ReceivedMovie } from '@/types/vtuber_content';
import { DropStyle, TopPagePosts } from './common'

// DropDinwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき
type MovieOptions = {
    value: string;
    label: string;
}

type DropDownMovieProps = {
    posts: TopPagePosts;
    selectedVtuber: number;
    setSelectedMovie: (value: string) => void;
    clearMovieHandler: () => void;
};

export const DropDownMovie = ({ posts, selectedVtuber, setSelectedMovie, clearMovieHandler }: DropDownMovieProps) => {
    const movies = posts?.vtubers_movies || [{} as ReceivedMovie]
    const handleMovieClear = () => {
        setSelectedMovie("");
        clearMovieHandler();
    };
    const [movieOptions, setMovieOptions] = useState<MovieOptions[]>([]);

    useEffect(() => {
        if (!selectedVtuber) {
            setMovieOptions([]);
            setSelectedMovie("")
            // ここで表示も消したい。消し方不明
            return;
        } else {
            const filterMoviesBySelectedVtuber = async () => {
                try {
                    const movieDatum = movies.filter((movies: ReceivedMovie) => movies.VtuberId === selectedVtuber);
                    const movieOptions = movieDatum.map((movie: ReceivedMovie) => ({
                        value: movie.MovieUrl,
                        label: movie.MovieTitle
                    }));
                    setMovieOptions(movieOptions);
                } catch (error) {
                    console.error("Error: failed to filter Movies By Selected Vtuber in /dropDown/:", error);
                };
            };
            filterMoviesBySelectedVtuber();
        }
    }, [selectedVtuber, movies]);

    return (
        <><Select
            id="selectbox"
            instanceId="selectbox"
            placeholder="動画タイトルを検索/選択"
            className="basic-single"
            classNamePrefix="select"
            // value={""} //何を入れても選択したものが表示されないだけ
            isClearable={true}
            isSearchable={true}
            name="movie"
            blurInputOnSelect={true}  //defaultでtrueなら不要。スマホでアクセスしないと確認できないと思う。
            captureMenuScroll={true} //スマホ、タブレット用。使ってみてからt/f判断。
            styles={DropStyle}
            options={movieOptions}
            onChange={option => {
                if (option) {
                    setSelectedMovie(option.value);
                } else {
                    handleMovieClear();
                }
            }}
        />
        </>
    );
};
