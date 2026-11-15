import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { type BasicDataProps, type CrudContentType, CreateContentData } from "@/types/vtuber_content"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { extractVideoId, ValidateCreateRules } from "@/util"
import { FormTW, ToClickTW } from "@/styles/tailwiind"
import { NeedBox } from "@/components/box/Box"
import { getYoutubeVideo, findVtuber } from "@/components/form/util/getYoutubeVideo"
import router from "next/router"
import KaraokesFormItem from "./KaraokesFormItem"
import { FormLabel } from "./FormLabel"
import { ErrorMessage } from "./ErrorMessage"
import { CrudContentSelector } from "../util/CrudContetntSelector"
import { getCreateKaraokesReq, getCreateKaraokeVideo, getCreateVtuberReq } from "./getRequest"
import { api } from "@/api/index"
import { InputMovieUrlHintBox } from "./InputMovieUrlHintBox"
import { v4 as uuidv4 } from "uuid"

export type CreatePageProps = {
  posts: BasicDataProps
  isSignin: boolean
}

type CreateDataProps = {
  posts: BasicDataProps
  selectedVtuberId: number
  selectedMovieUrl: string
  selectedKaraokeId: number
  selectVtuber: (vtuberId: number) => void
  selectVideo: (url: string) => void
  selectKaraokeSong: (KaraokeId: number) => void
  clearMovieHandler: () => void
  setCurrentVideoId: (videoId: string) => void
}

export function CreateForm({ posts, selectedVtuberId, selectedMovieUrl, selectedKaraokeId, selectVtuber, selectVideo, selectKaraokeSong, clearMovieHandler, setCurrentVideoId }: CreateDataProps) {
  const { vtubers, vtubers_movies: videos } = posts

  const [crudContentType, setCrudContentType] = useState<CrudContentType>("movie")
  const [isOkVideoTitle, setIsOkVideoTitle] = useState(false)
  const [isAbleVideoTitleInput, setIsAbleVideoTitleInput] = useState(false)
  const [isDisplayHint, setIsDisplayHint] = useState(false)

  const foundVtuber = vtubers?.find((vtuber) => vtuber.VtuberId === selectedVtuberId)
  const foundMovie = videos?.find((video) => video.MovieUrl === selectedMovieUrl)
  const selectedVtuberVideos = videos?.filter((video) => video.VtuberId === selectedVtuberId)

  const [isDisplaySuccessModal, setIsDisplaySuccessModal] = useState(false)
  const [isDisplayErrorModal, setIsDisplayErrorModal] = useState(false)
  const openSuccessModal = () => {
    setIsDisplaySuccessModal(true)
    setTimeout(() => setIsDisplaySuccessModal(false), 4500)
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue,
    getValues,
  } = useForm<CreateContentData>({
    reValidateMode: "onBlur",
    defaultValues: defaultCrudData(),
  })
  const movieUrl = watch("MovieUrl")
  const movieTitle = watch("MovieTitle")
  const [gotMovieErrorMessage, setGotMovieErrorMessage] = useState<string>("")

  const handleSetSelectedMovieUrl = (url: string) => {
    selectVideo(url)
    setValue("MovieUrl", url)
  }

  const getTitle = async (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (movieUrl != "") {
      const youtubeVideoId = extractVideoId(movieUrl)
      try {
        const res = await getYoutubeVideo({
          movieId: youtubeVideoId,
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

  const onSubmit = async (createData: CreateContentData) => {
    switch (crudContentType) {
      case "vtuber":
        api.CreateVtuber(getCreateVtuberReq(createData), openSuccessModal)
        return

      case "movie":
        if (selectedVtuberId === 0) {
          setIsDisplayErrorModal(true)
          return
        }
        api.CreateKaraokeVideo(getCreateKaraokeVideo(createData, selectedVtuberId), openSuccessModal)
        return

      case "karaoke":
        api.CreateKaraokes(getCreateKaraokesReq(createData), openSuccessModal)
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
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === "Enter") {
              e.preventDefault()
            }
          }}
        >
          <div className="flex flex-col">
            {crudContentType === "vtuber" && (
              <div className="flex flex-col">
                <h2 className="text-black mx-auto">登録データの入力</h2>
                <div className="mb-3">
                  <div className="">
                    <FormLabel label="VTuber" need />
                  </div>
                  <input className={`${ToClickTW.input}`} {...register("VtuberName", ValidateCreateRules.VtuberName)} placeholder={foundVtuber?.VtuberName || "例:妹望おいも"} />
                  <ErrorMessage errorField={formErrors.VtuberName} />
                </div>

                <div className="mb-3">
                  <FormLabel label="読み(kana)" need />
                  <input className={`${ToClickTW.input}`} {...register("VtuberKana", ValidateCreateRules.VtuberKana)} placeholder={foundVtuber?.VtuberKana || "例:imomochi_oimo"} />
                  <ErrorMessage errorField={formErrors.VtuberKana} />
                </div>

                <div>
                  <FormLabel label="紹介動画URL *1:" />
                  <input
                    className={`${ToClickTW.input}`}
                    {...register("IntroMovieUrl", ValidateCreateRules.IntroMovieUrl)}
                    placeholder={foundVtuber?.IntroMovieUrl || "例:www.youtube.com/watch?v=AlHRqSsF--8&t=75"}
                  />
                  <ErrorMessage errorField={formErrors.IntroMovieUrl} />
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
                  <span className="text-black mx-auto">親データの選択</span>

                  <div className="pb-3">
                    <div className={`${FormTW.label}`}>
                      VTuber
                      <NeedBox />
                    </div>
                    <DropDownVtuber vtubers={vtubers} onSelectVtuber={selectVtuber} defaultMenuIsOpen={false} />
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
                        {...register("MovieUrl", ValidateCreateRules.MovieUrl)}
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

                      <ErrorMessage errorField={formErrors.MovieUrl} />
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
                        {...register("MovieTitle", ValidateCreateRules.MovieTitle)}
                        placeholder={foundMovie?.MovieTitle || "動画タイトル"}
                        onChange={(e) => setValue("MovieTitle", e.target.value)}
                      />
                      <ErrorMessage errorField={formErrors.MovieTitle} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {crudContentType === "karaoke" && (
              <KaraokesFormItem
                posts={posts}
                selectedVtuberVideos={selectedVtuberVideos}
                selectedVtuberId={selectedVtuberId}
                selectedVideoUrl={selectedMovieUrl}
                setSelectedVtuberId={selectVtuber}
                setSelectedVideoUrl={handleSetSelectedMovieUrl}
                clearMovieHandler={clearMovieHandler}
                setSelectedKaraokeId={selectKaraokeSong}
                vtubers={vtubers}
                useFormReturn={{ register, control, handleSubmit, formState: { fieldErrors: formErrors }, getValues }}
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
                  <button className={`${ToClickTW.buttonNormal} mt-1`} onClick={getTitle} type="button">
                    動画タイトルを取得
                  </button>
                  <button
                    className={`${ToClickTW.buttonNormal} mt-1`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentVideoId(extractVideoId(movieUrl))
                    }}
                    type="button"
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

const defaultCrudData = (): CreateContentData => {
  return {
    VtuberId: 0,
    VtuberName: "",
    VtuberKana: "",
    IntroMovieUrl: "",
    MovieUrl: "",
    MovieTitle: "",
    Songs: Array.from({ length: 1 }, () => ({
      Index: uuidv4(),
      KaraokeId: 0,
      SingStart: "00:00:00",
      SongName: "",
    })),
  }
}
