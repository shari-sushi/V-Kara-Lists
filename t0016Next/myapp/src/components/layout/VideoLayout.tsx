import { FOOTER_POSITION, useVideo } from "@/providers/VideoProvider"
import { VKaraVideoPlayer } from "./VKaraVideoPlayer"
import { VideoController } from "./VideoController"

export const VideoLayout = () => {
  const { videoState } = useVideo()
  const isAbsolute = videoState.position === "in-content"
  const hasVideo = videoState.youtubeId !== ""

  return (
    <div>
      {/* TODO: playerの位置をaltBoxに重ねられるようになったらisAbsoluteの時にabsoluteにする */}
      <div id="vkaraoke-player" className={`${isAbsolute ? "hidden" : "fixed"} z-30`} style={{ ...FOOTER_POSITION }}>
        <VKaraVideoPlayer />
        {hasVideo && !isAbsolute && <VideoController />}
      </div>
    </div>
  )
}
