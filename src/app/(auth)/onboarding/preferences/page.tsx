// 선호 태그 설정 페이지.
//
// 두 가지 진입점을 한 페이지에서 처리:
//   ?from=onboarding → 저장/스킵 시 홈(/)으로 이동
//   쿼리 없음       → 저장/스킵 시 /me로 이동 (마이페이지에서 수정)

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PreferencesForm } from "./Form"

export default async function PreferencesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true },
  })

  return (
    <PreferencesForm initialTags={user?.preferences ?? []} />
  )
}
