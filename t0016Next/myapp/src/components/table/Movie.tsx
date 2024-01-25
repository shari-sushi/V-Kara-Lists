import React, { useContext, useState } from "react";
import { useTable, useSortBy, Column, useRowSelect } from "react-table";

import { domain } from '@/../env'
import { ExtractVideoId } from "@/components/Conversion"
import axios from 'axios';
import { ReceivedMovie, FavoriteMovie } from "@/types/vtuber_content";
import { ToDeleteContext } from '@/pages/crud/delete'
import { TableCss, } from '@/styles/tailwiind'
import { SigninContext } from "../layout/Layout";


// topページ, mypage用
type MovieTableProps = {
    posts: ReceivedMovie[];
    handleMovieClickYouTube: (arg0: string, arg1: number) => void;
};

export const YouTubePlayerContext = React.createContext({} as {
    handleMovieClickYouTube(movieId: string, time: number): void
})

export function MovieTable({ posts, handleMovieClickYouTube }: MovieTableProps) {
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
            <div className='overflow-scroll md:overflow-hidden'>
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
        </YouTubePlayerContext.Provider>
    );
}

const columns: Column<ReceivedMovie>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    {
        Header: '歌枠 (Click it)', accessor: 'MovieTitle',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { handleMovieClickYouTube } = useContext(YouTubePlayerContext)
            return (
                <span className="relative">
                    <button className="flex"
                        onClick={() => handleMovieClickYouTube(row.original.MovieUrl, 1)}
                    >
                        <img src="/content/play_black.svg" className='w-5 mr-2' />
                        {row.original.MovieTitle}
                    </button>
                </span>
            )
        },
    },
    {
        Header: 'いいね',
        accessor: 'Count',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            return (
                <span className="w-5">
                    <FavoriteColumn
                        count={row.original.Count}
                        isFav={row.original.IsFav}
                        movie={row.original.MovieUrl}
                    />
                </span>
            )
        },
    }
];

type FavoriteColumn = {
    count: number
    isFav: boolean
    movie: string
}

function FavoriteColumn({ count, isFav, movie }: FavoriteColumn) {
    const [isFavNow, setIsCheck] = useState(isFav)
    const [isDisplay, setIsDisplay] = useState<boolean>(false);
    const { isSignin } = useContext(SigninContext)

    const handleClick = async () => {
        if (isSignin == false) {
            setIsDisplay(true)
            setTimeout(() => setIsDisplay(false), 550)
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
        <div>
            <button className={`${TableCss.favoriteColumn} relative flex`} onClick={handleClick}>
                {isFavNow ?
                    <img src="/content/heart_pink.svg" className='flex w-5 m-1 mr-0' />
                    : <img src="/content/heart_white.svg" className='flex w-5 m-1 mr-0' />
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
// mypage用
type MovieTableForMyPageProps = {
    data: ReceivedMovie[];
    handleMovieClickYouTube: () => void;
};

export function MovieTableForMyPage({ data, handleMovieClickYouTube }: MovieTableForMyPageProps) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy, useRowSelect);

    return (
        <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
            <div className=' md:overflow-hidden'>
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
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </YouTubePlayerContext.Provider>
    );
}

///////////////////////////////////
type MovieDeleteTableProps = {
    posts: ReceivedMovie[];
    handleMovieClickYouTube: (arg0: string, arg1: number) => void;
};

export function MovieDeleteTable({ posts, handleMovieClickYouTube }: MovieDeleteTableProps) {
    const data = posts || {}
    console.log("MovieTable.data", data)
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: deleteColumns, data }, useSortBy, useRowSelect);

    return (
        <YouTubePlayerContext.Provider value={{ handleMovieClickYouTube }}>
            <div className="w-full overflow-scroll md:overflow-hidden">
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
            </div>
        </YouTubePlayerContext.Provider>
    );
}

const deleteColumns: Column<ReceivedMovie>[] = [
    { Header: 'VTuber', accessor: 'VtuberName' },
    {
        Header: '歌枠 (Click it)', accessor: 'MovieTitle',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { setCurrentVideoId, setCurrentStart } = useContext(ToDeleteContext) //表示ページにyoutubeのカレントデータを渡す
            const handleClick = (url: string, start: number) => {
                setCurrentVideoId(ExtractVideoId(url));
                setCurrentStart(start);
            }
            return (
                <span className="relative">
                    <button className="flex"
                        onClick={() => handleClick(row.original.MovieUrl, 1)}
                    >
                        <img src="/content/play_black.svg" className='w-5 mr-2' />
                        {row.original.MovieTitle}
                    </button>
                </span>)
        },
    },
    {
        Header: '削除', accessor: 'VtuberId',
        Cell: ({ row }: { row: { original: ReceivedMovie } }) => {
            const { setToDeleteVtuberId, setToDeleteMovieUrl } = useContext(ToDeleteContext);
            const clickHandler = () => {
                setToDeleteVtuberId(row.original.VtuberId)
                setToDeleteMovieUrl(row.original.MovieUrl)
            }
            return (
                <span>
                    {row.original.MovieUrl != undefined &&
                        <button onClick={() => clickHandler()}>
                            <u>削除</u>
                        </button>}
                </span>
            )
        },
    }
];

