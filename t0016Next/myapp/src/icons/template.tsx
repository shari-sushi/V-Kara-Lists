import { IconBaseProps } from "./types";

export const Icon = ({ height, width, fill = "white", className }: IconBaseProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill} className={className}>
      {/* ここにpath要素を入れる */}
    </svg>
  );
};
