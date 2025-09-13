import React, { useState, useContext, useMemo } from "react"
import { useTable, usePagination, useSortBy, Column, useRowSelect } from "react-table"
import axios from "axios"
import Link from "next/link"

import { domain } from "@/../env"
import { timeStringToSecondNum, extractVideoId } from "@/util"
import { shuffleArray } from "../SomeFunction"
import { ReceivedKaraoke, FavoriteKaraoke } from "@/types/vtuber_content"
import { ToDeleteContext } from "@/pages/crud/delete"
import { LinkTW, TableCss as TableTW } from "@/styles/tailwiind"
import { useAuth } from "@/providers/AuthProvider"
import Image from "next/image"
import { useHasWindow } from "@/hooks/useHasWindow"
import { toFullYouTubeVideoURL } from "@/util/toFullYouTubeVideoURL/toFullYouTubeVideoURL"
import { useVideo } from "@/providers/VideoProvider"
import { dummyKaraokeArray } from "@/util/dummyData/dummyData"

type KaraokeTableProps = {
  posts: ReceivedKaraoke[]
}

const SelectPostContext = React.createContext(
  {} as {
    setSelectedPost: (arg0: ReceivedKaraoke) => void
  }
)

type FavoriteColumnProps = {
  count: number
  isFav: boolean
  movie: string
  karaoke: number
}

