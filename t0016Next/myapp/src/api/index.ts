import { createKaraokes } from "./karaokes"
import { createVtuber } from "./vtubers"
import { createKaraokeVideo } from "./videos"

export const api = {
  // Vtuber
  CreateVtuber: createVtuber,
  // video
  CreateKaraokeVideo: createKaraokeVideo,
  // Song
  CreateKaraokes: createKaraokes,
}
