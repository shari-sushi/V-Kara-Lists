import { getWindowSize } from "@/features/layout/Layout";
import { useHasWindow } from "@/hooks/useHasWindow";

export const ASPECT_RATIO = 9 / 16;
export type VideoPlayerSizeLevel = number | "min" | "normal" | "max";

export const useCalcVideoPlayerSize = (sizeLevel: VideoPlayerSizeLevel) => {
  // https://developers.google.com/youtube/player_parameters?hl=ja
  // > 埋め込みプレーヤーには少なくとも 200×200 px のビューポートが必要
  let height = 200;
  let width = Math.round(height / ASPECT_RATIO);

  const hasWindow = useHasWindow();
  if (hasWindow == null) {
    return { width, height };
  }

  const { height: windowWHeight, width: windowWidth } = getWindowSize();
  const isHorizontally = windowWidth > windowWHeight;

  if (sizeLevel !== "min") {
    // NOTE: スマホを想定しているが、PC向けにもちゃんと対応できてる…はず
    if (isHorizontally) {
      if (windowWidth > 950) {
        height = 255;
        width = Math.round(height / ASPECT_RATIO);
      } else {
        width = Math.round(windowWidth / 2);
        height = Math.round((windowWidth / 2) * ASPECT_RATIO);
      }
    }

    if (!isHorizontally) {
      if (windowWidth >= 950) {
        height = 255;
        width = Math.round(height / ASPECT_RATIO);
      } else if (windowWidth > 500) {
        width = Math.round(windowWidth * 0.48);
        height = Math.round(windowWidth * 0.48 * ASPECT_RATIO);
      } else {
        width = Math.round(windowWHeight * 0.48);
        height = Math.round(windowWHeight * 0.48 * ASPECT_RATIO);
      }
    }
  }

  return { width, height, hasWindow };
};
