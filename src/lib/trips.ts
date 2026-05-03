// Trip 데이터 페칭 헬퍼.
//
// 서버 컴포넌트에서 직접 호출. Route Handler를 따로 만들지 않는 이유:
// - 서버 컴포넌트가 직접 DB 접근하면 네트워크 왕복 1회 절약
// - 타입을 그대로 가져갈 수 있어 안전
import { prisma } from "@/lib/prisma"

export type TripWithPlaces = Awaited<ReturnType<typeof getPublicTrips>>[number]

type GetPublicTripsOptions = {
  // 본인 코스만 필터링하는 경우의 사용자 ID. undefined면 모든 공개 코스.
  authorIdFilter?: string
}

export async function getPublicTrips(options: GetPublicTripsOptions = {}) {
  return prisma.trip.findMany({
    where: {
      isPublic: true,
      ...(options.authorIdFilter && { authorId: options.authorIdFilter }),
    },
    include: {
      places: {
        orderBy: { order: "asc" },
      },
      author: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}
