// 시드 스크립트.
//
// 핵심 정책 (CLAUDE.md 기준):
//   1. 시스템 큐레이터 유저 1명을 upsert. 모든 시드 코스는 이 유저의 것
//   2. Trip.slug를 PK 삼아 upsert. 좋아요(Like) 보존.
//      큰 변경은 새 slug ("-v2") 사용 → 옛 코스와 좋아요는 그대로 남고 새 코스 시작
//   3. Place는 deleteMany + create 패턴 (장소 리스트 통째 교체).
//      Trip 자체는 유지되므로 likeCount 등 통계 보존
//
// 카카오 API 실패 처리:
//   - 한 장소 검색 실패 → 그 장소만 스킵 + 경고 로그
//   - 한 코스의 유효 장소 < 3 → 그 코스 전체 스킵 + 경고 로그
//   - 종료 시 스킵된 장소·코스 통계 출력
//
// 안전성:
//   - 절대 다른 사용자 데이터를 삭제하지 않음
//   - 시스템 큐레이터 식별은 email 기준 (실제 OAuth 사용자와 충돌 불가)

import { PrismaClient } from "@prisma/client"
import {
  searchKakaoPlace,
  parseKakaoCategory,
  sleep,
} from "../src/lib/kakao-local"
import { SEED_TRIPS, type SeedPlace } from "./seed-data"

const prisma = new PrismaClient()

// 시스템 큐레이터의 sentinel email.
// 실제 OAuth 로그인은 절대 이 이메일로 들어올 수 없으므로 충돌 위험 없음.
const CURATOR_EMAIL = "curator@datetrip.app"
const CURATOR_NICKNAME = "데이트립"
const CURATOR_NAME = "데이트립 큐레이션"

// 카카오 API rate limit 회피 간격 (ms)
const KAKAO_CALL_DELAY = 120

// 한 코스가 유효하려면 최소 이만큼의 장소가 카카오에서 해결되어야 함
const MIN_PLACES_PER_TRIP = 3

interface ResolvedPlace {
  kakaoPlaceId: string
  name: string
  category: string | null
  address: string
  roadAddress: string | null
  phone: string | null
  latitude: number
  longitude: number
  memo: string | null
  order: number
}

async function resolvePlace(
  seedPlace: SeedPlace,
): Promise<ResolvedPlace | null> {
  const kakao = await searchKakaoPlace(seedPlace.name, {
    region: seedPlace.region,
  })
  if (!kakao) return null

  return {
    kakaoPlaceId: kakao.id,
    name: kakao.place_name,
    category: parseKakaoCategory(kakao.category_name),
    address: kakao.address_name,
    roadAddress: kakao.road_address_name || null,
    phone: kakao.phone || null,
    latitude: parseFloat(kakao.y),
    longitude: parseFloat(kakao.x),
    memo: seedPlace.memo || null,
    order: 0, // 호출자가 채움
  }
}

async function upsertCurator() {
  return prisma.user.upsert({
    where: { email: CURATOR_EMAIL },
    update: {
      name: CURATOR_NAME,
      nickname: CURATOR_NICKNAME,
      bio: "데이트립이 직접 큐레이션한 코스",
    },
    create: {
      email: CURATOR_EMAIL,
      name: CURATOR_NAME,
      nickname: CURATOR_NICKNAME,
      bio: "데이트립이 직접 큐레이션한 코스",
    },
  })
}

async function main() {
  console.log("=== 데이트립 시드 시작 ===\n")

  // 1. 시스템 큐레이터 유저 보장
  const curator = await upsertCurator()
  console.log(`✓ 큐레이터 유저 준비: ${curator.nickname} (${curator.id})\n`)

  // 2. 각 시드 코스 처리
  let createdOrUpdatedCount = 0
  let skippedTripCount = 0
  let skippedPlaceCount = 0
  let totalPlaceAttempts = 0

  for (const tripData of SEED_TRIPS) {
    console.log(`▶ ${tripData.title} (${tripData.slug})`)

    // 2-1. 카카오 API로 장소 해결
    const resolved: ResolvedPlace[] = []
    for (const placeData of tripData.places) {
      totalPlaceAttempts++
      const r = await resolvePlace(placeData)
      if (!r) {
        console.warn(`  ⚠ 카카오 검색 실패: "${placeData.name}"`)
        skippedPlaceCount++
      } else {
        resolved.push(r)
      }
      await sleep(KAKAO_CALL_DELAY)
    }

    // 2-2. 최소 장소 수 확인
    if (resolved.length < MIN_PLACES_PER_TRIP) {
      console.warn(
        `  ✗ 코스 스킵: 유효 장소 ${resolved.length}개 < 최소 ${MIN_PLACES_PER_TRIP}개\n`,
      )
      skippedTripCount++
      continue
    }

    // 2-3. order 채우기
    resolved.forEach((p, i) => {
      p.order = i + 1
    })

    // 2-4. slug 기준 upsert
    // 정책: 같은 slug = 같은 코스. update 시 Place는 통째 교체, Trip은 유지(좋아요 보존)
    await prisma.trip.upsert({
      where: { slug: tripData.slug },
      update: {
        title: tripData.title,
        description: tripData.description,
        region: tripData.region,
        tags: tripData.tags,
        places: {
          deleteMany: {},
          create: resolved,
        },
      },
      create: {
        slug: tripData.slug,
        title: tripData.title,
        description: tripData.description,
        region: tripData.region,
        tags: tripData.tags,
        authorId: curator.id,
        places: {
          create: resolved,
        },
      },
    })

    console.log(`  ✓ ${resolved.length}개 장소 적용\n`)
    createdOrUpdatedCount++
  }

  // 3. 요약
  console.log("=== 시드 결과 ===")
  console.log(`✓ 처리된 코스: ${createdOrUpdatedCount} / ${SEED_TRIPS.length}`)
  console.log(`✗ 스킵된 코스: ${skippedTripCount}`)
  console.log(
    `✓ 처리된 장소: ${totalPlaceAttempts - skippedPlaceCount} / ${totalPlaceAttempts}`,
  )
  console.log(`✗ 스킵된 장소: ${skippedPlaceCount}`)
}

main()
  .catch((e) => {
    console.error("시드 실패:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
