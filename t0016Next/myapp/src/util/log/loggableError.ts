import axios from "axios"

// axiosのエラーをそのまま console.log に渡すと、リクエストの設定(cookieヘッダの認証トークン)まで
// サーバーのログに出てしまう。原因の調査に要る情報だけに絞ってから出す。
export const toLoggableError = (error: unknown): unknown => {
  if (axios.isAxiosError(error)) {
    return { message: error.message, status: error.response?.status, url: error.config?.url }
  }
  return error
}
