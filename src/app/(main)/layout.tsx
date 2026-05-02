import { Header } from "@/components/common/Header"
import { KakaoMapLoader } from "@/components/map/KakaoMapLoader"

// (main) 그룹: 헤더가 있는 일반 페이지용 레이아웃.
// 괄호 라우트 그룹은 URL에 영향을 주지 않음.
//
// KakaoMapLoader를 layout에 두는 이유:
// 사용자가 홈 → 다른 페이지 → 홈으로 이동할 때 SDK가 매번 다시 로드되지 않게 하려고.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <KakaoMapLoader />
    </>
  )
}
