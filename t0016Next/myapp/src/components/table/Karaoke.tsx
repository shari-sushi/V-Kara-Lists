import React, { useState, useEffect, useContext } from "react";
import { useTable, usePagination, useSortBy, Column, useRowSelect } from "react-table";
import axios from 'axios';

import { domain } from '@/../env'
import { ConvertStringToTime, ExtractVideoId } from '../Conversion'
import { shuffleArray } from '../SomeFunction'
import { ReceivedKaraoke, FavoriteKaraoke } from "@/types/vtuber_content";
import { ToDeleteContext } from '@/pages/crud/delete'
import { TableCss } from '@/styles/tailwiind'
import { ToClickTW } from '@/styles/tailwiind'
import { SigninContext } from '@/components/layout/Layout'

type KaraokeTableProps = {
  posts: ReceivedKaraoke[];
  handleMovieClickYouTube: (arg0: string, arg1: number) => void;
};

export const YouTubePlayerContext = React.createContext({} as {
  handleMovieClickYouTube(movieId: string, time: number): void;
})

/////////////////////////////////////////////////////////////////
// 使ってないわ　でもこれが標準…
export function KaraokeTable({ posts, handleMovieClickYouTube }: KaraokeTableProps) {
  const data = posts || {}
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy, useRowSelect);

  return (
    <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
      <table {...getTableProps()} className={`${TableCss.regular}`}>
        <thead className={`${TableCss.regularThead}`}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </YouTubePlayerContext.Provider>
  );
}

const columns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  {
    Header: '曲名(Click it)', accessor: 'KaraokeId',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

      const [isDisplay, setIsDisplay] = useState<boolean>(false);
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + ConvertStringToTime(row.original.SingStart)
        await navigator.clipboard.writeText(url);
        setIsDisplay(true)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <div className="relative flex w-auto" >
          <button className="flex"
            onClick={() => handleMovieClickYouTube(row.original.MovieUrl, ConvertStringToTime(row.original.SingStart))}
          >
            <img src="/content/play_black.svg" className='w-5 mr-1 bottom-0' />
            {row.original.SongName}
          </button>

          <span className="absolute right-0">
            <button className="flex"
              onClick={() => handleClick()}
            >
              <img src="/content/copy_gray.svg" className='h-4 mr-2' />
            </button>
            {isDisplay &&
              <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">
                URL was copied
              </div>
            }
          </span>
        </div >
      )
    },
  },
  { Header: '動画タイトル', accessor: 'MovieTitle' },
  {
    Header: 'いいね',
    accessor: 'Count',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <FavoriteColumn
          count={row.original.Count}
          isFav={row.original.IsFav}
          movie={row.original.MovieUrl}
          karaoke={row.original.KaraokeId}
        />
      );
    }
  },
];

type FavoriteColumn = {
  count: number
  isFav: boolean
  movie: string
  karaoke: number
}

function FavoriteColumn({ count, isFav, movie, karaoke }: FavoriteColumn) {
  const [isFavNow, setIsCheck] = useState(isFav)
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const { isSignin } = useContext(SigninContext)
  const handleClick = async () => {
    console.log("isSignin", isSignin)
    if (isSignin == false) {
      setIsDisplay(true)
      setTimeout(() => setIsDisplay(false), 1500)
      return
    }

    setIsCheck(!isFavNow);
    const axiosClient = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    try {
      const reqBody: FavoriteKaraoke = {
        MovieUrl: movie,
        KaraokeId: karaoke,
      };
      if (isFavNow) {
        const response = await axiosClient.delete(
          `${domain.backendHost}/fav/unfavorite/karaoke`,
          { data: reqBody, });
        if (!response.status) {
          throw new Error(response.statusText);
        }
      } else {
        const response = await axiosClient.post(
          `${domain.backendHost}/fav/favorite/karaoke`,
          reqBody);
        if (!response.status) {
          throw new Error(response.statusText);
        }
      }
    } catch (err) {
      console.error(err);
    }

  };
  return (
    <div>
      <button className={`${TableCss.favoriteColumn} relative flex`} onClick={handleClick}>
        {isFavNow ?
          <img src="/content/heart_pink.png" className='flex w-5 m-1 mr-0' />
          : <img src="/content/heart_white.png" className='flex w-5 m-1 mr-0' />
        }

        {isFavNow == isFav ? count : isFavNow ? count + 1 : count - 1}

        {isDisplay &&
          <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[140px]">
            ログインが必要です
          </div>
        }
      </button>
    </div>
  );
};
///////////////////////////////////////////////////////////////
// /karaoke/sings ページネーション

