// 임시 인증 동작 확인 페이지
// 로그인 안 됨 → 카카오/구글 로그인 버튼 표시
// 로그인 됨 → 사용자 정보 + 로그아웃 버튼 표시

import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">데이트립 ─ 인증 테스트</h1>

      {session?.user ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
          <p className="text-lg">
            반갑습니다, <strong>{session.user.name ?? session.user.email}</strong> 님!
          </p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button type="submit" variant="outline">로그아웃</Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <form
            action={async () => {
              "use server"
              await signIn("kakao", { redirectTo: "/" })
            }}
          >
            <Button type="submit" className="w-64">
              카카오로 시작하기
            </Button>
          </form>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <Button type="submit" variant="outline" className="w-64">
              구글로 시작하기
            </Button>
          </form>
        </div>
      )}
    </main>
  )
}
