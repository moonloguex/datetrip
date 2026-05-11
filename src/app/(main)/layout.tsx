import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Header } from "@/components/common/Header"
import { KakaoMapLoader } from "@/components/map/KakaoMapLoader"

// (main) 그룹: 헤더가 있는 일반 페이지용 레이아웃.
//
// 닉네임 체크를 미들웨어가 아닌 여기서 하는 이유:
// 미들웨어는 JWT 쿠키를 그대로 읽는다. Auth.js v5는 서버 컴포넌트에서 auth()를
// 호출할 때 jwt callback이 토큰을 수정해도 쿠키를 재발급하지 않으므로,
// 미들웨어가 보는 token.nickname은 로그인 시점의 값(null)에서 변하지 않는다.
// 반면 이 레이아웃에서 auth()를 호출하면 jwt callback의 DB fallback이 실행되어
// 항상 최신 nickname을 읽을 수 있다.

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user && !session.user.nickname) {
    redirect("/onboarding")
  }

  return (
    <>
      <Header />
      {children}
      <KakaoMapLoader />
    </>
  )
}