const PagenationReturnPostcolumns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  {
    Header: '曲名(Click it)', accessor: 'KaraokeId',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す
      const { setSelectedPost } = useContext(SeletctPostContext)
      const handleClickPlay = (post: ReceivedKaraoke) => {
        handleMovieClickYouTube(
          row.original.MovieUrl,
          ConvertStringToTime(row.original.SingStart)
        );
        setSelectedPost(post)
      };


      const [isDisplay, setIsDisplay] = useState<boolean>(false);
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + ConvertStringToTime(row.original.SingStart)
        await navigator.clipboard.writeText(url);
        setIsDisplay(true)
        setSelectedPost(row.original)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <div className="relative flex w-auto" >
          <button className="flex"
            onClick={() => handleClickPlay(row.original)}
          >
            <img src="/content/play_black.svg" className='w-5 mr-1 bottom-0' />
            {row.original.SongName}
          </button>

          <span className="absolute right-0">
            <button className="flex"
              onClick={() => handleClick()}
            >
              <img src="/content/copy_gray.svg" className='h-4 mr-2' />
            </button>
            {isDisplay &&
              <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">
                URL was copied
              </div>
            }
          </span>
        </div >
      )
    },
  },
  { Header: '再生開始', accessor: 'SingStart' },
  { Header: '動画タイトル', accessor: 'MovieTitle' },
  {
    Header: 'いいね',
    accessor: 'Count',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <FavoriteColumn
          count={row.original.Count}
          isFav={row.original.IsFav}
          movie={row.original.MovieUrl}
          karaoke={row.original.KaraokeId}
        />
      );
    }
  },
];

type KaraokeTableReturnPostProps = {
  posts: ReceivedKaraoke[];
  handleMovieClickYouTube: (arg0: string, arg1: number) => void;
  setSelectedPost: (arg0: ReceivedKaraoke) => void;
};

const SeletctPostContext = React.createContext({} as {
  setSelectedPost: (arg0: ReceivedKaraoke) => void;
})

export function KaraokePagenatoinTable({ posts, handleMovieClickYouTube, setSelectedPost }: KaraokeTableReturnPostProps) {
  const data = posts != null ? posts : [{} as ReceivedKaraoke];
  const maxPageSize = 99999

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
    state: { pageIndex, pageSize }
  } = useTable({
    columns: PagenationReturnPostcolumns,
    data,
    initialState: { pageIndex: 0, pageSize: 15 }
  },
    useSortBy, usePagination, useRowSelect);

  return (
    <SeletctPostContext.Provider value={{ setSelectedPost }}>
      <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
        <div id="tableComp" className={'block md:w-[800px] w-full'}> {/* 本当はmd以上でも横幅を動的にしたい */}
          <div id="tab" className="md:inline-block  mt-2 ">
            <div className="bg-[#B7A692] mt-1 p-1 rounded-t-2xl">
              <button className="ml-1 px-2 bg-[#657261] rounded-2xl hover:bg-[#B7A692]"
                onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>
              <button className="mx-1 px-2 md:px-3 bg-[#657261] rounded-2xl hover:bg-[#B7A692]"
                onClick={() => previousPage()} disabled={!canPreviousPage}>
                {"<"}
              </button>
              <span>
                <strong className="mx-0 md:mx-1">
                  {pageIndex + 1} / {pageOptions.length}
                </strong>{" "}
              </span>
              <button className={`px-2 ml-0 md:px-3  md:ml-1 bg-[#657261] rounded-2xl hover:bg-[#B7A692]`}
                onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </button> &nbsp;
              <button className={`px-2 mr-0 md:mr-1 bg-[#657261] rounded-2xl hover:bg-[#B7A692]`}
                onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {">>"}
              </button>
              <select className='text-right'
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100, maxPageSize].map((pageSize) => (

                  <option key={pageSize} value={pageSize}>
                    {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
                  </option>
                ))}
              </select>
              <span className='mx-1'>全{posts.length}件</span>
            </div>
          </div>
          <div className="w-full">
            <div id="table" className=' overflow-x-scroll'>
              <table {...getTableProps()} className={`${TableCss.regular}`}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table >
            </div>
          </div>
        </div>
      </YouTubePlayerContext.Provider >
    </SeletctPostContext.Provider>
  );
};

////////////////////////////////////////////////////////////////
// // 素のReact
// // 全件からランダム表示 使ってない
export function RandamTable({ posts }: KaraokeTableProps) {
  const data = posts != null ? posts : [{} as ReceivedKaraoke];
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeで再生したいデータを渡す
  const [shuffledData, setShuffledData] = useState(shuffleArray(data));
  const [pageSize, setPageSize] = useState(5);
  const getCurrentData = shuffledData.slice(0, pageSize);
  console.log("getCurrentData", getCurrentData)

  const maxPageSize = 99999
  return (
    <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
      <div>
        {hasWindow &&
          <div>
            {data === null &&
              <div>曲は未登録です</div>
            }
            {(data?.length > 0 && data?.length < 6) &&
              <div>歌のランダム表示は登録件数が６件以上で表示可能です <br />
                現在の登録件数 : {data.length}
              </div>
            }
            {data?.length > 7 &&
              <span>
                <div className={` py-0.5`}>
                  <span className={` px-0.5`}>
                    ランダム表示:
                  </span>
                  <button onClick={() => setShuffledData(shuffleArray(data))} className={`${ToClickTW.regular} py-0`}>
                    表更新
                  </button>
                  <select className='text-right'
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {[5, 10, 25, 50, 100, maxPageSize].map((pageSize) => (
                      <option value={pageSize} key={""}>
                        {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
                      </option>
                    ))}
                  </select>
                  (全{data.length}件)
                </ div>
                <div>
                  <table className={`${TableCss.regular}`}>
                    <thead className={`${TableCss.regularThead}`}>
                      <tr className={``}>
                        <th>VTuber</th>
                        <th>動画</th>
                        <th>歌(click it)</th>
                        <th>いいね</th>
                      </tr>
                    </thead>
                    <tbody >
                      {getCurrentData.map(item => (
                        <tr key={item.KaraokeId} className={`${TableCss.regularTr}`}>
                          <td>{item.VtuberName}</td>
                          <td>{item.MovieTitle}</td>
                          <td >
                            <span className="relative">
                              <button className="flex"
                                onClick={() => handleMovieClickYouTube(item.MovieUrl, ConvertStringToTime(item.SingStart))}
                              >
                                <img src="/content/play_black.svg" className='w-5 mr-2' />
                                {item.SongName}
                              </button>
                            </span>
                          </td>
                          <td >
                            <FavoriteColumn count={item.Count} isFav={item.IsFav} movie={item.MovieUrl} karaoke={item.KaraokeId} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </span>}
          </div >
        }</div >
    </YouTubePlayerContext.Provider >
  );
}

///////////////////////////////////////////////////
// // top youtube横　カラム少な目→それに合わせてapi側要変更？
const ThinColumns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  {
    Header: '曲名(Click it)', accessor: 'KaraokeId',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

      const [isDisplay, setIsDisplay] = useState<boolean>(false);
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + ConvertStringToTime(row.original.SingStart)
        await navigator.clipboard.writeText(url);
        setIsDisplay(true)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <span className="relative flex w-auto" >
          <button className="flex"
            onClick={() => handleMovieClickYouTube(row.original.MovieUrl, ConvertStringToTime(row.original.SingStart))}
          >
            <img src="/content/play_black.svg" className='w-5 mr-1 bottom-0' />
            {row.original.SongName}
          </button>

          <span className="absolute right-0">
            <button className="flex"
              onClick={() => handleClick()}
            >
              <img src="/content/copy_gray.svg" className='h-4 mr-2' />
            </button>
            {isDisplay &&
              <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">URL was copied</div>
            }
          </span>
        </span >
      )
    },
  },
  {
    Header: 'いいね',
    accessor: 'Count',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <FavoriteColumn
          count={row.original.Count}
          isFav={row.original.IsFav}
          movie={row.original.MovieUrl}
          karaoke={row.original.KaraokeId}
        />
      );
    }
  },
];

