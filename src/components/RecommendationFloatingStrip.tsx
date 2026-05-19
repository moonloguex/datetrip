// 지도 위 floating 추천 스트립. 서버 컴포넌트.
//
// pointer-events 정책: 외부 컨테이너는 pointer-events-none(지도 조작 통과),
// 카드 Link만 pointer-events-auto로 활성화.

import Link from "next/link"
import { getRecommendations } from "@/lib/recommend"
import { prisma } from "@/lib/prisma"

interface Props {
  userId: string
}

export async function RecommendationFloatingStrip({ userId }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  })

  const hasPreferences = (user?.preferences ?? []).length > 0
  const label = hasPreferences ? "오늘의 추천" : "인기 코스"

  const result = await getRecommendations(userId)
  if (result.recommendations.length === 0) return null

  return (
    <div className="px-4">
      <div className="flex items-center gap-1.5 mb-2 pointer-events-none">
        <span className="text-xs font-medium text-gray-700 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
          ✦ {label}
        </span>
      </div>

      <div className="overflow-x-auto snap-x snap-mandatory pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 pb-2">
        <div className="flex gap-2 w-max">
          {result.recommendations.map((rec) => (
            <Link
              key={rec.trip.id}
              href={`/trips/${rec.trip.id}`}
              className="w-[240px] sm:w-[280px] flex-shrink-0 snap-start pointer-events-auto"
            >
              <article className="bg-white/95 backdrop-blur rounded-xl shadow-md p-2.5 sm:p-3 hover:bg-white transition-colors">
                <div className="flex flex-wrap gap-1 mb-1">
                  {rec.trip.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[11px] text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">
                    {rec.trip.title}
                  </h3>
                  <span className="text-[11px] text-gray-500 flex-shrink-0">
                    {rec.trip.region && `${rec.trip.region}·`}
                    {rec.trip.places.length}곳
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-1">{rec.reason}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
