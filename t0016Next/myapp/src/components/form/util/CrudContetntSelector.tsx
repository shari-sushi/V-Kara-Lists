import { ToClickTW } from "@/styles/tailwiind"
import { CrudContentType } from "@/types/vtuber_content"

interface CrudContentSelectorProps {
  contentType: string
  setContentType: (type: CrudContentType) => void
}

export const CrudContentSelector = ({ contentType, setContentType }: CrudContentSelectorProps) => {
  return (
    <div className="w-full">
      <span className={`flex justify-center`}>データ種類の選択</span>
      <div id="select_data_type" className="flex justify-center">
        <button
          onClick={() => setContentType("vtuber")}
          className={`${ToClickTW.choice}  mx-2 
                    ${contentType === "vtuber" ? "bg-[#66a962]" : "bg-[#776D5C]"} 
                    `}
        >
          VTuber
        </button>
        <button
          onClick={() => setContentType("movie")}
          className={`${ToClickTW.choice} mx-2
                    ${contentType === "movie" ? "bg-[#66a962]" : "bg-[#776D5C]"}
                    `}
        >
          動画(歌枠)
        </button>
        <button
          onClick={() => setContentType("karaoke")}
          className={`${ToClickTW.choice} mx-2
                    ${contentType === "karaoke" ? "bg-[#66a962]" : "bg-[#776D5C]"}
                    `}
        >
          歌(karaoke)
        </button>
      </div>
    </div>
  )
}
