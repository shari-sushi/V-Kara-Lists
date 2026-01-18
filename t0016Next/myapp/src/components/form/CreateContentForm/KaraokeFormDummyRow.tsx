import { CreateContentData } from "@/types/vtuber_content"
import { UseFieldArrayAppend } from "react-hook-form"
import { RemoveRowButton } from "./RemoveRowButton"
import { v4 as uuidv4 } from "uuid"
import { ToClickTW } from "@/styles/tailwiind"

type KaraokeFormDummyRowProps = {
  append: UseFieldArrayAppend<CreateContentData, "Songs">
}

export const KaraokeFormDummyRow = ({ append }: KaraokeFormDummyRowProps) => {
  const handleAppend = (count: number) => {
    append(
      Array.from({ length: count }, () => {
        return {
          Index: uuidv4(),
          KaraokeId: 0,
          SingStart: "00:00:00",
          SongName: "",
        }
      })
    )
  }

  return (
    <tr className="relative border-2">
      <td className="opacity-40 select-none flex justify-center items-center gap-x-1 py-0.5">
        <button className={`w-7 h-7 flex items-center justify-center rounded-md bg-zinc-300 opacity-50 cursor-pointer`} disabled type="button">
          ▲
        </button>
        <button className={`w-7 h-7 flex items-center justify-center rounded-md bg-zinc-300 opacity-50 cursor-pointer`} disabled type="button">
          ▼
        </button>
      </td>
      <td className="opacity-40">
        <input className={`border w-full py-1 px-3 bg-gray-300 h-full border-zinc-400`} disabled placeholder={"曲名"} />
      </td>
      <td className=" opacity-40">
        <input className={`border w-full max-w-32 py-1 px-3 bg-gray-300 h-full border-zinc-300 rounded-sm`} type="time" disabled />
      </td>
      <td className="opacity-40">
        <RemoveRowButton RemoveRow={() => {}} disabled />
      </td>
      <div className="absolute top-0 left-0 flex w-full h-full gap-x-5 justify-center items-center">
        <AppendKaraokeSongRows appendCount={1} append={handleAppend} />
        <AppendKaraokeSongRows appendCount={5} append={handleAppend} />
        <AppendKaraokeSongRows appendCount={10} append={handleAppend} />
      </div>
    </tr>
  )
}

type AppendKaraokeSongRowsProps = {
  appendCount: number
  append: (appendCount: number) => void
}

const AppendKaraokeSongRows = ({ appendCount, append }: AppendKaraokeSongRowsProps) => {
  return (
    <button
      type="button"
      className={`w-12 h-6 flex items-center justify-center md:hover:bg-[#657261] border border-[#575044] shadow-md hover:shadow-none text-white font-semibold rounded-md mx-2 bg-primary`}
      onClick={() => append(appendCount)}
    >
      +{appendCount}
    </button>
  )
}
