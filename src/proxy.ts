// Next.js 16에서 middleware.ts → proxy.ts로 이름 변경.
// 인증된 사용자만 접근 가능한 경로를 보호합니다.
//
// 주의: edge runtime에서 동작하므로 auth.ts(Prisma adapter 포함) 대신
// auth.config.ts만 사용해야 합니다.

import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // 정적 파일과 API auth 경로는 제외
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
