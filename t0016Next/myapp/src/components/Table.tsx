import React, { useState, useEffect } from "react";
import { useTable, usePagination, CellProps, Row, useSortBy, Column } from "react-table";
import styles from './components.module.css';
import { ConversionTime, ExtractVideoId } from '../components/Conversion'
import { generateRandomNumber, shuffleArray } from '../components/SomeFunction'
// import {  CellContext,  ColumnDef,  flexRender,  getCoreRowModel, 
//   getFilteredRowModel,  getPaginationRowModel, getSortedRowModel,
// HeaderContext, Row, SortingState, useReactTable } from "@tanstack/react-table";
import { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke } from "@/types/vtuber_content";
// import{ useTable, Column, useSortBy }  from '../types/react-table.d'
import { domain } from '../../env'
import Link from 'next/link'

// top画面のvtubers
// type introVtuberTable = {
//   vtubers: ReceivedVtuber[];
// }
// export function introVtuberTable({ vtubers }: introVtuberTable) {
// }


// top画面、マイページ
// vtuber


// top画面、マイページ
// movie


// top画面、マイページ
// karaoke, ランダム5権



type KaraokeTableProps = {
  data: ReceivedKaraoke[];
};


export function KaraokeTable({ data }: KaraokeTableProps) {
  // const [isClick, setIsClick] = useState<boolean>(false);
  const columns: Column<ReceivedKaraoke>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    { Header: '動画タイトル', accessor: 'MovieTitle' },
    { Header: '曲名', accessor: 'SongName' },
    // {
    //   Header: 'いいね', accessor: 'Count',
    //   Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => (
    //     <button onClick={() => handleLike(row.original)}>
    //       {row.original.Count} {isClick ? '(^^)' : '(._.)'}
    //     </button>),
    // },
    // {
    //   Header: '編集', accessor: 'KaraokeId',
    //   Cell: ({ row }: { row: { original: ReceivedKaraoke } }) => (
    //     <Link href={`/edit?vtuberid=${row.original.VtuberId}?movieurl=${row.original.MovieUrl}?karoakeid=${row.original.KaraokeId}`}>
    //       編集</Link>),
    // },
  ];

  // const handleLike = (rowData: ReceivedKaraoke) => {
  //   if (rowData.IsFav && isClick) {
  //     setIsClick(!isClick);
  //   } else if (!rowData.IsFav && !isClick) {
  //     rowData.Count += 1;
  //   }
  //   setIsClick(!isClick);
  // };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ▽' : ' △') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};


// // /sing, karaoke全件
// type AllKaraokeTable = {
//   data: ReceivedKaraoke[];
//   checkSignin: boolean;
// }
// const columns: Column<ReceivedKaraoke>[] = [
//   { Header: 'VtuberName', accessor: 'VtuberName' },
//   { Header: 'MovieTitle', accessor: 'MovieTitle' },
//   { Header: 'SongName', accessor: 'SongName' },
//   // { Header: 'Count', accessor: 'Count' },
// ];

// export function AllKaraokeTable({ data, checkSignin }: AllKaraokeTable) {


//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//   } = useTable(
//     {
//       data,
//       columns,
//       checkSignin,
//     },
//     useSortBy
//   );
//   return (
//     <table {...getTableProps()}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                 {column.render('Header')}
//                 <span>
//                   {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
//                 </span>
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => (
//                 <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//               ))}
//             </tr>
//           );
//         }


//         )}
//       </tbody>
//     </table>
//   );
// };


// /sing, karaoke全件、ページネーション









//古//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // 素のReact
// // 全件からランダムで５件表示
// // "/"で使用
// type RandamTableData = {
//   data: ReceivedKaraoke[];
//   handleMovieClick: (movieId: string) => any; //voidの方が良き？
//   setStart: (start: number) => any;
// }

// export function RandamTable({ data, handleMovieClick, setStart }: RandamTableData) {
//   const [shuffledData, setShuffledData] = useState(data);
//   const [reload, setRandom] = useState(true)

//   useEffect(() => {
//     setShuffledData(shuffleArray(data));
//   }, [data, reload]);
//   const itemsPerPage = 5;
//   const getCurrentData = () => {
//     return shuffledData.slice(0, itemsPerPage - 1); //バグ有り
//     //ページ更新で表示数増減することが多い。表示数について第二引数~+3。
//   }

//   return (
//     <div>
//       {data === null &&
//         <div>曲が登録されていません</div>
//       }
//       {(data?.length > 0 && data?.length < 6) &&
//         <div>歌のランダム表示は登録件数が６件以上に実行されます。 <br />
//           現在の登録件数 : {data.length}
//         </div>
//       }
//       {data?.length > 7 &&
//         <div>
//           <button onClick={() => setRandom(!reload)} >
//             表示更新
//           </button>
//           （ランダム{itemsPerPage}件表示：全{data.length}件）
//           <table border={4}>
//             <thead>
//               <tr>
//                 <th>VTuber</th>
//                 <th>動画</th>
//                 <th>歌(クリックでページ内再生)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getCurrentData().map(item => (
//                 <tr key={item.MovieUrl}>
//                   <td>{item.VtuberName}</td>
//                   <td>{item.MovieTitle}</td>
//                   <td>
//                     <a href="#" onClick={(e) => {
//                       e.preventDefault();
//                       handleMovieClick(ExtractVideoId(item.MovieUrl));
//                       setStart(ConversionTime(item.SingStart));
//                     }}>
//                       {item.SongName}
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>}
//     </div>
//   );
// }


