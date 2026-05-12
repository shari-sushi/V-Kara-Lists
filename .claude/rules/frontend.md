# フロントエンド ルール (Next.js / TypeScript)

## スタック

- **フレームワーク**: Next.js 13.5.6 (Pages Router)
- **言語**: TypeScript 5.1.6
- **スタイリング**: Tailwind CSS + Emotion + MUI 5
- **テーブル**: TanStack Table v8
- **フォーム**: React Hook Form
- **HTTPクライアント**: Axios
- **動画**: React YouTube / React Player

## ディレクトリ構成と責務

```txt
src/
├── pages/          # ルーティング単位のページ。ロジックは極力持たない
├── components/     # 再利用可能なUIコンポーネント
├── features/       # 特定機能に閉じたコンポーネント・ロジック
├── hooks/          # カスタムフック（データ取得・状態管理）
├── api/            # Axios を使った API 呼び出し関数
├── types/          # TypeScript 型定義
├── styles/         # グローバルCSS・Tailwind クラス定数
└── util/           # 汎用ユーティリティ関数
```

## import ルール

必ず `@/` エイリアスを使う（相対パスは使わない）:

```typescript
// Good
import { Layout } from "@/components/layout/Layout";
import type { ReceivedKaraoke } from "@/types/vtuber_content";
import { fetchVtuberList } from "@/api/vtuber";

// Bad
import { Layout } from "../../components/layout/Layout";
```

## コンポーネント設計

- コンポーネントは Named Export で書く
- `pages/` のファイルは default export（Next.js の要件）
- Props の型は同ファイル内に定義する（小さければ）か `types/` に置く
- MUI コンポーネントに Tailwind を混在させる場合は、MUI の `sx` prop か `className` で統一する

```typescript
// Good: Named export
export const VtuberTable = ({ vtubers }: VtuberTableProps) => {
  // ...
};

// pages/ のみ default export
export default function IndexPage() {
  // ...
}
```

## データ取得

- API 呼び出しは `src/api/` に集約する
- `getServerSideProps` / `getStaticProps` でのデータ取得はページコンポーネントに書く
- クライアントサイドのデータ取得は `hooks/` にカスタムフックとして切り出す

```typescript
// src/api/vtuber.ts
export const fetchVtuberList = async (): Promise<ReceivedVtuber[]> => {
  const res = await axios.get(`${domain}/v1/vcontents/`);
  return res.data.vtubers;
};
```

## 型定義

- API レスポンスの型は `src/types/vtuber_content.ts` に定義する
- `Received*` プレフィックスで API から受け取る型を表す（既存の命名に合わせる）
- `any` 型は禁止。型が不明な場合は `unknown` を使う

## スタイリング

- ユーティリティクラスは `src/styles/tailwiind.ts`（既存ファイル）に定数として定義する
- MUI コンポーネントのカスタマイズは `sx` prop を使う
- グローバルスタイルは `styles/globals.css` に書く

## Pages Router の注意事項

- `src/pages/api/` は Next.js の API Routes だが、このプロジェクトでは Go バックエンドを使うため基本的に使わない
- 動的ルーティングは `[param].tsx` 形式
- `_app.tsx` でグローバルな Provider を設定している

## 完了確認

```bash
cd t0016Next/myapp
npm run build   # 型エラーがないこと
npm run lint    # lint エラーがないこと
```
