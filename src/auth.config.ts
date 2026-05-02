// Auth.js v5 ─ Edge-safe 설정
//
// 이 파일은 proxy.ts(구 middleware.ts)에서 사용됩니다.
// Edge runtime에서는 Prisma 같은 Node.js 전용 라이브러리를 못 쓰기 때문에,
// adapter 없이 providers만 정의하는 부분을 분리합니다.

import type { NextAuthConfig } from "next-auth"
import Kakao from "next-auth/providers/kakao"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ["/trips/new", "/my"]
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      )
      if (isProtected && !isLoggedIn) return false
      return true
    },
  },
} satisfies NextAuthConfig
