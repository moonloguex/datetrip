// Next.js 16에서 middleware.ts → proxy.ts.
// 역할: 인증 필요 경로(/trips/new, /my, /trips/[id]/edit)에 대해 로그인 필수 강제.
//       authConfig.callbacks.authorized 가 이를 처리함.
//
// 닉네임 체크는 미들웨어에서 할 수 없음 (Auth.js v5는 미들웨어에서 JWT 쿠키를 재발급하지 않아
// token.nickname이 항상 초기값(null)임). → src/app/(main)/layout.tsx 에서 처리.

import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth(async (_req) => {})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
