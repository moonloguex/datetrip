// Next.js 16에서 middleware.ts → proxy.ts.
// 역할:
//   1. Rate limiting: /api/* 라우트에 IP당 분당 60회 제한 (Upstash, 환경변수 없으면 pass)
//   2. 인증 보호: 인증 필요 경로(/trips/new, /my, /trips/[slug]/edit)에 대해 로그인 필수 강제.
//      authConfig.callbacks.authorized 가 이를 처리함.
//
// 닉네임 체크는 미들웨어에서 할 수 없음 (Auth.js v5는 미들웨어에서 JWT 쿠키를 재발급하지 않아
// token.nickname이 항상 초기값(null)임). → src/app/(main)/layout.tsx 에서 처리.

import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { checkRateLimit } from "@/lib/ratelimit"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const result = await checkRateLimit(ip)

    if (!result.success) {
      return NextResponse.json(
        { error: "요청 한도 초과. 잠시 후 다시 시도해주세요." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(result.remaining),
            "X-RateLimit-Reset": String(result.reset),
          },
        },
      )
    }
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
