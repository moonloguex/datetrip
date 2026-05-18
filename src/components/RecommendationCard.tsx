// 추천 카드 한 장.
//
// 두 가지 시나리오에서 재사용:
//   - 홈 "오늘의 추천" → reason 있음
//   - 코스 상세 "비슷한 코스" → reason 없음

import Link from "next/link"
import type { Prisma } from "@prisma/client"

type TripWithMetadata = Prisma.TripGetPayload<{
  include: {
    places: { orderBy: { order: "asc" } }
    _count: { select: { likes: true } }
  }
}>

interface Props {
  trip: TripWithMetadata
  reason?: string
}

export function RecommendationCard({ trip, reason }: Props) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="block w-[80vw] max-w-[320px] flex-shrink-0 snap-start"
    >
      <article className="h-full rounded-2xl border bg-card p-4 hover:border-foreground/30 transition-colors">
        {/* 태그 chip */}
        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {trip.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 제목 */}
        <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
          {trip.title}
        </h3>

        {/* 메타 정보 */}
        <p className="text-sm text-muted-foreground mb-3">
          {trip.region && <span>{trip.region} · </span>}
          <span>{trip.places.length}곳</span>
          <span> · ♥ {trip._count.likes}</span>
        </p>

        {/* reason: 있을 때만 표시 */}
        {reason && (
          <p className="text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2 line-clamp-2">
            {reason}
          </p>
        )}
      </article>
    </Link>
  )
}
