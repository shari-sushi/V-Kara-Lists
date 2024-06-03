import { Table } from "@tanstack/react-table";
import { ReceivedKaraoke } from "@/types/vtuber_content";

export type KaraokeTablePagenationButtonsProps = {
    table: Table<ReceivedKaraoke>;
    maxPageSize: number;
}

export type KaraokeTablefilterInputProps = {
    table: Table<ReceivedKaraoke>;
    accesKey?: string;
}

export type FavoriteColumn = {
    count: number
    isFav: boolean
    movie: string
    karaoke: number
}

export type KaraokeTableReturnPostProps = {
    posts: ReceivedKaraoke[];
    handleMovieClickYouTube: (arg0: string, arg1: number) => void;
    setSelectedPost: (arg0: ReceivedKaraoke) => void;
};
