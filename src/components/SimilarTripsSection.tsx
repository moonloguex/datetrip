// 코스 상세 페이지 좌측 패널 하단의 "비슷한 코스" 섹션. 서버 컴포넌트.
//
// - 비로그인 사용자에게도 노출 (현재 코스 기준, 개인 정보 불필요)
// - 결과 0개면 null

import { getSimilarTrips } from "@/lib/similar-trips"
import { RecommendationCard } from "@/components/RecommendationCard"

interface Props {
  tripId: string
}

export async function SimilarTripsSection({ tripId }: Props) {
  const trips = await getSimilarTrips(tripId, 3)
  if (trips.length === 0) return null

  return (
    <section className="border-t px-6 py-6">
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground">비슷한 코스</h2>
      </header>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {trips.map((trip) => (
          <RecommendationCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  )
}
