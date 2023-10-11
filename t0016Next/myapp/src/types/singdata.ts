export type SingData= {
    unique_id	:	number;
    movie		:	string;
    url			:	string;
    singStart	:	string;
    song		:	string;
  };

//   import { SingData } from './types'

export type AllData= {
	VtuberId		:	number; 
	VtuberName	:	string;
	VtuberKana		:	string;
	SelfIntroUrl	:	string | null;
	VtuberInputerId	:	string;
	MovieId			:	number;
	MovieUrl		:	string | null;
	MovieTitle		:	string | null;
	SongId			:	number;
	SingStart		:	string | null;
	Song			:	string | null;
	SongInputerId	:	string | null;
}

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
	MovieUrl		:	string | null;
	MovieTitle		:	string | null;
	MovieInputerId	: number|null;
};

export type KaraokeList= {
	MovieUrl		:	string | null;
	SongId			:	number;
	SingStart		:	string | null;
	Song			:	string | null;
	SongInputerId	:	string | null;
};
