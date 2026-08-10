import { useVideo } from "@/providers/VideoProvider"
import { ToggleVideoPositionButton } from "../button/ToggleVideoPositionButton"

// NOTE: PC(md以上)でページ遷移後も再生中の動画を操作できるよう、footerプレイヤーの隣に常設するコントローラー
export const VideoController = () => {
  const { videoState, setIsPlaying } = useVideo()
  const isPlaying = videoState.isPlaying ?? true

  return (
    <div className="hidden md:flex items-center gap-3 absolute left-full bottom-0 h-8 px-2 whitespace-nowrap rounded-r bg-[#657261] text-white text-xs">
      <button onClick={() => setIsPlaying(!isPlaying)} className="hover:opacity-70">
        {isPlaying ? "一時停止" : "再生"}
      </button>
      <ToggleVideoPositionButton textSize="text-xs" />
    </div>
  )
}
