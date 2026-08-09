import { FOOTER_POSITION, useVideo } from "@/providers/VideoProvider"
import { VKaraVideoPlayer } from "./VKaraVideoPlayer"

export const VideoLayout = () => {
  const { videoState } = useVideo()
  const isAbsolute = videoState.position === "in-content"

  return (
    <div>
      {/* TODO: playerの位置をaltBoxに重ねられるようになったらisAbsoluteの時にabsoluteにする */}
      <div id="vkaraoke-player" className={`${isAbsolute ? "hidden" : "fixed"} z-30`} style={{ ...FOOTER_POSITION }}>
        <VKaraVideoPlayer />
      </div>
      {/* TODO: 動画のコントローラーをここに配置 */}
      {/* <VideoController /> */}
    </div>
  )
}
