// 홈 페이지. 로그인 여부에 따라 다른 컨텐츠를 보여줌.
// - 비로그인: 랜딩 (히어로 + 로그인 CTA)
// - 로그인: 지도 탐색 (필터 바 + 지도 ─ 6단계에서 진짜 지도로 교체)

import { auth } from "@/auth"
import { LoginButtons } from "@/components/auth/LoginButtons"
import { MapFilterBar } from "@/components/explore/MapFilterBar"
import { KakaoMap } from "@/components/map/KakaoMap"

export default async function HomePage() {
  const session = await auth()

  if (!session?.user) {
    return <LandingView />
  }
  return <ExploreView />
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

function ExploreView() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <KakaoMap className="h-full w-full" />
      <div className="absolute left-4 top-4 z-10">
        <MapFilterBar />
      </div>
    </div>
  )
}
