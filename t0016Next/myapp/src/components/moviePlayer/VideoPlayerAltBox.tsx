import { useCalcVideoPlayerSize } from "@/hooks/useCalcVideoPlayerSize";
import { useVideo } from "@/providers/VideoProvider";
import { RefObject, useRef } from "react";

interface VideoPlayerAltBoxProps {
  sizeLevel: number | "min" | "max";
}

// TODO: 今は使ってない(実装も中途半端)。player側の実装を終えたら実装を再開する。
// NOTE: 各ページに１つしか配置できない処理になっているので１つまでにすること
export const VideoPlayerAltBox = ({ sizeLevel }: VideoPlayerAltBoxProps) => {
  // TODO: react19にしたら<HTMLVideoElement>(null!)に差し替える
  const videoRef = useRef<HTMLDivElement>(null!);

  return (
    <div ref={videoRef}>
      <Component videoRef={videoRef} sizeLevel={sizeLevel} />
    </div>
  );
};

interface ComponentProps {
  sizeLevel: number | "min" | "max";
  videoRef: RefObject<HTMLDivElement>;
}

const Component = ({ videoRef, sizeLevel }: ComponentProps) => {
  const { videoState } = useVideo();
  const { height, width, hasWindow } = useCalcVideoPlayerSize(sizeLevel);

  const isHidden = !hasWindow || videoState.position === "footer";

  return <div className={`bg-black ${isHidden ? "hidden" : ""}`} style={{ height, width }} ref={videoRef} />;
};

// TODO: 要検討。AltBoxの位置をvideoPlayerに伝える必要がある。
// useEffect(() => {
//   // NOTE: 最初はページのコンテンツ内にある
//   const initialPosition = getElementPosition(videoRef);
//   // 初期位置をVideoProviderに設定
//   console.log(initialPosition);
//   setCoordinateStyle(initialPosition);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

// useEffect(() => {
//   const getPosition = () => getElementPosition(videoRef);
//   registerPositionGetter(getPosition);

//   return () => unregisterPositionGetter();
// }, [registerPositionGetter, unregisterPositionGetter, videoRef]);
