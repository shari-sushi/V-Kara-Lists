const ListenerNamePattern = /^[a-z\dあ-ん\-]{3,255}$/i

export const ValidateListenerName = {
  required: true,
  pattern: {
    value: ListenerNamePattern,
    message: "※英数字かな、+-で3文字以上必要です。",
  },
}

const EmailPattern = /^[\w.\-]+@[\w\-]+\.[\w.\-]+$/i

export const ValidateEmail = {
  required: true,
  pattern: {
    value: EmailPattern,
    message: "※emailの形式で入力してください。",
  },
}

// 半角の英数字・記号・スペース（0x20〜0x7E）のみ。APIの ValidateSignup と揃える
const SignupPasswordPattern = /^[\x20-\x7E]{8,64}$/

export const ValidateSignupPassword = {
  required: "※パスワードを入力してください",
  pattern: {
    value: SignupPasswordPattern,
    message: "※半角の英数字・記号・スペースで8〜64文字にしてください",
  },
}

// 旧ルール（4〜20文字）で登録済みのユーザーもログインできるよう、新規登録より緩くする。APIの ValidateLogin と揃える
export const ValidateLoginPassword = {
  required: "※パスワードを入力してください",
  minLength: {
    value: 4,
    message: "※4文字以上で入力してください",
  },
  maxLength: {
    value: 64,
    message: "※64文字以内で入力してください",
  },
}
