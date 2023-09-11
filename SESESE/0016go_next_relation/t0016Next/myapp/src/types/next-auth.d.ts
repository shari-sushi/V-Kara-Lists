// https://zenn.dev/junnuj/articles/fb0ca45967c6c2
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // クライアント側で使用するsession（useSessionから取得するオブジェクト）にプロパティを追加します。
  // ここでは`role`と`backendToken`を追加しています。
  interface Session {
    user: {
      MemberId?: string;
      MemberName?: string;
    } & DefaultSession["user"];
  }
  interface User {
    MemberId?: string;
    MemberName?: string;
  }
}

declare module "next-auth/jwt" {
  // "jwt"コールバックのtokenパラメータに任意のプロパティを追加します。
  interface JWT {
    MemberId?: string;
    MemberName?: string;
  }
}