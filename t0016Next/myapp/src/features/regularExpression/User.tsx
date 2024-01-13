const ListenerNamePattern = /[a-z\d\-]{3,255}/i;

export const ValidateListenerName = {
    required: true,
    pattern: {
        // value: new RegExp(`(${ListenerNamePattern})`),
        value: ListenerNamePattern,
        message: "nameは3文字以上必要です。大文字、小文字、数字、-+を使えます。"
    }
};

const EmailPattern = /[\w+\-]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]*/i;

export const ValidateEmail = {
    required: true,
    pattern: {
        value: EmailPattern,
        message: "emailの形式で入力してください。"
    }
};

const PasswordPattern = /[a-z\d\-]{4,255}/i;

export const ValidatePassword = {
    required: true,
    pattern: {
        value: PasswordPattern,
        message: "Passwordは4文字以上必要です"
    }
};