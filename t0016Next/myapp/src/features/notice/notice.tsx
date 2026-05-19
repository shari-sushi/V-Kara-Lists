import { ToggleVideoPositionButton } from "@/components/button/ToggleVideoPositionButton"
import Link from "next/link"
import { useState } from "react"
import { useNotice } from "@/providers/NoticeProvider"

export const TopPageNotice = () => {
  const { isDisplay, setIsDisplay } = useNotice()

  const [isHoverButton, setIsHoverButton] = useState(false)

  return (
    <div className="flex flex-col items-center max-w-[1000px] m-auto mb-2">
      <div className={`flex flex-col p-1 rounded-md ${isHoverButton ? "bg-[#66a962]/40" : ""}`}>
        <div className="flex items-start cursor-pointer" onClick={() => setIsDisplay(true)} onMouseEnter={() => setIsHoverButton(true)} onMouseLeave={() => setIsHoverButton(false)}>
          <div>〇お知らせ</div>
          <div className="flex text-xs justify-center rounded-md h-[15px] w-[15px] m-0.5 bg-[#776D5C]">？</div>
        </div>
        <ul
          className="list-disc ml-[18.5px] flex flex-col justify-start cursor-pointer"
          onClick={() => setIsDisplay(true)}
          onMouseEnter={() => setIsHoverButton(true)}
          onMouseLeave={() => setIsHoverButton(false)}
        >
          <li>{NoticeItems[0].title}</li>
          <li>{NoticeItems[1].title}</li>
        </ul>
      </div>

      {isDisplay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="h-full w-full bg-black opacity-50" onClick={() => setIsDisplay(false)} />
          <div
            className="absolute z-30 md:top-[150px] items-center min-w-[300px] md:min-w-[600px] md:max-w-3xl w-[90%] py-2 px-4 flex flex-col gap-y-1
          bg-[#B7A692] rounded-2xl shadow-lg shadow-black"
          >
            <div className="w-32 self-start text-center rounded-t-md font-bold bg-[#776D5C]">お知らせ全件</div>
            <div className="flex flex-col overflow-y-auto h-96 gap-y-1 text-black w-full">
              {NoticeItems.map((item) => (
                <div key={item.data} className="flex rounded-md px-1 bg-[#FFF6E4]">
                  <div className="w-24 flex-shrink-0">{item.data} :</div>
                  <div>{item.content}</div>
                </div>
              ))}
            </div>
            <div
              className={`flex justify-center items-center w-[40%] h-10 rounded-md p-1 bg-[#776D5C] text-white font-semibold shadow-sm shadow-black hover:shadow-inner hover:shadow-[#FFF6E4]`}
              onClick={() => {
                setIsDisplay(false)
              }}
            >
              閉じる
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const NoticeLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="font-bold hover:opacity-50 hover:underline">
      {children}
    </Link>
  )
}

type NoticeItem = {
  data: string
  title?: React.ReactNode
  content?: React.ReactNode
}

const NoticeItems: NoticeItem[] = [
  ...(new Date() >= new Date("2027-05-30")
    ? [
        {
          data: "2027-05-30",
          title: "5/30「妹望おいも」5歳の誕生日",
          content: (
            <>
              <NoticeLink href="https://x.com/i_mo_5">「妹望おいも」</NoticeLink>
              5歳の誕生日
            </>
          ),
        } as NoticeItem,
      ]
    : []),
  ...(new Date() >= new Date("2026-05-30")
    ? [
        {
          data: "2026-05-30",
          title: "5/30「妹望おいも」4歳の誕生日",
          content: (
            <>
              <NoticeLink href="https://x.com/i_mo_5">「妹望おいも」</NoticeLink>
              4歳の誕生日
            </>
          ),
        } as NoticeItem,
      ]
    : []),
  {
    data: "2026-05-19",
    title: "ヘッダー・メニューのUI改善",
    content: (
      <>
        <div>ハンバーガーメニューボタンが常に表示されるようになりました。</div>
        <div>ハンバーガーメニュー、お知らせメニュー表示中は背後がスクロールされないようになりました。</div>
      </>
    ),
  },
  {
    data: "2026-01-18",
    title: "曲の複数登録が可能に",
    content: (
      <div className="">
        <NoticeLink href="/crud/create">「データ登録」</NoticeLink>の歌(karaoke)にて、複数同時に登録できるようになりました。
      </div>
    ),
  },
  {
    data: "2025-08-19",
    title: "ページ移動後も再生動画が維持されるように",
    content: (
      <div className="">
        YouTubeプレイヤーを画面下に固定できるようになりました。固定状態ではページを移動しても動画の再生が維持されます。
        <s>ヘッダーの「再生場所」ボタン で切り替えられます。</s>
        <span className="text-sm text-gray-400 ml-1">(2026/05/19修正)</span>
        <div className="flex items-center m-1 w-fit">
          「<ToggleVideoPositionButton />」
        </div>
      </div>
    ),
  },
  {
    data: "2025-05-30",
    title: "5/30「妹望おいも」3歳の誕生日",
    content: (
      <>
        <NoticeLink href="https://x.com/i_mo_5">「妹望おいも」</NoticeLink>
        3歳の誕生日
      </>
    ),
  },
  {
    data: "2024-01-14",
    content: (
      <>
        <NoticeLink href="/crud/create">「データ登録」</NoticeLink>
        ページの動画登録にて、
        <ul className="list-disc ml-6">
          <li>URLの入力が簡単に</li>
          <li>URLで動画タイトルを取得できるように</li>
        </ul>
      </>
    ),
  },
  {
    data: "2024-12-15",
    content: "TOPページ : 自動再生される曲が「最近登録された50曲」から選択されるように",
  },
  {
    data: "2024-12-14",
    content: (
      <div className="inline">
        {"全体 : "}
        <span className="underline font-bold">表のクリックできる場所</span>
        (VTuber名や曲名 urlコピーアイコン
        <svg xmlns="http://www.w3.org/2000/svg" height={14} width={14} viewBox="0 0 512 512" className={"inline fill-[#B7A692] stroke-"}>
          <rect x="115.774" y="335.487" width="194.387" height="18.588"></rect>
          <rect x="115.774" y="260.208" width="194.387" height="18.527"></rect>
          <rect x="115.774" y="184.862" width="194.387" height="18.588"></rect>
          <path
            className=""
            d="M385.112,396.188V39.614c0-2.294-0.197-4.603-0.592-6.768C381.3,14.19,365.006,0,345.438,0H184.686 c-11.561,0-22.598,4.603-30.741,12.747L53.637,112.986c-8.151,8.22-12.747,19.249-12.747,30.818v252.384 c0,21.802,17.806,39.607,39.683,39.607h264.864C367.308,435.795,385.112,417.99,385.112,396.188z M170.634,27.529v89.074 c0,9.662-3.745,13.399-13.339,13.399H68.222L170.634,27.529z M63.163,396.188V149.775h106.02c3.486,0,6.768-0.85,9.655-2.362 		c4.079-2.036,7.361-5.324,9.328-9.328c1.519-2.894,2.302-6.115,2.302-9.526V22.272h154.97c7.156,0,13.331,4.33,15.959,10.574 c0.92,2.104,1.376,4.337,1.376,6.768v356.574c0,9.518-7.748,17.342-17.335,17.342H80.574 C70.98,413.53,63.163,405.706,63.163,396.188z"
          ></path>
          <path d="M431.488,76.205h-26.732l1.375,22.272h25.356c9.594,0,17.349,7.748,17.349,17.342v356.573 c0,9.519-7.755,17.342-17.349,17.342H166.562c-7.163,0-13.339-4.406-15.968-10.581c-0.85-2.097-1.374-4.33-1.374-6.761V456.89	h-22.272v15.503c0,2.294,0.198,4.589,0.593,6.761c3.22,18.588,19.515,32.846,39.022,32.846h264.926 c21.877,0,39.622-17.805,39.622-39.607V115.82C471.11,93.943,453.365,76.205,431.488,76.205z"></path>
        </svg>
        等) にカーソルを合わせると
        <span className="font-bold">太字</span>や<span className="underline">下線</span>を表示
      </div>
    ),
  },
  {
    data: "2024-11-23",
    content: (
      <>
        <NoticeLink href="/crud/create">「登録」 </NoticeLink>
        <NoticeLink href="/crud/edit">「編集」 </NoticeLink>
        で１文字の曲名に対応
      </>
    ),
  },
  {
    data: "2024-11-05",
    content: "お知らせ表示方法の変更 : 「？」をクリックで全件表示",
  },
  {
    data: "2024-10-22",
    content: "10/20～10/22におけるサイトが不安定な問題の解決",
  },
  {
    data: "2024-10-18",
    content: (
      <>
        <NoticeLink href="/user/signin">「ログイン」</NoticeLink>
        ページのデザインとエラー表示の改善、ログインできない不具合の修正
      </>
    ),
  },
  {
    data: "2024-06-03",
    content: (
      <>
        <NoticeLink href="/sings/karaoke">「カラオケ」</NoticeLink>
        ページの検索機能を強化
      </>
    ),
  },
  {
    data: "2024-05-30",
    title: "5/30「妹望おいも」2歳の誕生日",
    content: (
      <>
        <NoticeLink href="https://x.com/i_mo_5">「妹望おいも」</NoticeLink>
        2歳の誕生日
      </>
    ),
  },
]
