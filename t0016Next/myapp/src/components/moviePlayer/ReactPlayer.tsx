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
  const src = `https://www.youtube.com/watch?v=${videoId}&start=${start}`;

  return <ReactPlayer src={src} height={style.height} width={style.width} controls autoPlay />;
};
