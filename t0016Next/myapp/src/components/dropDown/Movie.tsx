import React, { useState, useEffect } from "react"
import Select from "react-select"
import type { ReceivedVideo } from "@/types/vtuber_content"
import { DropStyle } from "./common"

// DropDonwMo, Kaについは、on~~Seletがnillとか0なら処理を止めべき
type MovieOptions = {
  value: string
  label: string
}

type DropDownMovieProps = {
  videos: ReceivedVideo[] | undefined
  disabled: boolean
  setSelectedMovie: (movieUrl: string) => void
  clearMovieHandler: () => void
}

export const DropDownMovie = ({ videos, disabled, setSelectedMovie, clearMovieHandler }: DropDownMovieProps) => {
  const handleMovieClear = () => {
    setSelectedMovie("")
    clearMovieHandler()
  }

  const movieOptions = disabled
    ? undefined
    : videos?.map((movie: ReceivedVideo) => ({
        value: movie.MovieUrl,
        label: movie.Title,
      }))

  return (
    <div
      onClick={() => {
        if (disabled) {
          alert("VTuber(チャンネル所有者)を選択してください")
        }
      }}
      className="cursor-pointer"
    >
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
        isDisabled={disabled}
      />
    </div>
  )
}

type DropDownAllMovieProps = {
  preMovies: Pick<ReceivedVideo, "MovieUrl" | "Title">[]
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

  const movieOptions = preMovies?.map((movie) => ({
    value: movie.MovieUrl,
    label: movie.Title,
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
