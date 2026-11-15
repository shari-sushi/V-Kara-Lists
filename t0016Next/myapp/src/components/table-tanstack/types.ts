import { Table } from "@tanstack/react-table"
import { ReceivedVideoSong } from "@/types/vtuber_content"

export type KaraokeTablePaginationButtonsProps = {
  table: Table<ReceivedVideoSong>
  maxPageSize: number
}

export type KaraokeTableFilterInputProps = {
  table: Table<ReceivedVideoSong>
  accesKey?: string
}

export type KaraokeTableReturnPostProps = {
  posts: ReceivedVideoSong[]
  setSelectedPost: (arg0: ReceivedVideoSong) => void
}
