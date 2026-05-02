import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { LoginButtons } from "@/components/auth/LoginButtons"

// 이미 로그인된 사용자가 /login에 접근하면 홈으로 보냄.

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect("/")

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          데이트 코스를 큐레이션하고 공유해보세요
        </h1>
        <p className="text-sm text-muted-foreground">
          소셜 계정으로 간편하게 시작할 수 있어요
        </p>
      </div>
      <LoginButtons />
      <p className="text-center text-xs text-muted-foreground">
        로그인 시 데이트립의 이용약관과 개인정보처리방침에 동의하게 됩니다.
      </p>
    </div>
  )
}
