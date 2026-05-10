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
      // OAuth profile에서 우리 User 모델로 매핑되는 부분을 커스터마이징.
      // 기본 profile은 name을 받아오는데, 우리는 본명 저장하지 않으므로 null.
      profile(profile) {
        return {
          id: String(profile.id),
          name: null, // 본명 저장 안 함 (개인정보 최소 수집)
          email: profile.kakao_account?.email ?? null,
          image: profile.properties?.profile_image ?? null,
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: null, // 본명 저장 안 함
          email: profile.email,
          image: profile.picture,
        }
      },
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
    // Edge 미들웨어가 session.user.nickname을 읽을 수 있도록 JWT에서 전달.
    // DB 접근 없이 JWT에 캐시된 값만 사용 (Edge 제약).
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.nickname !== undefined) {
        session.user.nickname = token.nickname as string | null
      }
      return session
    },
  },
} satisfies NextAuthConfig
