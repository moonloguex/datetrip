import { Logo } from "@/components/common/Logo"

// (auth) 그룹: 헤더 없는 풀스크린 중앙 정렬 레이아웃.
// 로그인/회원가입 같은 인증 페이지에서 사용.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-10">
        <Logo size="large" />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
