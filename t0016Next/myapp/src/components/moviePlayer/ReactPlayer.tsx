import { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface YoutubePlayerProps {
  videoId: string;
  start: number;
  style: {
    height: number;
    width: number;
  };
}

export const YoutubePlayer = ({ videoId, start, style }: YoutubePlayerProps) => {
  return (
    // TODO: startが変わるたびに動画が再読み込みになってしまうので、正規の方法を探す
    //       startが同じなら無反応になるし
    <div key={`${videoId}_${start}`}>
      <ReactPlayer
        src={`https://www.youtube.com/watch?v=${videoId}`}
        height={style.height}
        width={style.width}
        controls
        playing
        config={{
          youtube: {
            start: start,
          },
        }}
      />
    </div>
  );
};
