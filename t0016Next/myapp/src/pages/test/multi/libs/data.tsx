import { VtuberId } from "@/types/vtuber_content";
import { ColumnDef } from "@tanstack/react-table";

type ReceivedVtuber = {
    VtuberId: VtuberId;
    VtuberName: string;
    VtuberKana: string;
    IntroMovieUrl: string | null;
    VtuberInputterId: string;
    Count: number;
    IsFav: boolean;
}

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
                    <img src="/content/sort.svg" className='inline-block w-6 h-5' />
                </svg>
            );
        case "desc":
            return <img src="/content/play_black.svg" className='inline-block w-6 h-5' />;
        default:
            return <img src="/content/movie.svg" className='inline-block w-6 h-5' />;
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
