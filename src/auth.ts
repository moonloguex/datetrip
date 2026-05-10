// Auth.js v5 ─ 메인 설정 (with Prisma adapter)
//
// 이 파일에서 export하는 auth, signIn, signOut, handlers를
// 서버 컴포넌트, 라우트 핸들러, 서버 액션 등에서 사용합니다.

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  // JWT 전략을 강제하는 이유: database 세션은 매 요청마다 DB 쿼리가 일어나고
  // edge runtime(proxy.ts)에서 동작하지 않습니다. JWT는 stateless라 둘 다 해결.
  ...authConfig,
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 첫 로그인(user 있음) 또는 닉네임 설정 후 강제 갱신(trigger === "update") 시
      // DB에서 nickname을 가져와 JWT에 캐시.
      if (user || trigger === "update") {
        const userId = user?.id ?? token.sub
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { nickname: true },
          })
          token.nickname = dbUser?.nickname ?? null
        }
      }
      return token
    },
    session({ session, token }) {
      // JWT 전략에서 token.sub = user.id. session.user에 id와 nickname을 노출.
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.nickname !== undefined) {
        session.user.nickname = token.nickname as string | null
      }
      return session
    },
  },
})