function FavoriteColumn({ count, isFav: initialFav, movie, karaoke }: FavoriteColumnProps) {
  const [isFavorite, setIsFavorite] = useState(initialFav)
  const [isDisplay, setIsDisplay] = useState<boolean>(false)
  const { isSignin } = useAuth()
  const handleClick = async () => {
    if (!isSignin) {
      setIsDisplay(true)
      setTimeout(() => setIsDisplay(false), 1500)
      return
    }

    setIsFavorite(!isFavorite)
    const axiosClient = axios.create({
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    try {
      const reqBody: FavoriteKaraoke = {
        MovieUrl: movie,
        KaraokeId: karaoke,
      }
      if (isFavorite) {
        const response = await axiosClient.delete(`${domain.backendHost}/fav/unfavorite/karaoke`, {
          data: reqBody,
        })
        if (!response.status) {
          throw new Error(response.statusText)
        }
      } else {
        const response = await axiosClient.post(`${domain.backendHost}/fav/favorite/karaoke`, reqBody)
        if (!response.status) {
          throw new Error(response.statusText)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center">
      <button className={TableTW.favoriteColumn} onClick={handleClick}>
        {isFavorite ? (
          <Image src="/content/heart_pink.svg" className="flex w-5 m-1 mr-0" width={24} height={20} alt={""} />
        ) : (
          <Image src="/content/heart_white.svg" className="flex w-5 m-1 mr-0" width={24} height={20} alt={""} />
        )}
        {isFavorite === initialFav ? count : isFavorite ? count + 1 : count - 1}
        {isDisplay && <div className={TableTW.NeedLoginMessage}>ログインが必要です</div>}
      </button>
    </div>
  )
}

///////////////////////////////////////////////////////////////
// /karaoke/sings ページネーション
const PaginationReturnPostColumns: Column<ReceivedKaraoke>[] = [
  { Header: "VTuber", accessor: "VtuberName" },
  {
    Header: "曲名(Click it)",
    accessor: "KaraokeId",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { setSelectedPost } = useContext(SelectPostContext)
      const { updateVideo } = useVideo()
      const handleClickPlay = (post: ReceivedKaraoke) => {
        updateVideo(extractVideoId(row.original.MovieUrl), timeStringToSecondNum(row.original.SingStart))
        setSelectedPost(post)
      }

      const [isDisplay, setIsDisplay] = useState<boolean>(false)
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + timeStringToSecondNum(row.original.SingStart)
        await navigator.clipboard.writeText(url)
        setIsDisplay(true)
        setSelectedPost(row.original)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <div className="relative flex w-auto">
          <button className="flex" onClick={() => handleClickPlay(row.original)}>
            <Image src="/content/play_black.svg" className="w-5 mr-1 bottom-0" width={24} height={20} alt={""} />
            {row.original.SongName}
          </button>

          <span className="absolute right-0">
            <button className="flex " onClick={() => handleClick()}>
              <Image src="/content/copy_gray.svg" className="h-5 mr-2 flex hover:bg-[#B7A692] stroke-2  rounded-md" alt={""} width={18} height={18} />
            </button>
            {isDisplay && <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">URL was copied</div>}
          </span>
        </div>
      )
    },
  },
  { Header: "再生開始", accessor: "SingStart" },
  { Header: "動画タイトル", accessor: "MovieTitle" },
  {
    Header: "いいね",
    accessor: "Count",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} karaoke={row.original.KaraokeId} />
    },
  },
]

type KaraokeTableReturnPostProps = {
  karaokes: ReceivedKaraoke[]
  setSelectedPost: (arg0: ReceivedKaraoke) => void
}

export function KaraokePaginationTable({ karaokes, setSelectedPost }: KaraokeTableReturnPostProps) {
  const maxPageSize = 99999
  const data = useMemo(() => karaokes || dummyKaraokeArray, [karaokes])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: PaginationReturnPostColumns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 25 },
    },
    useSortBy,
    usePagination,
    useRowSelect
  )

  return (
    <SelectPostContext.Provider value={{ setSelectedPost }}>
      <div id="tab" className=" ">
        <div className="flex bg-[#B7A692] mt-1 py-1 px-2 md:px-3 rounded-t-xl md:rounded-t-2xl max-w-[400px] ">
          <button className={`${TableTW.pageNationDouble} md:mx-1`} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button className={`${TableTW.pageNationSingle} sm:mx-0.5 md:mx-1`} onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <span>
            <strong className="sm:mx-0.5 ">
              {pageIndex + 1} / {pageOptions.length}
            </strong>
          </span>
          <button className={`${TableTW.pageNationSingle} sm:mx-1`} onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button className={`${TableTW.pageNationDouble} md:mx-1`} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </button>

          <select className="text-right" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[25, 50, 75, 100, maxPageSize].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
              </option>
            ))}
          </select>
          <span className="mx-0.5 sm:mx-2 ">全{data.length}件</span>
        </div>
      </div>
      <div className="w-full overflow-scroll md:overflow-hidden">
        <table {...getTableProps()} className={`${TableTW.regular}`}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                    {column.render("Header")}
                    <span>{column.isSorted ? column.isSortedDesc ? "🔽" : "🔼" : <Image src="/content/sort.svg" width={24} height={20} alt="Sortable mark" className="inline mx-1 h-5" />}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className={`${TableTW.regularTr}`} key={row.id}>
                  {row.cells.map((cell, i) => (
                    <td {...cell.getCellProps()} key={i}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SelectPostContext.Provider>
  )
}

///////////////////////////////////////////////////
// // top youtube横　カラム少な目→api側未調整（余計なデータがを渡されている状態）
const ThinColumns: Column<ReceivedKaraoke>[] = [
  {
    Header: "VTuber(click it)",
    accessor: "VtuberName",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <span className="relative">
          <Link href={`/vtuber/${row.original.VtuberKana}`} className={`flex ${LinkTW.base}`}>
            <Image src="/content/external_link.svg" className="w-5 mr-1" width={24} height={20} alt="" />
            {row.original.VtuberName}
          </Link>
        </span>
      )
    },
  },
  {
    Header: "曲名(Click it)",
    accessor: "KaraokeId",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { updateVideo } = useVideo()
      const [isDisplay, setIsDisplay] = useState<boolean>(false)
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + timeStringToSecondNum(row.original.SingStart)
        await navigator.clipboard.writeText(url)
        setIsDisplay(true)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <span className="relative flex w-auto">
          <button className={`flex overflow-hidden ${LinkTW.base}`} onClick={() => updateVideo(extractVideoId(row.original.MovieUrl), timeStringToSecondNum(row.original.SingStart))}>
            <Image src="/content/play_black.svg" className="w-5 mr-1 bottom-0 " width={24} height={20} alt={""} />
            {row.original.SongName}
          </button>

          <span className="absolute right-0 ">
            <button onClick={handleClick}>
              <Image src="/content/copy_gray.svg" className="h-5 mr-2 flex hover:bg-[#B7A692] stroke-2  rounded-md" alt={""} width={18} height={18} />
            </button>
            {isDisplay && <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">URL was copied</div>}
          </span>
        </span>
      )
    },
  },
  {
    Header: "いいね",
    accessor: "Count",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} karaoke={row.original.KaraokeId} />
    },
  },
]

