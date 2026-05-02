import { Header } from "@/components/common/Header"

// (main) 그룹: 헤더가 있는 일반 페이지용 레이아웃.
// 괄호 라우트 그룹은 URL에 영향을 주지 않음.
//
// 주의: 홈 페이지는 지도 위주의 화면이라 max-w 제약이 답답할 수 있음.
// 그래서 padding은 페이지 단위에서 직접 제어하고, 여기서는 최소한의 wrapper만 둠.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