// //react-table
// // 全件をページネーション
// // /karaokelist/singsで使用

// export type DataButton = {
//   col1: string;
//   col2: JSX.Element;
// };
// const SortableTable = ({ columns, data, }: {
//   columns: Column<DataButton>[]; data: DataButton[];
// }) => {
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable<DataButton>({ columns, data }, useSortBy);
// }
// export type Data = {
//   col1: string;
//   col2: string;
// };

// // ***************Dcokerのために一旦コメントアウト化*********************
// type Column = {
//   Header: string;
//   accessor: keyof PageNationTableData; // PageNationTableData のプロパティ名に対応するキーを指定
//   Cell?: (cell: CellProps<PageNationTableData, any>) => React.ReactElement;
// };

// type PageNationTableData = {
//   columns: Column[];
//   data: ReceivedKaraoke[];
//   pageSize: number;
// }

// export const PageNationTable = ({ columns = [], data = [], pageSize }: PageNationTableData) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,

//     // ページネーション用
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     state: { pageIndex }
//     // } = useTable<VtuberMovieKaraoke>(
//   } = useTable<PageNationTableData>({
//     columns,
//     data,
//     initialState: { pageIndex: 0, pageSize: pageSize } // 初期のページと表示する行数を設定
//   },
//     usePagination
//   );

//   // const { hogeA, hogeB } = useHOGEa<type>({ aa, bb }), useHOGEb);

//   return (
//     <div>
//       <div>
//         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
//         <button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>
//         <button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>
//         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
//         <span>
//           Page {pageIndex + 1} of {pageOptions.length}
//         </span>
//       </div>
//       <table {...getTableProps()} className={styles.tableStyle}>
//         <thead >
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()} className={styles.header}>{column.render("Header")}</th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {page.map((row: Row<PageNationTableData>) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => (
//                   <td {...cell.getCellProps()} className={styles.cell}>
//                     {cell.render("Cell")}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       {/* <td>
//           <a href="#" onClick={(e) => {
//             e.preventDefault();
//             handleMovieClick(ExtractVideoId(item.MovieUrl));
//             setStart(ConversionTime(item.SingStart));
//           }}>
//           {item.SongName}
//           </a>
//         </td>
//       </tr>
//     ))} */}
//     </div>
//   );
// };



// // react-table 使ってないかも→現状ランダムのみは素のreactでやってるから書き換え予定
// // const Table = ({ columns, data }) => {
// //   const {
// //     getTableProps,
// //     getTableBodyProps,
// //     headerGroups,
// //     prepareRow,

// //     // ページネーション用
// //     page,
// //     canPreviousPage,
// //     canNextPage,
// //     pageOptions,
// //     pageCount,
// //     gotoPage,
// //     nextPage,
// //     previousPage,
// //     state: { pageIndex }
// //   } = useTable(
// //     {
// //       columns,
// //       data,
// //       initialState: { pageIndex: 0, pageSize: 5 }
// //     },
// //     usePagination
// //   );
// //   return (
// //     <div >
// //       <table {...getTableProps()} className={styles.tableStyle}>
// //         <thead>
// //           {headerGroups.map((headerGroup) => (
// //             <tr {...headerGroup.getHeaderGroupProps()} >
// //               {headerGroup.headers.map((column) => (
// //                 <th {...column.getHeaderProps()} className={styles.header}>{column.render("Header")} </th>
// //               ))}
// //             </tr>
// //           ))}
// //         </thead>
// //         <tbody {...getTableBodyProps()}>
// //           {page.map((row) => {
// //             prepareRow(row);
// //             return (
// //               <tr {...row.getRowProps()}>
// //                 {row.cells.map((cell) => (
// //                   <td {...cell.getCellProps()} className={styles.cell}>{cell.render("Cell")}</td>
// //                 ))}
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //       <div>
// //         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
// //           {"<<"}</button>
// //         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
// //           {"<"}</button>
// //         <button onClick={() => nextPage()} disabled={!canNextPage}>
// //           {">"}</button>
// //         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
// //           {">>"}</button>
// //         <span>
// //           Page {pageIndex + 1} of {pageOptions.length}
// //         </span>
// //       </div>
// //     </div>
// //   );
// // };

// // export function App({data, columns, handleMovieClick, ExtractVideoId, setStart, start}) {
// //   const columnsWithActions = columns.map(col => {
// //     if (col.accessor === "MovieUrl") {
// //       return {
// //         ...col,
// //         Cell: ({ row }) => (
// //           <a
// //             href="#"
// //             onClick={(e) => {
// //               e.preventDefault();
// //               handleMovieClick(ExtractVideoId(row.original.MovieUrl));
// //               setStart(ConversionTime(row.original.SingStart));
// //               console.log("start:",start)
// //             }}
// //           >
// //             再生
// //           </a>
// //         )
// //       }
// //     }
// //     return col;
// //   });
// //   return <Table columns={columnsWithActions} data={data} />;
// // }