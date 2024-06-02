import { VtuberId } from "@/types/vtuber_content";
import { ColumnDef } from "@tanstack/react-table";
import Image from 'next/image';

export const VtuberCOLUMNS: ColumnDef<any>[] = [
    {
        header: "お名前",
        accessorKey: "VtuberName",
    },
    {
        header: "kana",
        accessorKey: "VtuberKana",
    },
    {
        header: "紹介動画",
        accessorKey: "IntroMovieUrl",
    },
];


export const VtuberCOLUMNS2: ColumnDef<any>[] = [
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                        console.log(1000000000)
                        // alert(`${user.id}:${user.email}の編集ボタンがクリックされました。`)
                    }
                >

                    {/* <input type="button">aa</input> */}
                </div>
            );
        },
    },
    ...VtuberCOLUMNS
];

/////////////////////////////
export const VtuberCOLUMNS3: ColumnDef<any>[] = [
    {
        accessorKey: "VtuberId",
        header: ({ column }) => {
            return (
                <div
                    style={{ flex: "auto", alignItems: "center", cursor: "pointer" }}
                    onClick={column.getToggleSortingHandler()}
                >
                    ID{getSortIcon(column.getIsSorted())}
                </div>
            );
        },
    },
    ...VtuberCOLUMNS2,
];


const getSortIcon = (sortDirection: any): JSX.Element => {
    switch (sortDirection) {
        case "asc":
            return (
                <svg className="fill-white">
                    <Image src="/content/sort.svg" width={24} height={20} alt="Sort Ascending" className='inline-block' />
                </svg>
            );
        case "desc":
            return <Image src="/content/play_black.svg" width={24} height={20} alt="Sort Descending" className='inline-block' />;
        default:
            return <Image src="/content/movie.svg" width={24} height={20} alt="Default Icon" className='inline-block' />;
    }
};


export const VtuberCOLUMNS4: ColumnDef<any>[] = [
    {
        accessorKey: "VtuberId",
        header: ({ column }) => {
            return (
                <div
                    style={{ flex: "auto", alignItems: "center", cursor: "pointer" }}
                    onClick={column.getToggleSortingHandler()}
                >
                    ID{getSortIcon(column.getIsSorted())}
                </div>
            );
        },
    },
    ...VtuberCOLUMNS2
];
