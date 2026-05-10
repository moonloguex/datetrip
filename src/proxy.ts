// Next.js 16에서 middleware.ts → proxy.ts.
// 두 가지 보호 로직:
//   1. 인증 필요 경로(/trips/new, /my, /trips/[id]/edit)는 로그인 필수
//   2. 닉네임 없는 사용자는 /onboarding으로 강제 리다이렉트
//      (단 /onboarding 자체와 /api/auth/* 는 예외)

import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl } = req
  const session = req.auth

  // 정적 파일과 인증 콜백은 통과
  const isAuthApi = nextUrl.pathname.startsWith("/api/auth")
  if (isAuthApi) return

  // 비로그인 사용자는 미들웨어가 따로 막지 않음 (개별 페이지에서 처리)
  if (!session?.user) return

  // 로그인했는데 nickname 없으면 → /onboarding으로 강제
  // 단 /onboarding 자체는 통과시켜야 무한 리다이렉트 방지
  const hasNickname =
    session.user.nickname !== null && session.user.nickname !== undefined
  const isOnboarding = nextUrl.pathname === "/onboarding"

  if (!hasNickname && !isOnboarding) {
    return Response.redirect(new URL("/onboarding", nextUrl))
  }

  // 닉네임 있는데 /onboarding 들어오면 홈으로
  if (hasNickname && isOnboarding) {
    return Response.redirect(new URL("/", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
