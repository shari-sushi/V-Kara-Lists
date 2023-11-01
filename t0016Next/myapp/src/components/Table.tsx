import React,{ useState, useEffect } from "react";
import { useTable, usePagination, CellProps } from "react-table";
import styles from './components.module.css';
import {ConversionTime, ExtractVideoId} from '../components/Conversion'
import {generateRandomNumber, shuffleArray} from '../components/SomeFunction'
// import {  CellContext,  ColumnDef,  flexRender,  getCoreRowModel, 
//   getFilteredRowModel,  getPaginationRowModel, getSortedRowModel,
// HeaderContext, Row, SortingState, useReactTable } from "@tanstack/react-table";
import { AllJoinData } from "@/types/singdata";


type dummy=" > で収納させないための１行"

// 素のReact
// 全件からランダムで５件表示
// "/"で使用
type DataTableRandam= {
  data:AllJoinData[]; 
  handleMovieClick: (movieId: string) => any; //voidの方が良き？
  setStart: (start: number) => any;
}

  export function DataTableRandam({ data, handleMovieClick, setStart}:DataTableRandam) {
    const [shuffledData, setShuffledData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [reRandom, setRandom] = useState(0)

    useEffect(() => { //dataの配列の順をぐちゃぐちゃにする
      setShuffledData(shuffleArray(data));
    }, [data, reRandom]);
    const getCurrentData = () => {
      // const start = (currentPage - 1) * itemsPerPage; //元々
      const start = (currentPage) * itemsPerPage; //
      return shuffledData.slice(start, start + itemsPerPage);
    }

    const itemsPerPage = 5;
      return (
          <div>
            <div> 
              <button onClick={() => setRandom(reRandom +1 )} >
                表示更新
              </button>
              （ランダム５件表示：全{data.length}歌）
            </div>
              <table border={4}>
                  <thead>
                    <tr>
                      <th>VTuber</th>
                      <th>動画</th>
                      <th>歌(クリックでページ内再生)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentData().map(item => (
                      <tr key={item.MovieUrl}>
                        <td>{item.VtuberName}</td>
                        <td>{item.MovieTitle}</td>
                        <td>
                          <a href="#" onClick={(e) => {
                              e.preventDefault();
                              handleMovieClick(ExtractVideoId(item.MovieUrl));
                              setStart(ConversionTime(item.SingStart));
                          }}>
                          {item.SongName}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
      );
  }


//react-table
// 全件をページネーション
// /karaokelist/singsで使用
type Column = {
  Header: string;
  accessor: string;
  Cell?: (cell: CellProps<any, any>) => React.ReactElement;
};

type DataTablePageNation = {
  columns: Column[];
  data: AllJoinData[];
  pageSize: number;
}


export const DataTablePageNation = ({ columns=[], data = [], pageSize }:DataTablePageNation) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
  
      // ページネーション用
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      state: { pageIndex }
    } = useTable<AllJoinData>(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: pageSize } // 初期のページと表示する行数を設定
      },
      usePagination
    );
  
    return (
      <div>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
          <span>
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
        <table {...getTableProps()} className={styles.tableStyle}>
      <thead >
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className={styles.header}>{column.render("Header")}</th>
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
                <td {...cell.getCellProps()} className={styles.cell}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
       
                      {/* <td>
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleMovieClick(ExtractVideoId(item.MovieUrl));
                          setStart(ConversionTime(item.SingStart));
                        }}>
                        {item.SongName}
                        </a>
                      </td>
                    </tr>
                  ))} */}
      </div>
    );
  };


  
// react-table 使ってないかも→削除予定
// const Table = ({ columns, data }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
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
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex: 0, pageSize: 5 } 
//     },
//     usePagination
//   );
//   return (
//     <div >
//       <table {...getTableProps()} className={styles.tableStyle}>
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()} >
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps()} className={styles.header}>{column.render("Header")} </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {page.map((row) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => (
//                   <td {...cell.getCellProps()} className={styles.cell}>{cell.render("Cell")}</td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div>
//         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//           {"<<"}</button>
//         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//           {"<"}</button>
//         <button onClick={() => nextPage()} disabled={!canNextPage}>
//           {">"}</button>
//         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//           {">>"}</button>
//         <span>
//           Page {pageIndex + 1} of {pageOptions.length}
//         </span>
//       </div>
//     </div>
//   );
// };

// export function App({data, columns, handleMovieClick, ExtractVideoId, setStart, start}) {
//   const columnsWithActions = columns.map(col => {
//     if (col.accessor === "MovieUrl") {
//       return {
//         ...col,
//         Cell: ({ row }) => (
//           <a 
//             href="#" 
//             onClick={(e) => {
//               e.preventDefault();
//               handleMovieClick(ExtractVideoId(row.original.MovieUrl));
//               setStart(ConversionTime(row.original.SingStart));
//               console.log("start:",start)
//             }}
//           >
//             再生
//           </a>
//         )
//       }
//     }
//     return col;
//   });
//   return <Table columns={columnsWithActions} data={data} />;
// }

// 素のReact

// DataTableRandam, DataTableRandamPagenationで使用


// 全件からランダムで表示、ページネーションも→実用性無しかな
// type DataTableRandamPagenation={
//    data: [],
//    handleMovieClick: [],
//    setStart: number
//   }

// export function DataTableRandamPagenation({ data, handleMovieClick, setStart}:DataTableRandamPagenation) {
//   const shuffledData = shuffleArray(data);
//   const [currentPage, setCurrentPage] = useState(1);
//     // ページネーションのためのデータの切り出し
//     const getCurrentData = () => {
//       const start = (currentPage - 1) * itemsPerPage;
//       return shuffledData.slice(start, start + itemsPerPage);
//     }
//   const itemsPerPage = 5;
//     return (
//         <div>
//           <div> 
//             <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
//                 更新
//             </button>
//             歌数{data.length}
//             {/* <button onClick={() => setPage()} >
//                 次
//             </button> */}
//             <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * itemsPerPage >= data.length}>
//                 次
//             </button>
//           </div>
//             <table border={4}>
//                 <thead>
//                   <tr>
//                     <th>VTuber</th>
//                     <th>動画</th>
//                     <th>歌(クリックで再生)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getCurrentData().map(item => (
//                     <tr key={item.MovieId}>
//                       <td>{item.VtuberName}</td>
//                       <td>{item.MovieTitle}</td>
//                       <td>
//                         <a href="#" onClick={(e) => {
//                             e.preventDefault();
//                             handleMovieClick(ExtractVideoId(item.MovieUrl));
//                             setStart(ConversionTime(item.SingStart));
//                         }}>
//                         {item.SongName}
//                         </a>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }