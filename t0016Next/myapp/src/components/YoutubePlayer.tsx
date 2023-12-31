import React from 'react';
import YouTube from 'react-youtube';
// import '../Youtube.module.css';

type YouTubePlayerProps = {
  videoId: string;
  start: number;
}

interface YouTubePlayerState {
  player: any;
}

export class YouTubePlayer extends React.Component<YouTubePlayerProps, YouTubePlayerState> {
  private playerRef: React.RefObject<YouTube>;
  constructor(props: YouTubePlayerProps) {
    super(props);
    this.state = {
      player: null,
    };
    this.playerRef = React.createRef();
  }

  // renderメソッドよりも後で呼び出される
  componentDidMount() {
    if (this.state.player && this.props.start) {
      this.state.player.playVideo();
      // ↓(動画指定と同時になるので)効果なし。機能しないの意味わからん
      this.state.player.seekTo(this.props.start);
    }
    // this.state.player.event.onReady()
  }

  // renderメソッドよりも後で呼び出される
  componentDidUpdate(prevProps: YouTubePlayerProps) {
    console.log("prevProps", prevProps)
    if (prevProps.start !== this.props.start) {
      this.changeTime(this.props.start); //必須
    }
    // ↓エラーなるのなんで… // changeTime の中身でエラー
    // 
    // else {
    // this.changeTime(this.props.start + 1);
    // this.changeTime(this.props.start); 
    // }

    // 機能するどころか(なんの挙動も示さないくせに)、
    // ２つの動画を瞬時に1→2→1のように遷移させるとエラーとなる
    // if (prevProps.videoId !== this.props.videoId) {
    // this.state.player.playVideo();
    // this.state.player.seekTo(this.props.start);

    // ↓(動画指定と同時では)効果なし(両方)
    // this.changeTime(0);
    // this.state.player.seekTo(0);
    // }
  }

  // この状態で、onRaedyそのものをコメントアウトすると時間セットできなくなる謎
  onReady = (event: { target: any }) => {
    this.setState({
      player: event.target,
    });
    // event.target.playVideo();
    event.target.seekTo(this.props.start);

    // (動画指定と同時では)↓効果なし
    // ↓効果なし
    // event.target.seekTo(0);
  };

  changeTime = (start: number) => {
    console.log('seeking to: ' + start);
    if (this.state.player) {
      this.state.player.playVideo();
      this.state.player.seekTo(start); //必須

      // ↓(動画指定と同時では)効果なし
      // this.state.player.seekTo(0);
    }
  };

  render() {
    const { videoId } = this.props;
    const { start: start } = this.props;
    // console.log("this.props", this.props)
    const opts: any = {
      width: '560',
      height: '315',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1, //自動再生に必須だが、これだけだとダメな時もある様子…。
        // start: start, //これがあると時間が上書きされる(seekToが機能しない)
        controls: 1,
      },
      // startSeconds:start, //これも効果なし
    };

    return (
      <div>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={this.onReady}
          ref={this.playerRef}
        />
      </div>
    );
  }
}

////////////////////////////////////// 本来あるべき姿(バグなのか動かない) //////////////////////////////////
// type Options = React.ComponentProps<typeof YouTube>['opts'];

// type YoutubePlayerProps = {
//   videoId: string;
//   start?: number;
//   opts?: Options;
//   onReady?: (event: { target: YT.Player }) => void;
// };

// const onPlayerReady = (event: { target: YT.Player }) => {
//   // access to player in all event handlers via event.target
//   event.target.pauseVideo();
// }

// // 単一動画を再生
// export const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId, start, opts = {
//   // width: 1920,  height: 1080,
//   width: 450, height: 253,
//   // width: 640,  height: 360,
//   playerVars: {
//     autoplay: 1,
//     start: start,
//     playsinline: 1,
//     // mute: 1,
//     loop: 1,
//     // end:,
//   },
// },
//   onReady = onPlayerReady }) => {
//   return <YouTube videoId={videoId} opts={opts} onReady={onReady} />;
// };