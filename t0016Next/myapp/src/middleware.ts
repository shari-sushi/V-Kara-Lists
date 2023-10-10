// https://zenn.dev/junnuj/articles/fb0ca45967c6c2

export { default } from "next-auth/middleware";


export const config = {
  matcher: ["/((?!auth).*)"], // /authを除外
};


// middleware.tsはNext.js 12以降で導入された新しい機能
// ページのルーティング前に中間処理を挟むためのもの。
// 保存ディレクトリ"以下"の全ページにに適応される

// リダイレクト先は/api/auth/signinがデフォルト