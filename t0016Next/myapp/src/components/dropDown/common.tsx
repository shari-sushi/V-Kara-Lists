import type { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from '@/types/vtuber_content';

export const DropStyle = ({
  container: (base: any) => ({
    ...base,
    width: '300px'
  }),
  control: (base: any) => ({ //controlでholder、optionで選択肢の文字サイズを指定
    ...base,
    fontSize: '12px'  // ここで文字サイズを指定

  }),
}
)

export type TopPagePosts = {
  vtubers: ReceivedVtuber[];
  vtubers_movies: ReceivedMovie[];
  vtubers_movies_karaokes: ReceivedKaraoke[];
};
