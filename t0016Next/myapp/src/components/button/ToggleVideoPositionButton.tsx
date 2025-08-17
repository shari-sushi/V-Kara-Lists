import { useVideo } from "@/providers/VideoProvider";

export const ToggleVideoPositionButton = ({ textSize }: { textSize?: string }) => {
  const { videoState, togglePosition } = useVideo();

  // NOTE: デザイン模索中
  // 本物のトグルならこっち
  const text = "動画を固定";
  return (
    <div className="flex h-full items-center">
      <span className={`${textSize ?? "text-xs"}`}>{text}</span>
      <label className="flex h-full items-center">
        <input type="checkbox" checked={videoState.position === "footer"} className="peer sr-only" onChange={() => togglePosition()} />
        <span
          className="inline-block w-[2em] cursor-pointer bg-gray-500 rounded-full p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full
                   after:bg-white after:transition peer-checked:bg-[#66a962] peer-checked:after:translate-x-[calc(100%-2px)]"
        ></span>
      </label>
    </div>
  );

  // 色が変わるだけのボタンはこっち
  // const videoPosition = videoState.position === "footer" ? "再生場所：下" : "再生場所：中";
  // return (
  //   <div
  //     className={`flex justify-center items-center h-6 px-1 rounded-md select-none cursor-pointer ${videoState.position === "footer" ? "bg-[#66a962]" : "bg-[#66a962]/60"}`}
  //     onClick={() => togglePosition()}
  //   >
  //     <span className="text-xs">{videoPosition}</span>
  //   </div>
  // );
};
