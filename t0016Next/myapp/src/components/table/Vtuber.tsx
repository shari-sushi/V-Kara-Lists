import React, { useContext } from "react";
import { useTable, useSortBy, Column, useRowSelect } from "react-table";
import Link from 'next/link'
import { ReceivedVtuber } from "@/types/vtuber_content";
import TableStyle from '@/styles/table.module.css'
import { ToDeleteContext } from '@/pages/crud/delete'
import { TableCss } from '@/styles/tailwiind'

type VtuberTableProps = {
    posts: ReceivedVtuber[];
};

export function VtuberTable({ posts }: VtuberTableProps) {
    const data = posts || {}
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy, useRowSelect);

    return (
        <div className="w-full overflow-scroll md:overflow-hidden">
            <table {...getTableProps()} className={`${TableCss.regular} caption-bottom`}>
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
                <tbody {...getTableBodyProps()} className="">
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className={`${TableCss.regularTr}`}>
                                {row.cells.map((cell) => {
                                    return <td {...cell.getCellProps()} className={TableStyle.td} >{cell.render('Cell')}</td>
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


const columns: Column<ReceivedVtuber>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    { Header: 'kana', accessor: 'VtuberKana' },
    {
        Header: '紹介動画( link to YouTube)', accessor: 'IntroMovieUrl',
        Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
            return (
                <span className="relative">
                    <>
                        {row.original.IntroMovieUrl &&
                            <Link href={`https://${row.original.IntroMovieUrl}`} className="flex"
                                target="_blank" rel="noopener noreferrer">
                                <img src="/content/play_black.svg" className='w-5 mr-2' />
                                YouTubeへ
                            </Link>
                            || <span className={`pl-7`}>未登録</span>

                        }
                    </>
                </span>
            )
        },
    },
];

/////////////////////////////////////////////////////
type VtuberDeleteTableProps = {
    posts: ReceivedVtuber[];
};

export function VtuberDeleteTable({ posts }: VtuberDeleteTableProps) {
    const data = posts || [{} as ReceivedVtuber];
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: deleteColumns, data }, useSortBy, useRowSelect);

    return (
        <div className="w-full overflow-scroll md:overflow-hidden">
            <table {...getTableProps()} className={TableCss.regular}>
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
    );
}

const deleteColumns: Column<ReceivedVtuber>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    { Header: 'kana', accessor: 'VtuberKana' },
    {
        Header: '紹介動画( link to YouTube)', accessor: 'IntroMovieUrl',
        Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
            return (
                <span className="relative">
                    <>
                        {row.original.IntroMovieUrl &&
                            <Link href={`https://${row.original.IntroMovieUrl}`} className="flex"
                                target="_blank" rel="noopener noreferrer">
                                <img src="/content/play_black.svg" className='w-5 mr-2' />
                                YouTubeへ
                            </Link>
                            || <span className={`pl-7`}>未登録</span>

                        }
                    </>
                </span>
            )
        },
    },
    {
        Header: '削除', accessor: 'VtuberId',
        Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
            const { setToDeleteVtuberId } = useContext(ToDeleteContext);
            const clickHandler = () => {
                setToDeleteVtuberId(row.original.VtuberId)
            }
            return (<>
                {row.original.VtuberId != undefined && <button onClick={() => clickHandler()}><u>削除</u></button>}
            </>)
        },
    }
];