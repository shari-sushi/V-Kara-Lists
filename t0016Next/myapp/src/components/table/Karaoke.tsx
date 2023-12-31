import { domain } from '../../../env'
import React, { useState, useEffect, useRef, forwardRef, useCallback, useContext } from "react";
import { useTable, usePagination, CellProps, Row, useSortBy, Column, useRowSelect } from "react-table";
import styles from './components.module.css';
import { ConvertStringToTime, ExtractVideoId } from '../Conversion'
import { generateRandomNumber, shuffleArray } from '../SomeFunction'
import { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke, FavoriteKaraoke } from "@/types/vtuber_content";
import Link from 'next/link'
import TableStyle from '../../styles/table.module.css'
import axios from 'axios';
import { Favorite } from '@mui/icons-material';
import { YouTubePlayerContext } from '@/pages/karaoke/sings';
import { YouTubePlayerContext as TopPageContext } from '@/pages/index';
import { pages } from 'next/dist/build/templates/app-page';

type KaraokeTableProps = {
  posts: ReceivedKaraoke[];
};
/////////////////////////////////////////////////////////////////
// /karaoke/sings 全件
export function KaraokeTable({ posts }: KaraokeTableProps) {
  const data = posts || {}
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy, useRowSelect);

  return (
    <>
      <table {...getTableProps()} className={TableStyle.table}>
        <thead className={TableStyle.th}>
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
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

const columns: Column<ReceivedKaraoke>[] = [
  { Header: 'VTuber', accessor: 'VtuberName' },
  { Header: '動画タイトル', accessor: 'MovieTitle' },
  {
    Header: '曲名(Click to Listen)', accessor: 'SongName',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す
      return <Link href="" onClick={() => handleMovieClickYouTube(row.original.MovieUrl, ConvertStringToTime(row.original.SingStart))}>{row.original.SongName}</Link>
    },
  },
  {
    Header: 'いいね',
    accessor: 'Count',
    Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => {
      return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} karaoke={row.original.KaraokeId} />;
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
  const handleClick = async () => {
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
    <>
      <button className={TableStyle.btn} onClick={handleClick}>
        {isFavNow ? "💓" : "🤍"}
        {isFavNow == isFav ? count : isFavNow ? count + 1 : count - 1}
      </button>
    </>
  );
};
///////////////////////////////////////////////////////////////
// /karaoke/sings ページネーション

export function KaraokePagenatoinTable({ posts }: KaraokeTableProps) {
  const data = posts || {}
  const maxPageSize = 99999
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
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 15 }
  },
    usePagination);

  return (
    <> <br />
      <div>
        <button className="" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button> &nbsp;
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button> &nbsp;
        <span>
          <strong>
            {pageIndex + 1} / {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button> &nbsp;
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button> &nbsp;
        <select
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
      <table {...getTableProps()} className={TableStyle.table}>
        <thead>
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
              <tr {...row.getRowProps()}>
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
    </>
  );
};
////////////////////////////////////////////////////////////////
// // 素のReact
// // 全件からランダムで10件表示

export function RandamTable({ posts }: KaraokeTableProps) {
  const data = posts || {}
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const { handleMovieClickYouTube } = useContext(TopPageContext) //表示ページにyoutubeで再生したいデータを渡す
  const [shuffledData, setShuffledData] = useState(shuffleArray(data)); //休止中のボタンでset関数を使用したい
  const [pageSize, setPageSize] = useState(5);
  const getCurrentData = shuffledData.slice(0, pageSize); //第2引数次第で増加カラム数が変化
  console.log("pageSize", pageSize)
  console.log("getCurrentData.length", getCurrentData.length)
  console.log("getCurrentData", getCurrentData)

  const maxPageSize = 99999
  return (
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
            <div>
              {/* バグ出るので休止中 */}
              <button onClick={() => setShuffledData(shuffleArray(data))} style={{ background: "blue" }}>
                更新
              </button> &nbsp;
              {"ランダム表示 "}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50, 100, maxPageSize].map((pageSize) => (
                  <option value={pageSize}>
                    {pageSize !== maxPageSize ? `Show ${pageSize}` : `Show all`}
                  </option>
                ))}
              </select>
              (全{data.length}件)
              <table border={4} className={TableStyle.table}>
                <thead>
                  <tr>
                    <th>VTuber</th>
                    <th>動画</th>
                    <th>歌(click to start the sing)</th>
                    <th>いいね</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentData.map(item => (
                    <tr key={item.KaraokeId}>
                      <td>{item.VtuberName}</td>
                      <td>{item.MovieTitle}</td>
                      <td>
                        <Link href="" onClick={() => {
                          handleMovieClickYouTube(
                            item.MovieUrl,
                            ConvertStringToTime(item.SingStart));
                        }}>
                          {item.SongName}
                          {/* {item.SongName}, <br />{item.MovieUrl} <br /> {ConvertStringToTime(item.SingStart)} */}
                        </Link>
                      </td>
                      <td>
                        <FavoriteColumn count={item.Count} isFav={item.IsFav} movie={item.MovieUrl} karaoke={item.KaraokeId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
        </div >
      }</div>
  );
}

///////////////////////////////////////////////////
// // top ランダム 　未完成
export const KaraokeRandamTable = ({ posts }: KaraokeTableProps) => {
  const data = posts || {}
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const [shuffledData, setShuffledData] = useState(shuffleArray(data));
  const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

  const itemsPerPage = 10;
  const getCurrentData = shuffledData.slice(0, itemsPerPage - 1);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({
    columns,
    data, // shuffledDataにすると型エラー…解決法不明
    initialState: { pageIndex: 0, pageSize: 15 }
  },
    usePagination);

  return (
    <div>
      {hasWindow &&
        <> <br />
          <div>
            <button onClick={() => setShuffledData(shuffleArray(data))} >
              表示更新
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize !== 100 ? `Show ${pageSize}` : `Show all`}
                </option>
              ))}
            </select>
          </div>
          <table {...getTableProps()} className={TableStyle.table}>
            <thead>
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
                  <tr {...row.getRowProps()}>
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

        </>
      }
    </div>
  );
};