import YouTube from 'react-youtube';
// import '../Youtube.module.css';

type Options = React.ComponentProps<typeof YouTube>['opts'];

type YoutubePlayerProps = {
  videoId: string;
  start?: number;
  opts?: Options;
  onReady?: (event: { target: YT.Player }) => void;
};

const onPlayerReady = (event: { target: YT.Player }) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId, start, opts = {
    height: 254,
    width: 450,
    playerVars: {
      autoplay: 1,
      start: start,
      playsinline: 1,       
      mute: 1,              
      loop: 1, 
    },
  },
  onReady = onPlayerReady }) => {
  return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
};

export default YoutubePlayer;