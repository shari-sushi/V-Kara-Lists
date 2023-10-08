export type SingData= {
    unique_id	:	number;
    movie		:	string;
    url			:	string;
    singStart	:	string;
    song		:	string;
  };

export type AllData= {
	StreamerId		:	number; 
	StreamerName	:	string;
	NameKana		:	string;
	SelfIntroUrl	:	string | null;
	StreamInputerId	:	string;
	MovieId			:	number;
	MovieUrl		:	string | null;
	MovieTitle		:	string | null;
	SongId			:	number;
	SingStart		:	string | null;
	Song			:	string | null;
	SongInputerId	:	string | null;
}

export type StreamerMovie= {
	StreamerID :Streamer['StreamerId'] //USING
	StreamerName :Streamer['StreamerName']

	// Movies:Movie[] ではmapがうまくいかなかった
	StreamerId		:	Movie['StreamerId']		; 
	MovieId			:	Movie['MovieId'	];
	MovieUrl		:	Movie['MovieUrl'];
	MovieTitle		:	Movie['MovieTitle'];
}


//以下、基礎の型３つ
export type  Streamer= {
	StreamerId		:	number; 
	StreamerName	:	string;
	NameKana		:	string;
	SelfIntroUrl	:	string | null;
	StreamInputerId	:	string;
};

export type Movie= {
	StreamerId		:	number; 
	MovieId			:	number;
	MovieUrl		:	string | null;
	MovieTitle		:	string | null;
};

export type KaraokeList= {
	MovieUrl		:	string | null;
	SongId			:	number;
	SingStart		:	string | null;
	Song			:	string | null;
	SongInputerId	:	string | null;
}