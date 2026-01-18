import React from "react"
import { DropDownVtuber } from "@/components/dropDown/Vtuber"
import { DropDownMovie } from "@/components/dropDown/Movie"
import { DropDownKaraokeSongs } from "@/components/dropDown/Karaoke"
import { timeStringToSecondNum, ValidateCreateRules } from "@/util"
import { FormTW, ToClickTW } from "@/styles/tailwiind"
import { NeedBox } from "@/components/box/Box"
import { findVtuber } from "@/components/form/util/getYoutubeVideo"
import { BasicDataProps, CreateContentData, ReceivedMovie, ReceivedVtuber } from "@/types/vtuber_content"
import { FormLabel } from "./FormLabel"
import { ErrorMessage } from "./ErrorMessage"
import { Control, FieldErrors, useFieldArray, UseFormGetValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { RemoveRowButton } from "./RemoveRowButton"
import { KaraokeFormDummyRow } from "./KaraokeFormDummyRow"

type KaraokesFormItemProps = {
  posts: BasicDataProps
  selectedVtuberId: number
  selectedVideoUrl: string
  selectedVtuberVideos: ReceivedMovie[] | undefined
  setSelectedVtuberId: (vtuberId: number) => void
  setSelectedVideoUrl: (movieUrl: string) => void
  clearMovieHandler: () => void
  setSelectedKaraokeId: (karaokeId: number) => void
  vtubers: ReceivedVtuber[]
  useFormReturn: {
    register: UseFormRegister<CreateContentData>
    control: Control<CreateContentData, any>
    handleSubmit: UseFormHandleSubmit<CreateContentData, undefined>
    formState: {
      fieldErrors: FieldErrors<CreateContentData>
    }
    getValues: UseFormGetValues<CreateContentData>
  }
}

const KaraokesFormItem = ({
  posts: { vtubers: vtubers, vtubers_movies_karaokes: karaokeSongs },
  selectedVtuberVideos,
  selectedVtuberId,
  selectedVideoUrl,
  setSelectedVtuberId,
  setSelectedVideoUrl,
  setSelectedKaraokeId,
  clearMovieHandler,
  useFormReturn: {
    control,
    formState: { fieldErrors: errors },
    getValues,
    register,
  },
}: KaraokesFormItemProps) => {
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: "Songs",
  })

  const AscendByStartTime = () => {
    const isFailedSingStart = (s: string): boolean => {
      if (s.length !== 8) return true
      if (s.split(":").length !== 3) return true
      return false
    }

    const sorted = [...getValues("Songs")].sort((a, b) => {
      const aFail = isFailedSingStart(a.SingStart)
      const bFail = isFailedSingStart(b.SingStart)
      if (aFail && bFail) return 0
      if (aFail) return 1
      if (bFail) return -1

      return timeStringToSecondNum(a.SingStart) - timeStringToSecondNum(b.SingStart)
    })

    replace(sorted)
  }

  const songsErrors = errors as FieldErrors<CreateContentData>

  return (
    <>
      <div className="flex flex-col w-full">
        <span className="text-black text-center">親データの選択</span>
        <div className="pb-3">
          <div className={`${FormTW.label}`}>
            VTuber
            <NeedBox />
          </div>
          <DropDownVtuber vtubers={vtubers} onSelectVtuber={setSelectedVtuberId} defaultMenuIsOpen={false} />
          {selectedVtuberId == 0 && <div className="text-[#ff3f3f] text-sm">チャンネルを選択してください</div>}
        </div>

        <div className="flex flex-col w-full ">
          <div className={`${FormTW.label}`}>
            動画(歌枠)
            <NeedBox />
          </div>
          <DropDownMovie videos={selectedVtuberVideos} disabled={selectedVtuberId === 0} setSelectedMovie={setSelectedVideoUrl} clearMovieHandler={clearMovieHandler} />
          {selectedVideoUrl == "" && <div className="text-[#ff3f3f] text-sm">動画を選択してください</div>}
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
          <DropDownKaraokeSongs karaokeSongs={karaokeSongs} selectedMovie={selectedVideoUrl} onKaraokeSelect={setSelectedKaraokeId} />
        </div>
      </div>
      <hr className={`${FormTW.horizon}`} />
      <div className="flex flex-col">
        <h2 className="text-black mx-auto">歌情報の入力</h2>
        <table className="w-full text-black mt-4 border-2">
          <thead className="border-2">
            <tr>
              <th className="border-2 w-20 mx-auto">並び替え</th>
              <th className="mx-auto">
                <FormLabel label="曲" need />
              </th>
              <th className="border-2 w-32 mx-auto">
                <div className="flex">
                  <AscendTimeStartTimeButton sort={AscendByStartTime} disabled={fields.length == 1} />
                  <FormLabel label="開始時間" need />
                </div>
              </th>
              <th className="w-12 mx-auto">削除</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((song, i) => {
              return (
                <Row
                  key={song.Index}
                  index={i}
                  songsCount={fields.length}
                  move={move}
                  deleteRow={() => remove(i)}
                  useFormReturn={{
                    formState: {
                      fieldErrors: errors,
                    },
                    register,
                  }}
                  song={song}
                />
              )
            })}
          </tbody>
          <tfoot>
            <KaraokeFormDummyRow append={append} />
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default KaraokesFormItem

