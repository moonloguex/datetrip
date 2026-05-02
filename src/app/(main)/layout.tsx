import { Header } from "@/components/common/Header"

// (main) 그룹: 헤더가 있는 일반 페이지용 레이아웃.
// 괄호 라우트 그룹은 URL에 영향을 주지 않음.

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  )
}
