import { prisma } from "@/lib/prisma"

export type TripWithPlaces = Awaited<ReturnType<typeof getPublicTrips>>[number]

type GetPublicTripsOptions = {
  // 본인 코스만 필터링하는 경우의 사용자 ID. undefined면 모든 보이는 코스.
  authorIdFilter?: string
  // 현재 로그인 사용자 ID. 본인 비공개 코스를 결과에 포함시키기 위해 사용.
  // undefined면 비공개는 노출되지 않음.
  viewerId?: string
}

export async function getPublicTrips(options: GetPublicTripsOptions = {}) {
  const { authorIdFilter, viewerId } = options

  // 가시성 정책:
  // - 공개 코스는 모두에게 보임
  // - 비공개 코스는 작성자(viewerId === authorId) 본인에게만 보임
  return prisma.trip.findMany({
    where: {
      AND: [
        authorIdFilter ? { authorId: authorIdFilter } : {},
        {
          OR: [
            { isPublic: true },
            ...(viewerId ? [{ authorId: viewerId, isPublic: false }] : []),
          ],
        },
      ],
    },
    include: {
      places: {
        orderBy: { order: "asc" },
      },
      author: {
        select: { id: true, nickname: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

// 단건 코스 조회. 비공개 접근 제어는 호출자(페이지)에서 처리.
export async function getTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      places: {
        orderBy: { order: "asc" },
      },
      author: {
        select: { id: true, nickname: true, image: true },
      },
    },
  })
}

export type TripDetail = NonNullable<Awaited<ReturnType<typeof getTripById>>>

// 현재 사용자가 좋아요 누른 trip ID 집합 (한 번에 fetching).
// 페이지에서 표시할 trip 목록을 알고 있을 때 함께 가져와 N+1 쿼리 방지.
export async function getLikedTripIds(userId: string, tripIds: string[]) {
  if (tripIds.length === 0) return new Set<string>()
  const likes = await prisma.like.findMany({
    where: {
      userId,
      tripId: { in: tripIds },
    },
    select: { tripId: true },
  })
  return new Set(likes.map((l) => l.tripId))
}
