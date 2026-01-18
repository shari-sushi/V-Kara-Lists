import React, { useState, useEffect } from "react"
import Select from "react-select"
import type { ReceivedMovie } from "@/types/vtuber_content"
import { DropStyle } from "./common"

// DropDonwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき
type MovieOptions = {
  value: string
  label: string
}

type DropDownMovieProps = {
  videos: ReceivedMovie[]
  selectedVtuber: number
  setSelectedMovie: (movieUrl: string) => void
  clearMovieHandler: () => void
}

export const DropDownMovie = ({ videos, selectedVtuber, setSelectedMovie, clearMovieHandler }: DropDownMovieProps) => {
  const handleMovieClear = () => {
    setSelectedMovie("")
    clearMovieHandler()
  }
  const [movieOptions, setMovieOptions] = useState<MovieOptions[]>([])

  useEffect(() => {
    if (!selectedVtuber) {
      setMovieOptions([])
      setSelectedMovie("")
      // ここで表示も消したい。消し方不明
      return
    } else {
      const filterMoviesBySelectedVtuber = async () => {
        try {
          const movieDatum = videos.filter((movies: ReceivedMovie) => movies.VtuberId === selectedVtuber)
          const movieOptions = movieDatum.map((movie: ReceivedMovie) => ({
            value: movie.MovieUrl,
            label: movie.MovieTitle,
          }))
          setMovieOptions(movieOptions)
        } catch (error) {
          console.error("Error: failed to filter Movies By Selected Vtuber in /dropDown/:", error)
        }
      }
      filterMoviesBySelectedVtuber()
    }
  }, [selectedVtuber, videos, setSelectedMovie])

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="動画タイトルを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      // value={""} //何を入れても選択したものが表示されないだけ
      isClearable={true}
      isSearchable={true}
      name="movie"
      blurInputOnSelect={true}
      captureMenuScroll={true}
      styles={DropStyle}
      options={movieOptions}
      onChange={(option) => {
        if (option) {
          setSelectedMovie(option.value)
        } else {
          handleMovieClear()
        }
      }}
    />
  )
}

type DropDownAllMovieProps = {
  preMovies: ReceivedMovie[]
  setSelectedMovie: (value: string) => void
  // ✩１
  // clearMovieHandler: () => void;
}

export const DropDownAllMovie = ({ preMovies, setSelectedMovie }: DropDownAllMovieProps) => {
  // ✩１
  // const handleMovieClear = () => {
  // setSelectedMovie("");
  // clearMovieHandler();
  // };

  const movieOptions = preMovies?.map((movie: ReceivedMovie) => ({
    value: movie.MovieUrl,
    label: movie.MovieTitle,
  }))

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="動画タイトルを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      isClearable={true}
      isSearchable={true}
      name="movie"
      blurInputOnSelect={true}
      captureMenuScroll={true}
      styles={DropStyle}
      options={movieOptions}
      onChange={(option) => {
        if (option) {
          setSelectedMovie(option.value)
        } else {
          setSelectedMovie("")
          // ✩１(↓がある時は↑が不要)
          // handleMovieClear();
        }
      }}
    />
  )
}
