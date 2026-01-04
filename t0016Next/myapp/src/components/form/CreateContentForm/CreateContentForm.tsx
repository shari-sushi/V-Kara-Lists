import React, { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { domain } from "@/../env"
import type { CrudDate, BasicDataProps, CrudContentType } from "@/types/vtuber_content"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { extractVideoId, ValidateCreate } from "@/util"
import { FormTW, ToClickTW } from "@/styles/tailwiind"
import { NeedBox } from "@/components/box/Box"
import { getYoutubeVideo, CrudContentSelector, findVtuber } from "@/components/form/Common"
import router from "next/router"
import KaraokesFormItem from "./KaraokesFormItem"
import { FormLabel } from "./FormLabel"
import { ErrorMessage } from "./ErrorMessage"

export type CreatePageProps = {
  posts: BasicDataProps
  isSignin: boolean
}

type CreateDataProps = {
  posts: BasicDataProps
  selectedVtuberId: number
  selectedMovieUrl: string
  selectedKaraokeId: number
  setSelectedVtuberId: (vtuberId: number) => void
  setSelectedMovieUrl: (url: string) => void
  setSelectedKaraokeId: (KaraokeId: number) => void
  clearMovieHandler: () => void
  setCurrentVideoId: (videoId: string) => void
}

type CreateVtuber = {
  VtuberName: string
  VtuberKana: string
  IntroMovieUrl: string | null
}
type CreateMovie = {
  VtuberId: number
  MovieTitle: string
  MovieUrl: string
}
type CreateKaraoke = {
  MovieUrl: string
  SongName: string
  SingStart: string
}

export function CreateForm({
  posts,
  selectedVtuberId,
  selectedMovieUrl,
  selectedKaraokeId,
  setSelectedVtuberId,
  setSelectedMovieUrl,
  setSelectedKaraokeId,
  clearMovieHandler,
  setCurrentVideoId,
}: CreateDataProps) {
  const [crudContentType, setCrudContentType] = useState<CrudContentType>("movie")
  const { vtubers, vtubers_movies: videos, vtubers_movies_karaokes: karaokes } = posts
  const [isOkVideoTitle, setIsOkVideoTitle] = useState(false)
  const [isAbleVideoTitleInput, setIsAbleVideoTitleInput] = useState(false)
  const [isDisplayHint, setIsDisplayHint] = useState(false)

  const foundVtuber = vtubers?.find((vtuber) => vtuber.VtuberId === selectedVtuberId)
  const foundMovie = videos?.find((movie) => movie.MovieUrl === selectedMovieUrl)
  const foundKaraoke = karaokes?.find((karaoke) => karaoke.KaraokeId === selectedKaraokeId)

  const axiosClient = axios.create({
    baseURL: `${domain.backendHost}/vcontents`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })

  const [isDisplaySuccessModal, setIsDisplaySuccessModal] = useState(false)
  const [isDisplayErrorModal, setIsDisplayErrorModal] = useState(false)
  const openSuccessModal = () => {
    setIsDisplaySuccessModal(true)
    setTimeout(() => setIsDisplaySuccessModal(false), 4500)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CrudDate>({ reValidateMode: "onChange" })
  const movieUrl = watch("MovieUrl")
  const movieTitle = watch("MovieTitle")
  const [gotMovieErrorMessage, setGotMovieErrorMessage] = useState<string>("")

  const getTitle = async (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (movieUrl != "") {
      const videoYtId = extractVideoId(movieUrl)
      try {
        const res = await getYoutubeVideo({
          movieId: videoYtId,
          isSnippet: true,
        })
        if (res) {
          console.log(`res %o`, res.items[0].snippet)
          const title = res.items[0].snippet.title
          setValue("MovieTitle", title)
          setIsOkVideoTitle(true)
        }
      } catch (err) {
        setValue("MovieTitle", "")
        setIsOkVideoTitle(false)
        setGotMovieErrorMessage("動画タイトルの取得に失敗しました。一時的な不具合の可能性があります。お手数ですが手入力も検討してください。")
        console.error(err)
      }
    } else {
      // TODO: modalを出す
      setValue("MovieTitle", "")
      setGotMovieErrorMessage("動画URLまたはIDを入力してください")
    }
  }

  const handleChangeInputMovieUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOkVideoTitle(false)
    setValue("MovieTitle", "")

    const id = extractVideoId(e.target.value)
    if (id === "") return
    setValue("MovieUrl", "www.youtube.com/watch?v=" + extractVideoId(e.target.value))
  }

  const onSubmit = async (CrudData: CrudDate) => {
    switch (crudContentType) {
      case "vtuber":
        try {
          const reqBody: CreateVtuber = {
            VtuberName: CrudData.VtuberName,
            VtuberKana: CrudData.VtuberKana,
            IntroMovieUrl: CrudData.IntroMovieUrl,
          }
          await axiosClient.post("/create/vtuber", reqBody)
          openSuccessModal()
        } catch (err) {
          alert("登録失敗: VTuber")
          console.error(err)
        }
        return

      case "movie":
        try {
          const reqBody: CreateMovie = {
            VtuberId: selectedVtuberId, //既存値
            MovieTitle: movieTitle,
            MovieUrl: movieUrl,
          }
          await axiosClient.post("/create/movie", reqBody)
          openSuccessModal()
        } catch (err) {
          alert("登録失敗: 動画")
          console.error(err)
        }
        return

      case "karaoke":
        try {
          const reqBody: CreateKaraoke = {
            MovieUrl: selectedMovieUrl, //既存値
            SongName: CrudData.SongName,
            SingStart: CrudData.SingStart,
          }
          await axiosClient.post("/create/karaoke", reqBody)
          openSuccessModal()
        } catch (err) {
          alert("登録失敗: 歌(karaoke)")
          console.error(err)
        }
        return

      default:
        console.error("データの種類(vtuber, movie, karaoke)の選択エラーです。１度ページを更新してください。")
    }
  }

  return (
    <div className="flex flex-col justify-center w-full bg-[#FFF6E4] shadow-md rounded px-1 md:px-4 pt-4 mb-4">
      <div id="selectContent" className="w-full mx-1 md:mx-3">
        <div className="flex flex-col justify-center w-full text-black font-bold">
          <CrudContentSelector contentType={crudContentType} setContentType={setCrudContentType} />
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />

      <div id="form" className="flex flex-col">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            {crudContentType === "vtuber" && (
              <div className="flex flex-col">
                <h2 className="text-black mx-auto">登録するデータを入力してください</h2>
                <div className="mb-3">
                  <div className="">
                    <FormLabel label="VTuber" need />
                  </div>
                  <input className={`${ToClickTW.input}`} {...register("VtuberName", ValidateCreate.VtuberName)} placeholder={foundVtuber?.VtuberName || "例:妹望おいも"} />
                  <ErrorMessage errorField={errors.VtuberName} />
                </div>

                <div className="mb-3">
                  <FormLabel label="読み(kana)" need />
                  <input className={`${ToClickTW.input}`} {...register("VtuberKana", ValidateCreate.VtuberKana)} placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"} />
                  <ErrorMessage errorField={errors.VtuberKana} />
                </div>

                <div>
                  <FormLabel label="紹介動画URL *1:" />
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("IntroMovieUrl", ValidateCreate.IntroMovieUrl)}
                    placeholder={foundVtuber?.IntroMovieUrl || "例:www.youtube.com/watch?v=AlHRqSsF--8&t=75"}
                  />
                  <ErrorMessage errorField={errors.IntroMovieUrl} />
                  <div className="flex flex-col text-black">
                    <span>*1 時間指定方法(&t=秒数)</span>
                    <span className="ml-4">
                      例:www.youtube.com/watch?v=7QStB569mto<u>&t=290</u>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {crudContentType === "movie" && (
              <>
                <div className="flex flex-col w-full">
                  <span className="text-black mx-auto">親データを選択してください</span>

                  <div className="pb-3">
                    <div className={`${FormTW.label}`}>
                      VTuber
                      <NeedBox />
                    </div>
                    <DropDownVtuber posts={posts} onVtuberSelect={setSelectedVtuberId} defaultMenuIsOpen={false} selectedVtuber={findVtuber(vtubers, selectedVtuberId)} />
                    {selectedVtuberId == 0 && <div className="text-[#ff3f3f] text-sm">チャンネルを選択してください</div>}
                  </div>

                  <hr className={`${FormTW.horizon}`} />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-black text-center">登録するデータを入力してください</h2>
                  <div className="flex flex-col gap-y-3">
                    <div>
                      <div className="flex gap-x-1 mb-1">
                        <FormLabel label="動画URL" need bodyNote={<InputMovieUrlHintBox isDisplay={isDisplayHint} setIsDisplay={setIsDisplayHint} />} />
                      </div>
                      <input
                        className={`${ToClickTW.input}`}
                        {...register("MovieUrl", ValidateCreate.MovieUrl)}
                        placeholder={foundMovie?.MovieUrl || "例: www.youtube.com/watch?v=AlHRqSsF--8"}
                        onChange={handleChangeInputMovieUrl}
                      />
                      <div className="flex gap-x-1">
                        <button className={`${ToClickTW.buttonNormal} mt-1`} onClick={getTitle}>
                          動画タイトルを取得
                        </button>
                        <button
                          className={`${ToClickTW.buttonNormal} mt-1`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setCurrentVideoId(extractVideoId(movieUrl))
                          }}
                        >
                          再生
                        </button>
                      </div>
                      <span className="text-red-500">{gotMovieErrorMessage}</span>

                      <ErrorMessage errorField={errors.MovieUrl} />
                    </div>
                    <div>
                      <div className="flex ">
                        <FormLabel label="動画タイトル" need />
                        <label className={`${ToClickTW.buttonNormal} flex items-center text-sm cursor-pointer`}>
                          <input className="mr-1" type="checkbox" checked={isAbleVideoTitleInput} onChange={(e) => setIsAbleVideoTitleInput(e.target.checked)} />
                          手入力する
                        </label>
                      </div>
                      <input
                        disabled={!isAbleVideoTitleInput}
                        className={`${ToClickTW.input}`}
                        value={movieTitle}
                        {...register("MovieTitle", ValidateCreate.MovieTitle)}
                        placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                        onChange={(e) => setValue("MovieTitle", e.target.value)}
                      />
                      <ErrorMessage errorField={errors.MovieTitle} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {crudContentType === "karaoke" && (
              <KaraokesFormItem
                posts={posts}
                selectedVtuberId={selectedVtuberId}
                selectedMovieUrl={selectedMovieUrl}
                setSelectedVtuberId={setSelectedVtuberId}
                setSelectedMovieUrl={setSelectedMovieUrl}
                clearMovieHandler={clearMovieHandler}
                setSelectedKaraokeId={setSelectedKaraokeId}
                foundKaraoke={foundKaraoke}
                vtubers={vtubers}
                register={register}
                errors={errors}
              />
            )}
          </div>
          <hr className={`${FormTW.horizon}`} />

          <div className="flex relative justify-center">
            <button
              onClick={() => {
                if (crudContentType === "movie") {
                  setIsDisplayErrorModal(false)
                  if (movieTitle == "" || selectedVtuberId == 0) {
                    setIsDisplayErrorModal(true)
                  }
                  if (!isOkVideoTitle && !isAbleVideoTitleInput) {
                    setGotMovieErrorMessage(`「？」ボタンでルールを確認してください`)
                  }
                }
              }}
              className={`${ToClickTW.decide} m-4 w-[100px] `}
            >
              登録確定
            </button>
          </div>
        </form>

        {isDisplaySuccessModal && (
          <div className="absolute z-20 bottom-[150px] left-[50%] -translate-x-[50%] h-52 w-[86%] md:w-96 bg-[#B7A692] p-2 pt-5 rounded-2xl shadow-lg shadow-black">
            <div className="flex flex-col justify-center item-center md:text-2xl font-bold">
              <span className="mx-auto">登録完了しました。</span>
              <span className="mx-auto">ページ内のリストを更新しますか？</span>
            </div>
            <div className="flex flex-col md:flex-row md:text-xl mt-2 md:mt-6">
              <button type="button" onClick={() => router.reload()} className={`${ToClickTW.boldChoice} p-2 mx-auto`}>
                更新する
              </button>
              <button type="button" onClick={() => setIsDisplaySuccessModal(false)} className={`${ToClickTW.boldChoice} p-2 mx-auto mt-4 md:my-0 font-bold`}>
                入力を維持するために <br />
                更新しない
              </button>
            </div>
          </div>
        )}

        {isDisplayErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            <div className="h-full w-full bg-black opacity-50" onClick={() => setIsDisplayErrorModal(false)} />

            <div className="absolute md:top-[150px] items-center min-w-[300px] md:max-w-xl w-[90%] py-2 px-4 flex flex-col gap-y-1 bg-[#B7A692] rounded-2xl shadow-lg shadow-black">
              <div className="w-32 self-start text-center rounded-t-md font-bold bg-[#776D5C]">エラー Error ⚠️</div>

              <div className="flex flex-col h-48 w-full bg-[#FFF6E4] justify-center items-center rounded-b-md">
                <div className="text-black">入力内容を見直してください</div>
                <div className="text-black">各ボタンもご活用ください</div>
                <div className="flex gap-3">
                  <div
                    className="flex text-xs justify-center rounded-md h-[16px] w-[15px] mt-2 m-0.5 bg-[#B7A893] hover:bg-[#776D5C] shadow-sm shadow-black hover:shadow-none cursor-pointer"
                    onClick={() => setIsDisplayHint(true)}
                  >
                    ？
                  </div>
                  <button className={`${ToClickTW.buttonNormal} mt-1`} onClick={getTitle}>
                    動画タイトルを取得
                  </button>
                  <button
                    className={`${ToClickTW.buttonNormal} mt-1`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentVideoId(extractVideoId(movieUrl))
                    }}
                  >
                    再生
                  </button>
                </div>
              </div>
              <div
                className={`flex justify-center items-center w-[40%] h-10 rounded-md m-1 p-1 bg-[#776D5C] text-white font-semibold shadow-sm shadow-black hover:shadow-inner hover:shadow-[#FFF6E4]`}
                onClick={() => {
                  setIsDisplayErrorModal(false)
                }}
              >
                閉じる
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type InputMovieUrlHintBoxProps = {
  isDisplay: boolean
  setIsDisplay: (open: boolean) => void
}

const InputMovieUrlHintBox = ({ isDisplay, setIsDisplay }: InputMovieUrlHintBoxProps) => {
  return (
    <div className="flex relative w-5 text-white ">
      <div
        className="flex absolute -top-5 text-xs justify-center rounded-md h-[16px] w-[15px] m-0.5 bg-[#B7A893] hover:bg-[#776D5C] shadow-sm shadow-black hover:shadow-none cursor-pointer"
        onClick={() => setIsDisplay(true)}
      >
        ？
      </div>

      {isDisplay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="h-full w-full bg-black opacity-50" onClick={() => setIsDisplay(false)} />

          <div className="absolute z-30 md:top-[150px] items-center min-w-[300px] md:min-w-[600px] md:max-w-3xl w-[90%] py-2 px-4 flex flex-col gap-y-1 bg-[#B7A692] rounded-2xl shadow-lg shadow-black">
            <div className="w-32 self-start text-center rounded-t-md font-bold bg-[#776D5C]">ヒント💡</div>

            <div className="flex flex-col overflow-y-auto h-60 text-black w-full bg-[#FFF6E4]">
              <div className=" h-full w-full rounded-b-md px-2">
                V-Karaでは次のような書き方をURLとして認識できます。
                <div className="flex flex-col gap-1 pl-3">
                  <li>
                    https://youtu.be/<u>SHF-EJiC9qk</u>
                  </li>
                  <li>
                    youtu.be/<u>JXEyM8oZyhg</u>
                  </li>
                  <li>
                    https://www.youtube.com/watch?v=<u>gwgo01UVPvY</u>&t=1342
                  </li>
                  <li>
                    www.youtube.com/watch?v=<u>77lB1lMNOvY</u>&t=1342
                  </li>
                  <li>
                    https://www.youtube.com/live/<u>4OnkujqOMx4</u>
                  </li>
                  <li>
                    www.youtube.com/live/<u>CsOHuZLRQOs</u>
                  </li>
                  <li>
                    <u>R6w92OanMD8</u>
                  </li>
                </div>
              </div>
            </div>
            <div
              className={`flex justify-center items-center w-[40%] h-10 rounded-md p-1 bg-[#776D5C] text-white font-semibold shadow-sm shadow-black hover:shadow-inner hover:shadow-[#FFF6E4]`}
              onClick={() => {
                setIsDisplay(false)
              }}
            >
              閉じる
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