type RowProps = {
  index: number
  songsCount: number
  deleteRow: () => void
  useFormReturn: {
    register: UseFormRegister<CreateContentData>
    formState: {
      fieldErrors: FieldErrors<CreateContentData>
    }
  }
  move: (indexA: number, indexB: number) => void
  song: CreateContentData["Songs"][number]
}

const Row = ({
  index,
  songsCount,
  deleteRow,
  useFormReturn: {
    formState: { fieldErrors: errors },
    register,
  },
  move,
}: RowProps) => {
  const singleErrors = errors as FieldErrors<CreateContentData>

  return (
    <tr className="border-2">
      <td className="select-none flex justify-center items-center gap-x-1 py-0.5">
        <button
          className={`w-7 h-7 flex items-center justify-center  rounded-md bg-zinc-300/70 ${index == 0 ? "opacity-70 text-black/30" : "cursor-pointer hover:bg-zinc-400"}`}
          disabled={index <= 0}
          type="button"
          onClick={() => move(index, index - 1)}
        >
          ▲
        </button>
        <button
          className={`w-7 h-7 flex items-center justify-center  rounded-md bg-zinc-300/70 ${index >= songsCount - 1 ? "opacity-70 text-black/30" : "cursor-pointer hover:bg-zinc-400"}`}
          disabled={index >= songsCount - 1}
          type="button"
          onClick={() => move(index, index + 1)}
        >
          ▼
        </button>
      </td>
      <td className="">
        <input className={`${ToClickTW.multipleInputRow} h-full border-zinc-400`} {...register(`Songs.${index}.SongName`, ValidateCreateRules.SongName)} placeholder={"曲名"} autoFocus={false} />
      </td>
      <td className="">
        <input
          className={`${ToClickTW.multipleInputRow} max-w-32 border-zinc-300 rounded-sm`}
          type="time"
          step="1"
          {...register(`Songs.${index}.SingStart`, ValidateCreateRules.SingStart)}
          autoFocus={false}
        />
      </td>
      <td>
        <RemoveRowButton RemoveRow={deleteRow} disabled={songsCount == 1} />
      </td>

      {/* TODO: どこかに表示する。後回し */}
      {/* <ErrorMessage errorField={singleErrors.SongName} /> */}
      {/* <ErrorMessage errorField={singleErrors.SingStart} /> */}
    </tr>
  )
}

type SortByTimeStartTimeButtonProps = {
  sort: () => void
  disabled?: boolean
}

const AscendTimeStartTimeButton = ({ sort, disabled }: SortByTimeStartTimeButtonProps) => {
  return (
    <div
      className={`flex rounded-md select-none ${disabled ? "opacity-70" : "cursor-pointer"}`}
      onClick={() => {
        if (disabled) return
        sort()
      }}
    >
      🔼
    </div>
  )
}
