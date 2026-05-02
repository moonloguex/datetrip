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
})
