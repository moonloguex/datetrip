// 홈 페이지. 로그인 여부와 무관하게 지도를 바로 보여준다.
// - 비로그인: 공개 코스 지도 + 코스 리스트 패널 + MapCtaBanner (가입 유도)
// - 로그인: 공개+내 비공개 코스 + 추천 순 정렬 + 좋아요 상태 + 선호 배너

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ExploreLayout } from "@/components/explore/ExploreLayout"
import { PreferenceBanner } from "@/components/PreferenceBanner"
import { getPublicTrips, getLikedTripIds } from "@/lib/trips"
import { getRecommendations } from "@/lib/recommend"

type SearchParams = { mine?: string; trip?: string }

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const [session, params] = await Promise.all([auth(), searchParams])
  const userId = session?.user?.id ?? null

  if (!userId) {
    const trips = await getPublicTrips()
    return (
      <ExploreLayout
        trips={trips}
        recommendedIds={[]}
        isAuthenticated={false}
        mineOnly={false}
        userId={null}
        likedTripIds={[]}
        initialTripId={params.trip}
      />
    )
  }

  const mineOnly = params.mine === "1"
  const [user, trips, recommendations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true, preferences: true },
    }),
    getPublicTrips({ authorIdFilter: mineOnly ? userId : undefined, viewerId: userId }),
    getRecommendations(userId),
  ])

  // 좋아요 상태는 trips 목록을 먼저 알아야 하므로 순차 실행
  const tripIds = trips.map((t) => t.id)
  const likedSet = await getLikedTripIds(userId, tripIds)
  const likedTripIds = Array.from(likedSet)

  const recommendedIds = recommendations.recommendations.map((r) => r.trip.id)
  const showPreferenceBanner = !!user?.nickname && (user.preferences ?? []).length === 0

  return (
    <>
      {showPreferenceBanner && <PreferenceBanner />}
      <ExploreLayout
        trips={trips}
        recommendedIds={recommendedIds}
        isAuthenticated={true}
        mineOnly={mineOnly}
        userId={userId}
        likedTripIds={likedTripIds}
        initialTripId={params.trip}
      />
    </>
  )
}
