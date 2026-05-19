// 홈 페이지. 로그인 여부에 따라 다른 컨텐츠를 보여줌.
// - 비로그인: 랜딩 (히어로 + 로그인 CTA)
// - 로그인: 지도 탐색 (필터 바 + 지도)

import { Suspense } from "react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { LoginButtons } from "@/components/auth/LoginButtons"
import { ExploreMap } from "@/components/explore/ExploreMap"
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
  const session = await auth()

  if (!session?.user) {
    return <LandingView />
  }

  const [params, user] = await Promise.all([
    searchParams,
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nickname: true, preferences: true },
    }),
  ])

  const showPreferenceBanner =
    !!user?.nickname && (user.preferences ?? []).length === 0

  return (
    <>
      {showPreferenceBanner && <PreferenceBanner />}
      <ExploreView
        userId={session.user.id}
        mineOnly={params.mine === "1"}
        initialTripId={params.trip}
      />
    </>
  )
}

// ─────────── 비로그인: 랜딩 ───────────

function LandingView() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          좋아하는 곳들을
          <br />
          하나의 코스로
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          나만의 데이트 루트를 만들고, 친구들과 공유해보세요.
        </p>
      </div>
      <div className="w-full max-w-xs">
        <LoginButtons />
      </div>
    </section>
  )
}

// ─────────── 로그인: 지도 탐색 ───────────

async function ExploreView({
  userId,
  mineOnly,
  initialTripId,
}: {
  userId: string
  mineOnly: boolean
  initialTripId?: string
}) {
  const trips = await getPublicTrips({
    authorIdFilter: mineOnly ? userId : undefined,
    viewerId: userId,
  })
  return (
    <ExploreMap trips={trips} mineOnly={mineOnly} initialTripId={initialTripId}>
      <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-none">
        <Suspense fallback={<RecommendationStripSkeleton />}>
          <RecommendationFloatingStrip userId={userId} />
        </Suspense>
      </div>
    </ExploreMap>
  )
}
