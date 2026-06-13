// 홈 페이지. 로그인 여부와 무관하게 지도를 바로 보여준다.
// - 비로그인: 공개 코스 지도 + MapCtaBanner (가입 유도)
// - 로그인: 공개+내 비공개 코스 지도 + 추천 스트립 + 선호 배너

import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ExploreMap } from "@/components/explore/ExploreMap"
import { MapCtaBanner } from "@/components/explore/MapCtaBanner"
import { PreferenceBanner } from "@/components/PreferenceBanner"
import { RecommendationFloatingStrip } from "@/components/RecommendationFloatingStrip"
import { RecommendationStripSkeleton } from "@/components/RecommendationStripSkeleton"
import { getPublicTrips } from "@/lib/trips"

type SearchParams = { mine?: string; trip?: string }

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const [session, params] = await Promise.all([auth(), searchParams])
  const userId = session?.user?.id ?? null

  if (!userId) {
    // 비로그인: 공개 코스만, 필터/추천 없음
    const trips = await getPublicTrips()
    return (
      <ExploreMap
        trips={trips}
        mineOnly={false}
        initialTripId={params.trip}
        isAuthenticated={false}
      >
        <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-none">
          <MapCtaBanner />
        </div>
      </ExploreMap>
    )
  }

  // 로그인: 공개 + 내 비공개 코스
  const mineOnly = params.mine === "1"
  const [user, trips] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true, preferences: true },
    }),
    getPublicTrips({ authorIdFilter: mineOnly ? userId : undefined, viewerId: userId }),
  ])

  const showPreferenceBanner =
    !!user?.nickname && (user.preferences ?? []).length === 0

  return (
    <>
      {showPreferenceBanner && <PreferenceBanner />}
      <ExploreMap
        trips={trips}
        mineOnly={mineOnly}
        initialTripId={params.trip}
        isAuthenticated={true}
      >
        <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-none">
          <Suspense fallback={<RecommendationStripSkeleton />}>
            <RecommendationFloatingStrip userId={userId} />
          </Suspense>
        </div>
      </ExploreMap>
    </>
  )
}
