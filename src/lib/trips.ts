// Trip 데이터 페칭 헬퍼.
//
// 서버 컴포넌트에서 직접 호출. Route Handler를 따로 만들지 않는 이유:
// - 서버 컴포넌트가 직접 DB 접근하면 네트워크 왕복 1회 절약
// - 타입을 그대로 가져갈 수 있어 안전
// 클라이언트 컴포넌트에서 fetching이 필요해지면 그때 Route Handler 추가.

import { prisma } from "@/lib/prisma"

export type TripWithPlaces = Awaited<ReturnType<typeof getPublicTrips>>[number]

export async function getPublicTrips() {
  return prisma.trip.findMany({
    where: { isPublic: true },
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