export const KaraokeThinTable = ({ posts, handleMovieClickYouTube }: KaraokeTableProps) => {
  const data = posts || [{} as ReceivedKaraoke]
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: ThinColumns, data }, useSortBy, useRowSelect);

  return (
    <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
      <div className="w-full overflow-scroll md:overflow-hidden">
        <table {...getTableProps()} className={`${TableCss.regular} `}>
          <thead className={`${TableCss.regularThead}`}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </YouTubePlayerContext.Provider >
  );
}

///////////////////////////
//  delete用
export function KaraokeDeleteTable({ posts, handleMovieClickYouTube }: KaraokeTableProps) {
  const data = posts != null ? posts : [{} as ReceivedKaraoke];
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
    state: { pageIndex, pageSize }
  } = useTable({
    columns: deleteColumns,
    data,
    initialState: { pageIndex: 0, pageSize: 15 }
  },
    usePagination);

  return (
    <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
      <div id="tab" className=" ">
        <div className="flex bg-[#B7A692] mt-1 py-1 px-3 rounded-t-2xl max-w-[340px] ">
          <button className="ml-1 px-2 bg-[#657261] rounded-2xl hover:bg-[#B7A692]"
            onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button className="mx-1 px-2 md:px-3 bg-[#657261] rounded-2xl hover:bg-[#B7A692]"
            onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <span>
            <strong className="mx-0 md:mx-1">
              {pageIndex + 1} / {pageOptions.length}
            </strong>{" "}
          </span>
          <button className={`px-2 ml-0 md:px-3  md:ml-1 bg-[#657261] rounded-2xl hover:bg-[#B7A692]`}
            onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button> &nbsp;
          <button className={`px-2 mr-0 md:mr-1 bg-[#657261] rounded-2xl hover:bg-[#B7A692]`}
            onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </button>
          <select className='text-right'
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100, maxPageSize].map((pageSize) => (

              <option key={pageSize} value={pageSize}>
                {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full overflow-scroll md:overflow-hidden">
        <table {...getTableProps()} className={`${TableCss.regular} `}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </YouTubePlayerContext.Provider >
  );
};

const deleteColumns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  {
    Header: '曲', accessor: 'SongName',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { setCurrentVideoId, setCurrentStart } = useContext(ToDeleteContext);
      const clickHandler = (url: string, SingStart: string) => {
        setCurrentVideoId(ExtractVideoId(url));
        setTimeout(() => setCurrentStart(ConvertStringToTime(SingStart)), 1450)
      }
      return (
        <span className="relative" >
          <button className="flex"
            onClick={() => clickHandler(row.original.MovieUrl, row.original.SingStart)}
          >
            <img src="/content/play_black.svg" className='w-5 mr-2' />
            {row.original.SongName}
          </button>
        </span >
      )
    },
  },
  { Header: '再生開始', accessor: 'SingStart' },
  { Header: '歌枠', accessor: 'MovieTitle' },
  {
    Header: '削除', accessor: 'KaraokeId',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { setToDeleteVtuberId, setToDeleteMovieUrl, setToDeleteKaraokeId } = useContext(ToDeleteContext);
      const clickHandler = () => {
        setToDeleteVtuberId(row.original.VtuberId)
        setToDeleteMovieUrl(row.original.MovieUrl)
        setToDeleteKaraokeId(row.original.KaraokeId)
        console.log("削除発火")
      }
      return (
        <>
          {row.original.KaraokeId != undefined &&
            <button onClick={() => clickHandler()}>
              <u>削除</u>
            </button>}
        </>)
    },
  }
];