export const KaraokeThinTable = ({ posts }: KaraokeTableProps) => {
  const data = posts || ([] as ReceivedKaraoke[])
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns: ThinColumns, data }, useSortBy, useRowSelect)

  return (
    <div className="w-full ">
      <table {...getTableProps()} className={`${TableTW.regular} `}>
        <thead className={`${TableTW.regularThead}`}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-2" key={`karoake_thin_table_header_${i}`}>
                  {column.render("Header")}
                  {column.isSorted ? column.isSortedDesc ? "🔽" : "🔼" : <Image src="/content/sort.svg" width={24} height={20} alt="Sortable mark" className="inline-block w-6 h-5" />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className={`${TableTW.regularTr}`} key={i}>
                {row.cells.map((cell, j) => {
                  return (
                    <td {...cell.getCellProps()} key={j}>
                      {cell.render("Cell")}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

///////////////////////////
//  delete用
export function KaraokeDeleteTable({ posts: karaokes }: KaraokeTableProps) {
  const maxPageSize = 1000
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: deleteColumns,
      data: karaokes,
      initialState: { pageIndex: 0, pageSize: 25 },
    },
    usePagination
  )

  return (
    <>
      <div id="tab" className=" ">
        <div className="flex bg-[#B7A692] mt-1 py-1 px-2 md:px-3 rounded-t-xl md:rounded-t-2xl max-w-[400px] ">
          <button className={`${TableTW.pageNationDouble} md:mx-1`} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button className={`${TableTW.pageNationSingle} mx-1`} onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <span>
            <strong className="sm:mx-0.5 ">
              {pageIndex + 1} / {pageOptions.length}
            </strong>
          </span>
          <button className={`${TableTW.pageNationSingle} mx-1`} onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button className={`${TableTW.pageNationDouble} md:mx-1`} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </button>
          <select className="text-right" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 25, 50, 75, 100, maxPageSize].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full overflow-scroll md:overflow-hidden">
        <table {...getTableProps()} className={`${TableTW.regular} `}>
          <thead className={`${TableTW.regularThead}`}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className={`${TableTW.regularTr}`} key={i}>
                  {row.cells.map((cell, j) => (
                    <td {...cell.getCellProps()} key={j}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

const deleteColumns: Column<ReceivedKaraoke>[] = [
  {
    Header: "VTuber(click it)",
    accessor: "VtuberName",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <span key={row.original.KaraokeId} className="relative">
          <Link href={`/vtuber/${row.original.VtuberKana}`} className={`flex ${LinkTW.base}`}>
            <Image src="/content/external_link.svg" className="w-5 mr-1" width={24} height={20} alt="" />
            {row.original.VtuberName}
          </Link>
        </span>
      )
    },
  },
  {
    Header: "曲",
    accessor: "SongName",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { setCurrentVideoId, setCurrentStart } = useContext(ToDeleteContext)
      const clickHandler = (url: string, SingStart: string) => {
        setCurrentVideoId(extractVideoId(url))
        // setTimeout(() => setCurrentStart(　// youtube iframバグ対策。再発に備えてコメントアウトで残しておく
        timeStringToSecondNum(SingStart)
        // ), 1450);
      }
      return (
        <span className="relative">
          <button className="flex" onClick={() => clickHandler(row.original.MovieUrl, row.original.SingStart)}>
            <Image src="/content/play_black.svg" className="w-5 mr-2" alt={""} width={24} height={20} />
            {row.original.SongName}
          </button>
        </span>
      )
    },
  },
  { Header: "再生開始", accessor: "SingStart" },
  { Header: "歌枠", accessor: "MovieTitle" },
  {
    Header: "削除",
    accessor: "KaraokeId",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { setToDeleteVtuberId, setToDeleteMovieUrl, setToDeleteKaraokeId } = useContext(ToDeleteContext)
      const clickHandler = () => {
        setToDeleteVtuberId(row.original.VtuberId)
        setToDeleteMovieUrl(row.original.MovieUrl)
        setToDeleteKaraokeId(row.original.KaraokeId)
      }
      return (
        <>
          {row.original.KaraokeId != undefined && (
            <button className={`${LinkTW.base}`} onClick={() => clickHandler()}>
              削除
            </button>
          )}
        </>
      )
    },
  },
]

///////////////////////////////////////////////////
// // top youtube横
// 全件取得してフロント側でランダムにしてるけど、バック側でランダム５件+α取得すべき
// (+αはフロント側で完結するランダム更新機能を実装するために必要)

const random5columns: Column<ReceivedKaraoke>[] = [
  {
    Header: "VTuber(click it)",
    accessor: "VtuberName",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <span className="relative">
          <Link href={`/vtuber/${row.original.VtuberKana}`} className={`flex ${LinkTW.base}`}>
            <Image src="/content/external_link.svg" className="w-5 mr-1" width={24} height={20} alt="" />
            {row.original.VtuberName}
          </Link>
        </span>
      )
    },
  },
  {
    Header: "曲名(Click it)",
    accessor: "KaraokeId",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const [isDisplay, setIsDisplay] = useState<boolean>(false)
      const { updateVideo } = useVideo()
      const playSong = (post: ReceivedKaraoke) => {
        updateVideo(extractVideoId(post.MovieUrl), timeStringToSecondNum(post.SingStart))
      }

      const clipUrl = async () => {
        await navigator.clipboard.writeText(toFullYouTubeVideoURL(row.original.MovieUrl, row.original.SingStart))
        setIsDisplay(true)
        setTimeout(() => setIsDisplay(false), 2000)
      }
      return (
        <div className="relative flex">
          <div className="flex flex-row">
            <button className="flex" onClick={() => playSong(row.original)}>
              <Image src="/content/play_black.svg" className="w-5 mr-1 " alt={""} width={24} height={20} />
              {row.original.SongName}
            </button>
          </div>
          <div className="flex flex-row">
            <button className="absolute right-0" onClick={clipUrl}>
              <Image src="/content/copy_gray.svg" className="h-5 mr-2 flex hover:bg-[#B7A692] stroke-2  rounded-md" alt={""} width={18} height={18} />
            </button>
            {isDisplay && <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">URL was copied</div>}
          </div>
        </div>
      )
    },
  },
  { Header: "再生開始", accessor: "SingStart" },
  {
    Header: "いいね",
    accessor: "Count",
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} karaoke={row.original.KaraokeId} />
    },
  },
]

export const KaraokeMinRandomTable = ({ posts: karaokes }: KaraokeTableProps) => {
  const hasWindow = useHasWindow()
  const shuffledData = useMemo(() => shuffleArray(karaokes, 5), [karaokes])
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    {
      columns: random5columns,
      data: shuffledData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  )

  return (
    <>
      {hasWindow && (
        <div>
          <div className="flex ml-5">
            <h2 className="flex mr-1">ランダム5件表示中 (全{karaokes.length}件)</h2>
          </div>
          <div className="w-full overflow-scroll md:overflow-hidden">
            <table {...getTableProps()} className={`${TableTW.minRandom}`}>
              <thead className={`${TableTW.regularThead}`}>
                {headerGroups.map((headerGroup, hI) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={hI}>
                    {headerGroup.headers.map((column, cI) => (
                      <th {...column.getHeaderProps()} key={cI}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, rI) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} className={TableTW.regularTr} key={rI}>
                      {row.cells.map((cell, cI) => (
                        <td {...cell.getCellProps()} key={cI}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
