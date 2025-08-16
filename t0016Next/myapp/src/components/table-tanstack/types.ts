import { Table } from "@tanstack/react-table";
import { ReceivedKaraoke } from "@/types/vtuber_content";

export type KaraokeTablePaginationButtonsProps = {
  table: Table<ReceivedKaraoke>;
  maxPageSize: number;
};

export type KaraokeTableFilterInputProps = {
  table: Table<ReceivedKaraoke>;
  accesKey?: string;
};

export type KaraokeTableReturnPostProps = {
  posts: ReceivedKaraoke[];
  setSelectedPost: (arg0: ReceivedKaraoke) => void;
};
