import { createVideoSongs } from "./video_songs"
import { createVtuber } from "./vtubers"
import { createVideo } from "./videos"

export const api = {
  // Vtuber
  CreateVtuber: createVtuber,
  // video
  CreateVideo: createVideo,
  // video song
  CreateVideoSongs: createVideoSongs,
}
