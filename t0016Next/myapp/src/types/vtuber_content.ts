import { ListenerId } from './user'

// 初期の遺物　削除したい
export type SingData = {
	vtuber_id: number;
	movie: string;
	url: string;
	singStart: string;
	song: string;
};

//   import { SingData } from './types'

// export type AllJoinData = {
// 	VtuberId: number;
// 	VtuberName: string;
// 	VtuberKana: string;
// 	IntroMovieUrl: string | null;
// 	VtuberInputterId: string;
// 	MovieUrl: string;
// 	MovieTitle: string;
// 	KaraokeId: number;
// 	SingStart: string;
// 	SongName: string;
// 	SongInputterId: string | null;
// }

export type CrudDate = {
	VtuberId: number;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	MovieUrl: string;
	MovieTitle: string;
	KaraokeId: number;
	SingStart: string;
	SongName: string;
}

// export type AllData = {
// 	karaokes: Karaoke[];
// 	movies: Movie[];
// 	vtubers: Vtuber[];
// };

// export type VtuberMovie = {
// 	VtuberID: Vtuber['VtuberId'] //USING
// 	VtuberName: Vtuber['VtuberName']

// 	// Movies:Movie[] ではmapがうまくいかなかった
// 	VtuberId: Movie['VtuberId'];
// 	MovieId: Movie['MovieId'];
// 	MovieUrl: Movie['MovieUrl'];
// 	MovieTitle: Movie['MovieTitle'];
// }


//以下、基礎の型３つ

export type VtuberId = number;
export type KaraokeId = number
export type SongId = number

export type PrimitiveVtuber = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: string;
};

export type PrimitiveMovie = {
	MovieUrl: string;
	MovieTitle: string | null;
	VtuberId: number;
	MovieInputterId: number | null;
};

export type PrimitiveKaraoke = {
	KaraokeId: number;
	MovieUrl: string | null;
	SingStart: string;
	SongName: string | null;
	KaraokeInputterId: number | null;
};

export type PrimitiveOriginalSong = {
	SongID: SongId
	ArtistId: number
	SongName: string
	MovieUrl: string
	ReleseData: string
	SongInputterId: ListenerId;
}


//　画面表示に使う型

export type ReceivedVtuber = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: string;

	Count: number;
	IsFav: boolean;
}

export type ReceivedMovie = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: ListenerId;

	MovieUrl: string;
	MovieTitle: string;
	MovieInputterId: number;

	Count: number;
	IsFav: boolean;

}

export type ReceivedKaraoke = {
	VtuberId: VtuberId;
	VtuberName: string;
	VtuberKana: string;
	IntroMovieUrl: string | null;
	VtuberInputterId: ListenerId;

	MovieUrl: string;
	MovieTitle: string;
	MovieInputterId: number;

	KaraokeId: number;
	SingStart: string;
	SongName: string;
	KaraokeInputterId: number;

	Count: number;
	IsFav: boolean;
}

// export type AllDatePage = {
// 	posts: {
// 		vtubers: ReceivedVtuber[];
// 		vtubers_and_movies: ReceivedMovie[];
// 		vtubers_and_movies_karaokes: ReceivedKaraoke[];
// 	},
// 	checkSignin: boolean;
// }

// export type SelectedDate = {
// 	// alljoindata: AllJoinData[];
// 	// posts: TopPagePosts;
// 	posts: {
// 		vtubers: ReceivedVtuber[];
// 		vtubers_and_movies: ReceivedMovie[];
// 		vtubers_and_movies_karaokes: ReceivedKaraoke[];
// 	},
// 	selectedVtuber: number;
// 	selectedMovie: string;
// 	selectedKaraoke: number;
// }

export type FavoriteKaraoke = {
	MovieUrl: string;
	KaraokeId: number;
}

export type FavoriteMovie = {
	MovieUrl: string;
}