import React, { useContext } from "react";
import { useTable, useSortBy, Column, useRowSelect } from "react-table";
import { ReceivedVtuber } from "@/types/vtuber_content";
import Link from 'next/link'
import TableStyle from '../../styles/table.module.css'
import { YouTubePlayerContext } from '@/pages/karaoke/sings';


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

    const youtubeinfo = useContext(YouTubePlayerContext);

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


const columns: Column<ReceivedVtuber>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    { Header: 'VtuberKana', accessor: 'VtuberKana' },
    {
        Header: '紹介動画(click to play the video)', accessor: 'IntroMovieUrl',
        Cell: ({ row }: { row: { original: ReceivedVtuber } }) => {
            return <Link href={`https://${row.original.IntroMovieUrl}`} target="_blank" rel="noopener noreferrer">
                {row.original.IntroMovieUrl && <u>{"YouTubeに見に行く"}</u> || "未登録"}
            </Link>
        },
    },
];

