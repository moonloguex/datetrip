"use server"

// 선호 태그 저장 서버 액션.
//
// 보안: 인증 필수 + 유효 태그만 통과 (화이트리스트 sanitize).

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PREFERENCE_TAG_SET } from "@/lib/preference-tags"
import { invalidateRecommendationCache } from "@/lib/recommend"

export async function savePreferences(tags: string[]) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("로그인이 필요합니다")
  }

  const validated = Array.from(
    new Set(tags.filter((t) => PREFERENCE_TAG_SET.has(t))),
  )

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferences: validated },
  })

  await invalidateRecommendationCache(session.user.id)

  revalidatePath("/")
  revalidatePath("/me")

  return { success: true, tags: validated }
}
