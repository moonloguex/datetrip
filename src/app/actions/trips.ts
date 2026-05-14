"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateUniqueSlug } from "@/lib/slug"

export type CreateTripInput = {
  title: string
  description?: string
  region?: string
  tags: string[]
  isPublic: boolean
  places: Array<{
    kakaoPlaceId: string
    name: string
    category: string
    address: string
    roadAddress: string
    phone: string
    latitude: number
    longitude: number
    memo?: string
  }>
}

export type CreateTripResult =
  | { ok: true; tripId: string }
  | { ok: false; error: string }

export async function createTrip(
  input: CreateTripInput,
): Promise<CreateTripResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }

  const title = input.title.trim()
  if (!title) {
    return { ok: false, error: "제목을 입력해주세요" }
  }
  if (title.length > 50) {
    return { ok: false, error: "제목은 50자 이하여야 합니다" }
  }
  if (input.places.length < 2) {
    return { ok: false, error: "장소를 2개 이상 추가해주세요" }
  }
  if (input.places.length > 30) {
    return { ok: false, error: "한 코스에는 30개까지 장소를 담을 수 있어요" }
  }
  if (input.tags.length > 5) {
    return { ok: false, error: "태그는 최대 5개입니다" }
  }

  try {
    // slug는 생성 시 한 번만 부여. updateTrip은 URL 안정성 정책상 slug를 변경하지 않음.
    const slug = await generateUniqueSlug(title)

    const trip = await prisma.trip.create({
      data: {
        title,
        slug,
        description: input.description?.trim() || null,
        region: input.region?.trim() || null,
        tags: input.tags,
        isPublic: input.isPublic,
        authorId: session.user.id,
        places: {
          create: input.places.map((place, index) => ({
            kakaoPlaceId: place.kakaoPlaceId,
            name: place.name,
            category: place.category || null,
            address: place.address,
            roadAddress: place.roadAddress || null,
            phone: place.phone || null,
            latitude: place.latitude,
            longitude: place.longitude,
            memo: place.memo?.trim() || null,
            order: index + 1,
          })),
        },
      },
    })

    revalidatePath("/")

    return { ok: true, tripId: trip.id }
  } catch (error) {
    console.error("[createTrip] DB error:", error)
    return { ok: false, error: "저장에 실패했어요. 잠시 후 다시 시도해주세요." }
  }
}

// ──────────────────────────────────────────────────────
// updateTrip
// ──────────────────────────────────────────────────────

export type UpdateTripInput = CreateTripInput & { tripId: string }

export type UpdateTripResult =
  | { ok: true }
  | { ok: false; error: string }

export async function updateTrip(
  input: UpdateTripInput,
): Promise<UpdateTripResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }

  const trip = await prisma.trip.findUnique({
    where: { id: input.tripId },
    select: { authorId: true },
  })
  if (!trip) {
    return { ok: false, error: "코스를 찾을 수 없어요" }
  }
  if (trip.authorId !== session.user.id) {
    return { ok: false, error: "수정 권한이 없어요" }
  }

  const title = input.title.trim()
  if (!title) return { ok: false, error: "제목을 입력해주세요" }
  if (title.length > 50) return { ok: false, error: "제목은 50자 이하여야 합니다" }
  if (input.places.length < 2) {
    return { ok: false, error: "장소를 2개 이상 추가해주세요" }
  }
  if (input.places.length > 30) {
    return { ok: false, error: "한 코스에는 30개까지 장소를 담을 수 있어요" }
  }
  if (input.tags.length > 5) return { ok: false, error: "태그는 최대 5개입니다" }

  // Place를 통째로 삭제 후 재생성하는 이유:
  //   - Diff 로직 복잡도 대비 이득이 작음 (보통 5-10개)
  //   - 정합성 측면에서 더 안전
  //   - Like는 Trip에 묶여있어 Place 교체와 무관하게 보존됨
  try {
    await prisma.$transaction(async (tx) => {
      await tx.place.deleteMany({ where: { tripId: input.tripId } })
      await tx.trip.update({
        where: { id: input.tripId },
        data: {
          title,
          description: input.description?.trim() || null,
          region: input.region?.trim() || null,
          tags: input.tags,
          isPublic: input.isPublic,
          places: {
            create: input.places.map((place, index) => ({
              kakaoPlaceId: place.kakaoPlaceId,
              name: place.name,
              category: place.category || null,
              address: place.address,
              roadAddress: place.roadAddress || null,
              phone: place.phone || null,
              latitude: place.latitude,
              longitude: place.longitude,
              memo: place.memo?.trim() || null,
              order: index + 1,
            })),
          },
        },
      })
    })

    revalidatePath("/")
    revalidatePath(`/trips/${input.tripId}`)

    return { ok: true }
  } catch (error) {
    console.error("[updateTrip] DB error:", error)
    return { ok: false, error: "저장에 실패했어요. 잠시 후 다시 시도해주세요." }
  }
}

// ──────────────────────────────────────────────────────
// deleteTrip
// ──────────────────────────────────────────────────────

export type DeleteTripResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteTrip(tripId: string): Promise<DeleteTripResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { authorId: true },
  })
  if (!trip) {
    return { ok: false, error: "코스를 찾을 수 없어요" }
  }
  if (trip.authorId !== session.user.id) {
    return { ok: false, error: "삭제 권한이 없어요" }
  }

  // Place, Like는 스키마의 onDelete: Cascade로 자동 삭제됨
  try {
    await prisma.trip.delete({ where: { id: tripId } })
    revalidatePath("/")
    return { ok: true }
  } catch (error) {
    console.error("[deleteTrip] DB error:", error)
    return { ok: false, error: "삭제에 실패했어요" }
  }
}
