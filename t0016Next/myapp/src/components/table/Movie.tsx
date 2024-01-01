import React, { useContext, useState } from "react";
import { useTable, useSortBy, Column, useRowSelect } from "react-table";
import Link from 'next/link'
import TableStyle from '../../styles/table.module.css'
import { YouTubePlayerContext } from '@/pages/index'
import { ExtractVideoId } from "@/components/Conversion"
import axios from 'axios';
import { domain } from '../../../env'
import { ReceivedVtuber, ReceivedMovie, ReceivedKaraoke, FavoriteMovie } from "@/types/vtuber_content";


// topページ用
type MovieTableProps = {
    posts: ReceivedMovie[];
};

export function MovieTable({ posts }: MovieTableProps) {
    const data = posts || {}
    console.log("MovieTable.data", data)
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

const columns: Column<ReceivedMovie>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    {
        Header: '歌枠 (click to play the video)', accessor: 'MovieTitle',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す
            return <Link href="" onClick={() => handleMovieClickYouTube(row.original.MovieUrl, 1)}><u>{row.original.MovieTitle}</u></Link>
        },
    },
    {
        Header: 'いいね',
        accessor: 'Count',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} />;
        },
    }
];

// mypage用
type MovieTableForMyPageProps = {
    data: ReceivedMovie[];
};

export function MovieTableForMyPage({ data }: MovieTableForMyPageProps) {
    // console.log("data", data)
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy, useRowSelect);

    const { setCurrentMovieId } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

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


const columnsForMyPage: Column<ReceivedMovie>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    {
        Header: '歌枠 (click to play the video)', accessor: 'MovieTitle',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

            return <Link href="" onClick={() => handleMovieClickYouTube(row.original.MovieUrl, 1)}>{row.original.MovieTitle}</Link>
        },
    },
    {
        Header: '歌枠 (click to play the video)', accessor: 'MovieTitle',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { handleMovieClickYouTube } = useContext(YouTubePlayerContext) //表示ページにyoutubeのカレントデータを渡す

            return <Link href="" onClick={() => handleMovieClickYouTube(row.original.MovieUrl, 1)}>{row.original.MovieTitle}</Link>
        },
    },
    {
        Header: 'いいね',
        accessor: 'Count',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            return <FavoriteColumn count={row.original.Count} isFav={row.original.IsFav} movie={row.original.MovieUrl} />;
        }
    }
];


type FavoriteColumn = {
    count: number
    isFav: boolean
    movie: string
}

function FavoriteColumn({ count, isFav, movie }: FavoriteColumn) {
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
            const reqBody: FavoriteMovie = {
                MovieUrl: movie,
            };
            if (isFavNow) {
                const response = await axiosClient.delete(
                    `${domain.backendHost}/fav/unfavorite/movie`,
                    { data: reqBody, });
                if (!response.status) {
                    throw new Error(response.statusText);
                }
            } else {
                const response = await axiosClient.post(
                    `${domain.backendHost}/fav/favorite/movie`,
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