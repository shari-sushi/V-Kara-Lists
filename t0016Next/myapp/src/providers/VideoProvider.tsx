import React, { createContext, useContext, useState, ReactNode, useRef } from "react"

type VideoContextType = {
  videoState: VideoState
  updateVideo: (url: string, startTime?: number) => void
  setCurrentTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  togglePosition: () => void
  changePosition: (position: Position) => void
}

type VideoState = {
  youtubeId: string
  startTime: number
  isPlaying?: boolean
  position: Position
  // TODO: VideoPlayerAltBox から位置情報を受け取れるようにする
  // style: VideoCoordinateStyle;
}

type Position = "in-content" | "footer"

type VideoCoordinateStyle = {
  left: number
  bottom: number
  height: number
  width: number
}

type VideoProviderProps = {
  children: ReactNode
}

export const FOOTER_POSITION: VideoCoordinateStyle = {
  bottom: 0,
  left: 0,
  height: 200,
  width: 356, // 9:16 のアスペクト比
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const [videoState, setVideoState] = useState<VideoState>({
    youtubeId: "",
    startTime: 0,
    isPlaying: true,
    position: "in-content",
  })

  const updateVideo = (url: string, startTime = 0) => {
    setVideoState((prev) => ({
      ...prev,
      youtubeId: url,
      startTime: startTime,
      isPlaying: true,
    }))
  }

  const setCurrentTime = (time: number) => {
    setVideoState((prev) => ({ ...prev, startTime: time }))
  }

  const setIsPlaying = (playing: boolean) => {
    setVideoState((prev) => ({ ...prev, isPlaying: playing }))
  }

  const togglePosition = () => {
    setVideoState((prev) => {
      // in-content → footer に切り替える前に現在位置を取得
      if (prev.position === "in-content") {
        return {
          ...prev,
          isPlaying: true,
          position: "footer",
        }
      }

      // footer → in-content に切り替え
      return {
        ...prev,
        isPlaying: true,
        position: "in-content",
      }
    })
  }

  const changePosition = (position: Position) => {
    setVideoState((prev) => ({ ...prev, position }))
  }

  return (
    <VideoContext.Provider
      value={{
        videoState: videoState,
        updateVideo: updateVideo,
        setCurrentTime: setCurrentTime,
        setIsPlaying: setIsPlaying,
        togglePosition: togglePosition,
        changePosition: changePosition,
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}

export const useVideo = (initialState?: Pick<VideoState, "youtubeId" | "startTime" | "isPlaying">): VideoContextType => {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider")
  }

  if (context.videoState.youtubeId === "") {
    if (initialState != null) {
      context.updateVideo(initialState.youtubeId, initialState.startTime)
    }
  }

  return context
}

// NOTE: 備忘録
// 【オフコラボ】#VTuberカラオケ女子会 ～ノイタミナアニメ縛り～【朝ノ瑠璃／久遠たま／柾花音／ChumuNote】
// "www.youtube.com/watch?v=E7x2TZ1_Ys4";
//  (柾花音) Departures 〜あなたにおくるアイの歌〜 / EGOIST / TVアニメ『ギルティクラウン』ED
// 36 * 60 + 41;
