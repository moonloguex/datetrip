// "비슷한 코스" 추천 알고리즘. AI 호출 없음.
//
// getRecommendations(사용자 선호 기반)와 다름:
//   getSimilarTrips는 현재 코스의 태그/지역 기준으로 비슷한 코스를 찾음
//
// 점수 공식:
//   매칭된 태그 수 × 2 + (같은 지역 ? 1 : 0) + log(1 + 좋아요 수)

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type TripWithMetadata = Prisma.TripGetPayload<{
  include: {
    places: { orderBy: { order: "asc" } }
    _count: { select: { likes: true } }
  }
}>

export async function getSimilarTrips(
  tripId: string,
  limit: number = 3,
): Promise<TripWithMetadata[]> {
  const source = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { tags: true, region: true },
  })
  if (!source) return []

  const where: Prisma.TripWhereInput = {
    id: { not: tripId },
    isPublic: true,
    OR: [
      ...(source.tags.length > 0 ? [{ tags: { hasSome: source.tags } }] : []),
      ...(source.region ? [{ region: source.region }] : []),
    ],
  }

  // OR 조건이 없으면 (태그도 없고 지역도 없음) 빈 배열 반환
  if (!source.tags.length && !source.region) return []

  const candidates = await prisma.trip.findMany({
    where,
    include: {
      places: { orderBy: { order: "asc" } },
      _count: { select: { likes: true } },
    },
    take: limit * 5,
  })

  const scored = candidates.map((c) => {
    const tagMatches = c.tags.filter((t) => source.tags.includes(t)).length
    const regionMatch = c.region === source.region ? 1 : 0
    const score = tagMatches * 2 + regionMatch + Math.log(1 + c._count.likes)
    return { trip: c, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.trip)
}
