export type SingData= {
    unique_id : number;
    movie : string;
    url      : string;
    singStart : string;
    song     : string;
  };

//   import { SingData } from './types'

export type AllColumnsData= {
	streamer_id  : number; //`json:" "s.streamer_id"`
	streamer_name :    string;
	name_kana      :   string;
	self_intro_url  :  string;
	stream_inputer_id: string;
	movie_id       : number
	movie_url      :  string
	movie_title    : string
	song_id        : number
	sing_start     : string | null //nill可にするためのポインタ
	song           : string
	song_inputer_id  : string
};