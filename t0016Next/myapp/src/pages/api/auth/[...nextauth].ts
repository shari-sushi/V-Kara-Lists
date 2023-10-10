import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';
import CredentialsProvider from "next-auth/providers/credentials";

// https://zenn.dev/junnuj/articles/fb0ca45967c6c2
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials`は、サインインページでフォームを生成するために使用されます。
      credentials: {
        username: { label: "ユーザ名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials, req) {
        // `credentials`で定義した`username`、`password`が入っています。
        // ここにロジックを追加して、資格情報からユーザーを検索します。
        // 本来はバックエンドから認証情報を取得するイメージですが、ここでは定数を返しています。
        // const user = await authenticationLogic(credentials?.username, credentials?.password);

        const user = {
          id: "L2",
          name: "guest",
          // email: "jsmith@example.com",
          // role: "admin",
          // backendToken: "backEndAccessToken",
        };

        if (user) {
          // 返されたオブジェクトはすべて、JWT の「user」プロパティに保存されます。
          return user;
        } else {
          // 認証失敗の場合はnullを返却します。
          return null;
        }
      },
    }),
  ],
  pages: {
    // カスタムログインページを追加する。　リダイレクトやimport?とは違う
    signIn: "/auth/signin",
  },

  // 何かのアクションが実行されたタイミングで発火させたい処理
  // jwt、session、signIn、redirectがある？
  callbacks: {
    // JWT が作成・更新された時に実行する https://zenn.dev/thim/articles/7e3fc6a67de764daf50a
    // `jwt()`コールバックは`authorize()`の後に実行されます。
    // `user`に追加したプロパティ`role`と`backendToken`を`token`に設定します。
    // 　　→roloとbackendTokenを名前とidに変更した。

     //sessionの構造的なものを定義
    jwt({ token, user }) {
      if (user) {
        token.MemberId = user.MemberId;
        token.MemberName = user.MemberName;
      }
      return token;
    },
    // `session()`コールバックは`jwt()`の後に実行されます。
    // `token`に追加したプロパティ`role`と`backendToken`を`session`に設定します。
    session({ session, token }) {
      session.user.MemberId = token.MemberId;
      session.user.MemberName = token.MemberName;
      return session;
    },
  },
});


// export default NextAuth({
//   // session: {
//   //   jwt: true,// JWTを使用してセッションを管理（デフォルトはtrue）
//   //   maxAge: 24 * 60 * 60,// セッションの有効期間（秒）
//   //   updateAge: 24 * 60 * 60,// セッションの情報を更新する間隔（秒）
//   // },
//   // callbacks: {
//   //   async session(session, user) {
//   //     // 必要に応じてセッションデータをカスタマイズ
//   //     return session;
//   //   }
//   // },
//   providers: [
//     CredentialsProvider({
//     name: "Credentials",
//       credentials: {
//         username: { label: "ユーザ名", type: "text" },
//         password: { label: "パスワード", type: "password" },
//       },
//     authorize: async (credentials) => {
//        const res = await fetch('http://localhost:8080/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(credentials)
//       });

//       const data = await res.json();
//   // Goサーバーのレスポンスに基づいて認証を判断
//       if (res.ok && data.memberinfo) {
//         // パスワード等のセンシティブな情報を削除
//         delete data.memberinfo.Password;
//         return Promise.resolve(data.memberinfo);
//       } else {
//         return Promise.reject(new Error(data.error || 'Invalid credentials'));
//       }
//     }
//   })
// ],
// });

// .envに記載すること
// NEXTAUTH_URL=http://localhost:3000
// NEXTAUTH_SECRET=mysecretvalue




// 〇Reffect
// 　https://reffect.co.jp/react/next-auth/#session-provider-の設定
// import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';

// export default NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
// });

// // {"github":{"id":"github","name":"GitHub","type":"oauth",
// // "signinUrl":"http://localhost:3000/api/auth/signin/github",
// // "callbackUrl":"http://localhost:3000/api/auth/callback/github"},

// // "google":{"id":"google","name":"Google","type":"oauth",
// // "signinUrl":"http://localhost:3000/api/auth/signin/google",
// // "callbackUrl":"http://localhost:3000/api/auth/callback/google"}}