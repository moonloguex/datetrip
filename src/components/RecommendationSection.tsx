// 홈 페이지의 "오늘의 추천" / "인기 코스" 섹션. 서버 컴포넌트.
//
// - 선호 태그 있음 → "오늘의 추천"
// - 선호 태그 없음 → "인기 코스" (정직한 표현)
// - 추천 0개 → null

import { getRecommendations } from "@/lib/recommend"
import { prisma } from "@/lib/prisma"
import { RecommendationCard } from "@/components/RecommendationCard"

interface Props {
  userId: string
}

export async function RecommendationSection({ userId }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  })

  const hasPreferences = (user?.preferences ?? []).length > 0
  const title = hasPreferences ? "오늘의 추천" : "인기 코스"
  const subtitle = hasPreferences
    ? "관심사에 맞춰 골라봤어요"
    : "많은 분들이 좋아한 코스예요"

  const result = await getRecommendations(userId)
  if (result.recommendations.length === 0) return null

  return (
    <section className="py-6 px-4">
      <header className="mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </header>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {result.recommendations.map((rec) => (
          <RecommendationCard
            key={rec.trip.id}
            trip={rec.trip}
            reason={rec.reason}
          />
        ))}
      </div>
    </section>
  )
}
