"use client"

// next-auth/react의 SessionProvider는 클라이언트 컴포넌트이므로 래핑.
// useSession().update()를 클라이언트에서 호출하기 위해 필요.

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
