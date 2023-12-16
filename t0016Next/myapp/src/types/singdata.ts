// 初期の遺物　削除したい
export type SingData= {
    vtuber_id	:	number;
    movie		:	string;
    url			:	string;
    singStart	:	string;
    song		:	string;
  };

//   import { SingData } from './types'

export type AllJoinData= {
	VtuberId		:	number; 
	VtuberName	:	string;
	VtuberKana		:	string;
	IntroMovieUrl	:	string | null;
	VtuberInputerId	:	string;
	MovieUrl		:	string;
	MovieTitle		:	string;
	KaraokeListId			:	number;
	SingStart		:	string ;
	SongName		:	string;
	SongInputerId	:	string | null;
}

export type CrudDate= {
	VtuberId		:	number; 
	VtuberName	:	string;
	VtuberKana		:	string;
	IntroMovieUrl	:	string | null;
	MovieUrl		:	string;
	MovieTitle		:	string;
	KaraokeListId			:	number;
	SingStart		:	string ;
	SongName		:	string;
}

export type AllData = {
	karaokes: KaraokeList[];
	movies: Movie[];
	vtubers: Vtuber[];
 };

export type VtuberMovie= {
	VtuberID :Vtuber['VtuberId'] //USING
	VtuberName :Vtuber['VtuberName']

	// Movies:Movie[] ではmapがうまくいかなかった
	VtuberId		:	Movie['VtuberId']		; 
	MovieId			:	Movie['MovieId'	];
	MovieUrl		:	Movie['MovieUrl'];
	MovieTitle		:	Movie['MovieTitle'];
}


//以下、基礎の型３つ
export type  Vtuber= {
	VtuberId		:	number; 
	VtuberName		:	string;
	VtuberKana		:	string;
	IntroMovieUrl	:	string | null;
	VtuberInputerId	:	string;
};

export type Movie= {
	VtuberId		:	number; 
	MovieId			:	number;
	MovieUrl		:	string ;	//ExtraVideoIdのために| null削除。他で不整合発生したら再検討
	MovieTitle		:	string | null;
	MovieInputerId	: number|null;
};

export type KaraokeList= {
	MovieUrl				:	string | null;
	KaraokeListId			:	number;
	SingStart				:	string;
	SongName				:	string | null;
	KaraokeListInputerId	:	number | null;
};
