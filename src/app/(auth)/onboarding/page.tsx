import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { OnboardingForm } from "@/components/auth/OnboardingForm"

// 첫 로그인 후 닉네임 설정 페이지.
// (auth) 그룹 안에 두어 헤더 없는 풀스크린 레이아웃 사용.

export default async function OnboardingPage() {
  const session = await auth()

  // proxy.ts가 이미 처리하지만 안전망으로 한 번 더 체크
  if (!session?.user) {
    redirect("/login")
  }
  if (session.user.nickname) {
    redirect("/")
  }

  return <OnboardingForm />
}
