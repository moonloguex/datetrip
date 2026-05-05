"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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
    const trip = await prisma.trip.create({
      data: {
        title,
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
