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

// slug로 1차 조회. 구 cuid URL 호환을 위해 실패 시 id로 fallback.
export async function getTripBySlug(slugOrId: string) {
  // Next.js 16 App Router는 한글 등 non-ASCII path segment를 percent-encoded 상태로
  // params에 넘길 수 있음. DB slug와 비교 전 decode가 필요.
  const decoded = decodeURIComponent(slugOrId)
  const TRIP_INCLUDE = {
    places: { orderBy: { order: "asc" as const } },
    author: { select: { id: true, nickname: true, image: true } },
  }
  const bySlug = await prisma.trip.findUnique({
    where: { slug: decoded },
    include: TRIP_INCLUDE,
  })
  if (bySlug) return bySlug
  return prisma.trip.findUnique({
    where: { id: decoded },
    include: TRIP_INCLUDE,
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

// 마이페이지 카드용 경량 select. getPublicTrips의 places 전체 fetch를 피한다.
const MY_TRIP_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  region: true,
  likeCount: true,
  isPublic: true,
  _count: { select: { places: true } },
} as const

// 클라이언트 직렬화 가능한 카드 데이터 (Date 제외).
export type MyTripCardData = {
  id: string
  slug: string | null
  title: string
  region: string | null
  likeCount: number
  isPublic: boolean
  placeCount: number
}

// 내가 만든 코스 (공개/비공개 전부), 최신순.
export async function getMyTrips(userId: string): Promise<MyTripCardData[]> {
  const trips = await prisma.trip.findMany({
    where: { authorId: userId },
    select: MY_TRIP_CARD_SELECT,
    orderBy: { createdAt: "desc" },
  })
  return trips.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    region: t.region,
    likeCount: t.likeCount,
    isPublic: t.isPublic,
    placeCount: t._count.places,
  }))
}

// 내가 좋아요한 코스. 타인이 비공개로 전환한 코스는 숨긴다.
export async function getLikedTrips(userId: string): Promise<MyTripCardData[]> {
  const likes = await prisma.like.findMany({
    where: {
      userId,
      trip: { OR: [{ isPublic: true }, { authorId: userId }] },
    },
    orderBy: { createdAt: "desc" },
    select: { trip: { select: MY_TRIP_CARD_SELECT } },
  })
  return likes.map(({ trip: t }) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    region: t.region,
    likeCount: t.likeCount,
    isPublic: t.isPublic,
    placeCount: t._count.places,
  }))
}
