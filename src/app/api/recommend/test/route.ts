// 추천 결과 디버그 엔드포인트.
//
// 보안:
//   - 인증 필수 (자기 추천만 볼 수 있음)
//   - 다른 사용자 추천 조회 불가
//
// 옵션 쿼리:
//   ?refresh=true → 캐시 무시하고 강제 재생성 (테스트용)

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import {
  getRecommendations,
  invalidateRecommendationCache,
} from "@/lib/recommend"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 },
    )
  }

  const refresh = request.nextUrl.searchParams.get("refresh") === "true"
  if (refresh) {
    await invalidateRecommendationCache(session.user.id)
  }

  try {
    const result = await getRecommendations(session.user.id)

    return NextResponse.json({
      source: result.source,
      cached: result.cached,
      generatedAt: result.generatedAt.toISOString(),
      count: result.recommendations.length,
      recommendations: result.recommendations.map((r) => ({
        tripId: r.trip.id,
        title: r.trip.title,
        slug: r.trip.slug,
        region: r.trip.region,
        tags: r.trip.tags,
        likeCount: r.trip._count.likes,
        placeCount: r.trip.places.length,
        reason: r.reason,
      })),
    })
  } catch (error) {
    console.error("[/api/recommend/test] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
