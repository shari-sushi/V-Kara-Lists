import React from "react"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { DropDownMovie } from "@/components/dropDown/Movie"
import { DropDownKaraoke } from "@/components/dropDown/Karaoke"
import { ValidateCreate } from "@/util"
import { FormTW, ToClickTW } from "@/styles/tailwiind"
import { NeedBox } from "@/components/box/Box"
import { findVtuber } from "@/components/form/Common"
import { CrudDate, BasicDataProps, ReceivedKaraoke, ReceivedVtuber } from "@/types/vtuber_content"
import { FormLabel } from "./FormLabel"
import { ErrorMessage } from "./ErrorMessage"
import { FieldErrors, UseFormRegister } from "react-hook-form"

type KaraokesFormItemProps = {
  posts: BasicDataProps
  selectedVtuberId: number
  selectedMovieUrl: string
  setSelectedVtuberId: (vtuberId: number) => void
  setSelectedMovieUrl: (movieUrl: string) => void
  clearMovieHandler: () => void
  setSelectedKaraokeId: (karaokeId: number) => void
  foundKaraoke: ReceivedKaraoke | undefined
  vtubers: ReceivedVtuber[]
  errors: FieldErrors<CrudDate>
  register: UseFormRegister<CrudDate>
}

const KaraokesFormItem = ({
  posts,
  selectedVtuberId,
  selectedMovieUrl,
  setSelectedVtuberId,
  setSelectedMovieUrl,
  clearMovieHandler,
  setSelectedKaraokeId,
  foundKaraoke,
  vtubers,
  register,
  errors,
}: KaraokesFormItemProps) => {
  return (
    <>
      <div className="flex flex-col w-full">
        <span className="text-black text-center">親データを選択してください</span>
        <div className="pb-3">
          <div className={`${FormTW.label}`}>
            VTuber
            <NeedBox />
          </div>
          <DropDownVtuber posts={posts} onVtuberSelect={setSelectedVtuberId} defaultMenuIsOpen={false} selectedVtuber={findVtuber(vtubers, selectedVtuberId)} />
          {selectedVtuberId == 0 && (
            <div className="text-[#ff3f3f] text-sm">
              <div className="text-[#ff3f3f] ">チャンネルを選択してください</div>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full ">
          <div className={`${FormTW.label}`}>
            動画(歌枠)
            <NeedBox />
          </div>
          <DropDownMovie posts={posts} selectedVtuber={selectedVtuberId} setSelectedMovie={setSelectedMovieUrl} clearMovieHandler={clearMovieHandler} />
          {selectedMovieUrl == "" && <div className="text-[#ff3f3f] ">動画を選択してください</div>}
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />
      <div id="decide" className=" ">
        <div className="flex flex-col justify-center mt-1 my-3">
          <span className="text-black text-center">
            登録済みか確認(選択で再生されます)
            <br />
            同じ動画で複数曲を登録する際は、「曲(〇回目)」としてください。
          </span>
          <DropDownKaraoke posts={posts} selectedMovie={selectedMovieUrl} onKaraokeSelect={setSelectedKaraokeId} />
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />
      <div className="flex flex-col">
        <h2 className="text-black mx-auto">登録するデータを入力してください</h2>
        <div className="flex flex-col gap-y-3">
          <div>
            <FormLabel label="曲" need />
            <input className={`${ToClickTW.input}`} {...register("SongName", ValidateCreate.SongName)} placeholder={foundKaraoke?.SongName || "曲"} />
            <ErrorMessage errorField={errors.SongName} />
          </div>
          <div>
            <FormLabel label="開始時間" need />
            <input className={`${ToClickTW.input}`} type="time" step="1" {...register("SingStart", ValidateCreate.SingStart)} />
            <ErrorMessage errorField={errors.SingStart} />
          </div>
        </div>
      </div>
    </>
  )
}

export default KaraokesFormItem
