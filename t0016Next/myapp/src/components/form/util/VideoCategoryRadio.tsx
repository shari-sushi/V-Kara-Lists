import type { VideoCategory } from "@/types/vtuber_content"
import { MULTI_SONG_CATEGORIES, VIDEO_CATEGORY_LABELS } from "@/util"

type VideoCategoryRadioProps = {
  name: string
  value: VideoCategory
  onChange: (category: VideoCategory) => void
}

// 登録・編集フォームで選べる動画の種類(歌枠・ライブ)。
// オリ曲・歌ってみたは1動画1曲で入力の形が違うため、ここには出さない。
export const VideoCategoryRadio = ({ name, value, onChange }: VideoCategoryRadioProps) => {
  return (
    <div className="flex gap-x-4 text-black">
      {MULTI_SONG_CATEGORIES.map((category) => (
        <label key={category} className="flex items-center cursor-pointer">
          <input className="mr-1" type="radio" name={name} value={category} checked={value === category} onChange={() => onChange(category)} />
          {VIDEO_CATEGORY_LABELS[category]}
        </label>
      ))}
    </div>
  )
}
