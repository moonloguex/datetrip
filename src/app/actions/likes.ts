"use server"

// 좋아요 토글 + 카운트 동기화 서버 액션.
//
// 트랜잭션으로 처리하는 이유:
// 1. Like 추가/삭제와 Trip.likeCount 업데이트가 항상 같이 일어나야 일관성 유지
// 2. 동시 요청 시 race condition 방지

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { invalidateRecommendationCache } from "@/lib/recommend"

export type ToggleLikeResult =
  | { ok: true; liked: boolean; likeCount: number }
  | { ok: false; error: string }

export async function toggleLike(tripId: string): Promise<ToggleLikeResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }
  const userId = session.user.id

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_tripId: { userId, tripId } },
      })

      if (existing) {
        await tx.like.delete({
          where: { userId_tripId: { userId, tripId } },
        })
        const updated = await tx.trip.update({
          where: { id: tripId },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true, slug: true },
        })
        return { liked: false, likeCount: updated.likeCount, slug: updated.slug }
      } else {
        await tx.like.create({
          data: { userId, tripId },
        })
        const updated = await tx.trip.update({
          where: { id: tripId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true, slug: true },
        })
        return { liked: true, likeCount: updated.likeCount, slug: updated.slug }
      }
    })

    revalidatePath("/")
    revalidatePath(`/trips/${result.slug ?? tripId}`)
    await invalidateRecommendationCache(userId)

    return { ok: true, liked: result.liked, likeCount: result.likeCount }
  } catch (error) {
    console.error("[toggleLike] error:", error)
    return { ok: false, error: "좋아요 처리에 실패했어요" }
  }
}
