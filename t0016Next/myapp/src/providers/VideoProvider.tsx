import React, { createContext, useContext, useState, ReactNode } from "react";

type VideoState = {
  youtubeId: string;
  startTime: number;
  isPlaying?: boolean;
};

type VideoContextType = {
  videoState: VideoState;
  updateVideo: (url: string, startTime?: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

type VideoProviderProps = {
  children: ReactNode;
};

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const [videoState, setVideoState] = useState<VideoState>({
    youtubeId: "",
    startTime: 0,
    isPlaying: true,
  });

  const updateVideo = (url: string, startTime = 0) => {
    console.log("updateVideo", url, startTime);
    setVideoState((prev) => ({
      ...prev,
      youtubeId: url,
      startTime: startTime,
      isPlaying: true,
    }));
  };

  const setCurrentTime = (time: number) => {
    setVideoState((prev) => ({ ...prev, startTime: time }));
  };

  const setIsPlaying = (playing: boolean) => {
    setVideoState((prev) => ({ ...prev, isPlaying: playing }));
  };

  return (
    <VideoContext.Provider
      value={{
        videoState,
        updateVideo,
        setCurrentTime,
        setIsPlaying,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (initialState?: VideoState) => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }

  if (initialState != null) {
    if (context.videoState.youtubeId === "") {
      context.videoState = initialState;
      // NOTE: メモ代わり　これは忘れたくないので
      // 【オフコラボ】#VTuberカラオケ女子会 ～ノイタミナアニメ縛り～【朝ノ瑠璃／久遠たま／柾花音／ChumuNote】
      // "www.youtube.com/watch?v=E7x2TZ1_Ys4";
      //  (柾花音) Departures 〜あなたにおくるアイの歌〜 / EGOIST / TVアニメ『ギルティクラウン』ED
      // 36 * 60 + 41;
    }
  }

  return context;
};