///////////////////////////////////////////////////
// // top youtube横　
// 全件取得してフロント側でランダムにしてるけど、バック側でランダム５件+α取得すべき

const randam5columns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  {
    Header: '曲名(Click it)', accessor: 'KaraokeId',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

      const [isDisplay, setIsDisplay] = useState<boolean>(false);
      const handleClick = async () => {
        const url = "https://" + row.original.MovieUrl + "&t=" + ConvertStringToTime(row.original.SingStart)
        await navigator.clipboard.writeText(url);
        setIsDisplay(true)
        setTimeout(() => setIsDisplay(false), 2000)
      }

      return (
        <span className="relative flex w-auto" >
          <button className="flex"
            onClick={() => handleMovieClickYouTube(row.original.MovieUrl, ConvertStringToTime(row.original.SingStart))}
          >
            <img src="/content/play_black.svg" className='w-5 mr-1 bottom-0' />
            {row.original.SongName}
          </button>

          <span className="absolute right-0">
            <button className="flex"
              onClick={() => handleClick()}
            >
              <img src="/content/copy_gray.svg" className='h-4 mr-2' />
            </button>
            {isDisplay &&
              <div className="absolute bg-[#B7A692] rounded-2xl right-0 top-0 px-2 w-[130px]">URL was copied</div>}
          </span>
        </span >
      )
    },
  },
  { Header: '再生開始', accessor: 'SingStart' },
  {
    Header: 'いいね',
    accessor: 'Count',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return (
        <FavoriteColumn
          count={row.original.Count}
          isFav={row.original.IsFav}
          movie={row.original.MovieUrl}
          karaoke={row.original.KaraokeId}
        />
      );
    }
  },
];

export const KaraokeMinRandamTable = ({ posts, handleMovieClickYouTube }: KaraokeTableProps) => {
  const karaokes = posts || [{} as ReceivedKaraoke]
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const [shuffledData, setShuffledData] = useState<ReceivedKaraoke[]>(shuffleArray(karaokes));

  // 実装できてないランダム更新機能
  // const [isStatus, setIsStatus] = useState<boolean>(true)
  // const handleClickReload = () => {
  //   setIsStatus(!isStatus)
  //   console.log("起動")
  //   console.log("isStatus", isStatus)
  // }

  // useEffect(() => {
  //   setShuffledData(shuffledData)
  // }, [isStatus])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable({
    columns: randam5columns,
    data: shuffledData,
    initialState: { pageIndex: 0, pageSize: 5 }
  },
    usePagination);

  return (
    <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
      {hasWindow &&
        <div>
          <div className='flex ml-5 '>
            <h2 className="flex mr-1">ランダム5件表示中 (登録数{posts.length}件)</h2>
            {/* ↓実装できてないランダム更新機能 */}
            {/* 
            {shuffledData[1].KaraokeId}
            　<button
              // onClick={() => setShuffledData(shuffledData)}
              onClick={() => setShuffledData(karaokes)}
              // onClick={() => handleClickReload()}
              // onClick={() => alert('clicked')} //発火する
              className={`${ToClickCss.regular} flex py-0 h-6`} >更新</button> */}
          </div>
          <div className='overflow-scroll md:overflow-hidden'>
            <table {...getTableProps()} className={`${TableCss.minRandum} `}>
              <thead className={`${TableCss.regularThead}`}>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      }
    </YouTubePlayerContext.Provider>
  );
};