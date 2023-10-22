import type { AllJoinData, Vtuber, VtuberMovie } from '../types/singdata'; //type{}で型情報のみインポート



export const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
    <label style={{ marginRight: '1em' }}>
      <input type="checkbox" {...props} />
      {children}
    </label>
  );
  

export function generateRandomNumber(max:number) {
    return Math.floor(Math.random() * max-1 ) + 1
  }

export function shuffleArray(array:AllJoinData[]) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); //ランダムな数値jを生成
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled; //結果として、受け取った配列の中身をぐちゃぐちゃに入れ替えたものを返す
  }