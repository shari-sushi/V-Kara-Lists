import { FOOTER_POSITION, useVideo } from "../../providers/VideoProvider"
import { YoutubePlayer } from "../moviePlayer/ReactPlayer"

export const VKaraVideoPlayer = () => {
  const { videoState } = useVideo()

  // TODO: nullではなく、常にplaerを返すようにして、座標を変えるようにする
  if (videoState.position !== "footer") {
    return null
  }

  // NOTE: 開発時に使うダミー。頻繁にレンダリングするとyoutubeにbot扱いされてブロックされるため。
  // return <div style={{ height: 200, width: 356 }} className="bg-green-900" />;
  return <YoutubePlayer videoId={videoState.youtubeId} start={videoState.startTime} style={{ ...FOOTER_POSITION }} />
}
