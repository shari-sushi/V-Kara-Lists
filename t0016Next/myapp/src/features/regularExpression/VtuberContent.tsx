import { CrudDate } from '@/types/vtuber_content'

////////////////////////////// crud data //////////////////////////////

/////// create ///////

//////// VtuberName 
const vtuberNamePattern = /^.{2,100}$/;

export const ValidateCreateVtuberName = {
    required: true,
    pattern: {
        value: new RegExp(`(${vtuberNamePattern.source})`),
        message: "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。",
    }
};

//////// VtuberKana
const vtuberKanaPattern = /^[a-z]+(_[a-z]*)?$/;

export const ValidateCreateVtuberKana = {
    required: true,
    pattern: {
        value: new RegExp(`(${vtuberKanaPattern.source})`),
        message: "半角アルファベット小文字および _ １回のみ使用してください。 例: chumu_note, sumeshi",
    },
    minLength: {
        value: 2,
        message: "2文字以上必要です。1文字のVTueber様がいる場合はサイト運営へご連絡ください。"
    },
    maxLength: {
        value: 100,
        message: "文字数が超過しています。"
    }
};


//////// IntroMovieUrl
const introMovieUrlPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9]{11}(&t=[0-9]+[s]?)?$/;

// 変換方法不明のため機能休止中
const AdjustIntroMovieUrl = (input: string) => {
    const match = input.match(/(?:https:\/\/www\.youtube\.com\/watch\?v=)?([a-zA-Z0-9]{11})(&t=[0-9]+)?/); //使うなら要修正
    return match ? `www.youtube.com/watch?v=${match[1]}` : input;
};

export const ValidateCreateIntroMovieUrl = {
    required: false,
    pattern: {
        value: new RegExp(`(${introMovieUrlPattern.source})`),
        // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
        message: "www.youtube.com/watch?v=XxxXxxXxxXx の形式で入力してください。",
        // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    },
};


//////// MovieTitle
const movieTitlePattern = /^.{2,100}$/;

export const ValidateCreateMovieTitle = {
    required: true,
    pattern: {
        value: new RegExp(`(${movieTitlePattern.source})`),
        message: "動画タイトルを修正してください。(文字数エラー)",
    }
};


//////// MovieUrl
const MovieUrlPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9]{11}$/;
// const VideoIdPattern = /^[a-zA-Z0-9]{11}$/;

// 変換方法不明のため機能休止中
const AdjustMovieUrl = (input: string) => {
    const match = input.match(/(?:https:\/\/www\.youtube\.com\/watch\?v=)?([a-zA-Z0-9]{11})/);
    return match ? `www.youtube.com/watch?v=${match[1]}` : input;
};

export const ValidateCreateMovieUrl = {
    required: true,
    pattern: {
        value: new RegExp(`(${MovieUrlPattern.source})`),
        // value: new RegExp(`(${YouTubeUrlPattern.source})|(${VideoIdPattern.source})`),
        message: "www.youtube.com/watch?v=XxxXxxXxxXx の形式で入力してください。",
        // message: "https://www.youtube.com/watch?v=OB8pMKU3uxo \n www.youtube.com/watch?v=OB8pMKU3uxo \n v=OB8pMKU3uxo \n のいずれかの形式で入力してください。",
    }
};


//////// SongName　
const songNamePattern = /^.{2,100}$/;

export const ValidateCreateSongName = {
    required: true,
    pattern: {
        value: new RegExp(`(${songNamePattern.source})`),
        message: "2文字以上必要です。不都合がある場合はサイト運営へご連絡ください。",
    }
};


//////// SingStart
const singStartPattern = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

// 変換方法不明のため機能休止中
const AdjustSingStart = (input: string): string => {
    const match = input.match(`${singStartPattern}`);

    if (match?.length == 0 || match?.length == null) {
        return ""
    } else if (match.length == 3) {
        return input
    } else if (match.length == 2) {
        return "00" + match[1] + match[3];
    } else if (match.length == 1) {
        const number = Number(match[1]);
        const seconds = number % 60;
        if (number > 60 * 60) {
            const minutes = number % 60; //間違ってると思う
            const hours = Math.floor(number / 60 * 60);
            return String(hours) + String(minutes) + String(seconds) // h:m:ssになる恐れあり
        } else if (number > 9) {
        } else if (number > 60) {
            const minutes = Math.floor(number / 60);
            return "00:" + String(minutes) + String(seconds) // hh:m:ssになる恐れあり
        } else if (number > 9) {
            return "00:00:" + String(number)
        } else {
            return "00:00:0" + String(number)
        }
    };
    return ""
}

export const ValidateCreateSingStart = {
    required: true,
    pattern: {
        value: new RegExp(`(${singStartPattern})`),
        message: "hh:mm:ss, mm:ss, ss,のいずれかで入力してください。\n 例: 01:23:45, 25:01, 49 等",
    }
};