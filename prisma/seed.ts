// 개발용 시드 데이터.
//
// 실행 방법: npx prisma db seed
// 멱등성 보장: 매번 실행해도 동일 결과. 기존 데이터를 지우고 새로 삽입하는 방식.
//
// 작성자는 .env의 SEED_AUTHOR_EMAIL로 고정. 없으면 createdAt 기준 첫 사용자로 fallback.
// 같은 사람이 카카오/구글 등 다른 provider로 로그인하면 별개 User가 생기므로,
// SEED_AUTHOR_EMAIL을 명시해야 어떤 계정으로 로그인해도 동일한 작성자를 가리킴.

import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

type SeedPlace = {
  name: string
  category: string
  address: string
  roadAddress: string
  latitude: number
  longitude: number
  memo?: string
}

type SeedTrip = {
  title: string
  description: string
  region: string
  tags: string[]
  places: SeedPlace[]
}

const SEED_TRIPS: SeedTrip[] = [
  {
    title: "성수 카페 투어",
    description: "감성 가득한 성수동 카페 4곳을 돌아보는 코스",
    region: "성수동",
    tags: ["카페", "감성"],
    places: [
      {
        name: "어니언 성수",
        category: "카페",
        address: "서울 성동구 성수동2가 277-135",
        roadAddress: "서울 성동구 아차산로9길 8",
        latitude: 37.5429,
        longitude: 127.0556,
        memo: "넓고 분위기 좋은 시그니처 매장",
      },
      {
        name: "센터커피 성수점",
        category: "카페",
        address: "서울 성동구 성수동2가 333-110",
        roadAddress: "서울 성동구 성수이로 134",
        latitude: 37.5443,
        longitude: 127.0554,
      },
      {
        name: "대림창고",
        category: "카페",
        address: "서울 성동구 성수동2가 322-32",
        roadAddress: "서울 성동구 성수이로 78",
        latitude: 37.5424,
        longitude: 127.0561,
        memo: "옛 창고를 개조한 인더스트리얼 무드",
      },
      {
        name: "블루보틀 성수",
        category: "카페",
        address: "서울 성동구 성수동2가 270-12",
        roadAddress: "서울 성동구 아차산로 7",
        latitude: 37.5447,
        longitude: 127.0557,
      },
    ],
  },
  {
    title: "홍대 야경 데이트",
    description: "해질 무렵부터 시작하는 홍대 야경 코스",
    region: "홍대입구",
    tags: ["야경", "산책"],
    places: [
      {
        name: "어반플랜트 연남",
        category: "카페",
        address: "서울 마포구 연남동 227-15",
        roadAddress: "서울 마포구 동교로51길 35",
        latitude: 37.5615,
        longitude: 126.9266,
        memo: "노을 타이밍에 테라스 자리 추천",
      },
      {
        name: "쩜오족발 본점",
        category: "한식",
        address: "서울 마포구 서교동 326-13",
        roadAddress: "서울 마포구 어울마당로 49",
        latitude: 37.5530,
        longitude: 126.9226,
        memo: "저녁식사",
      },
      {
        name: "망원한강공원 편의점",
        category: "한강",
        address: "서울 마포구 망원동 205",
        roadAddress: "서울 마포구 마포나루길 467",
        latitude: 37.5526,
        longitude: 126.8978,
        memo: "라면 + 야경 마무리",
      },
    ],
  },
  {
    title: "강남 데이트 코스",
    description: "런치부터 디저트까지 도산공원 일대 4곳",
    region: "강남",
    tags: ["맛집", "디저트"],
    places: [
      {
        name: "스시 마쯔모토",
        category: "일식",
        address: "서울 강남구 청담동 88-26",
        roadAddress: "서울 강남구 도산대로67길 23",
        latitude: 37.5251,
        longitude: 127.0478,
        memo: "런치 오마카세 추천",
      },
      {
        name: "도산분식",
        category: "분식",
        address: "서울 강남구 신사동 645-16",
        roadAddress: "서울 강남구 도산대로49길 10",
        latitude: 37.5236,
        longitude: 127.0353,
        memo: "디저트 전 가벼운 산책 겸 분식",
      },
      {
        name: "누데이크 도산",
        category: "디저트",
        address: "서울 강남구 신사동 645-21",
        roadAddress: "서울 강남구 압구정로46길 50",
        latitude: 37.5240,
        longitude: 127.0355,
        memo: "비주얼이 예술인 디저트",
      },
      {
        name: "런던베이글뮤지엄 도산점",
        category: "베이커리",
        address: "서울 강남구 신사동 645-15",
        roadAddress: "서울 강남구 도산대로49길 14",
        latitude: 37.5237,
        longitude: 127.0349,
      },
    ],
  },
]

async function main() {
  // SEED_AUTHOR_EMAIL이 지정되어 있으면 해당 이메일 사용자를 작성자로 사용.
  // 없으면 createdAt 기준 첫 번째 사용자로 fallback (불안정하므로 비권장).
  const seedAuthorEmail = process.env.SEED_AUTHOR_EMAIL

  const author = seedAuthorEmail
    ? await prisma.user.findUnique({ where: { email: seedAuthorEmail } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })

  if (!author) {
    if (seedAuthorEmail) {
      console.error(`❌ SEED_AUTHOR_EMAIL=${seedAuthorEmail} 사용자를 DB에서 찾을 수 없습니다.`)
      console.error(`   먼저 http://localhost:3000 에서 해당 이메일로 로그인 후 다시 시도하세요.`)
    } else {
      console.error("❌ DB에 사용자가 없습니다. 먼저 http://localhost:3000 에서 로그인해주세요.")
    }
    process.exit(1)
  }

  console.log(`✓ 시드 작성자: ${author.name ?? author.email} (${author.id})`)

  // 멱등성: 이 사용자의 기존 코스를 모두 삭제 후 재삽입.
  const deleted = await prisma.trip.deleteMany({
    where: { authorId: author.id },
  })
  console.log(`✓ 기존 코스 ${deleted.count}개 삭제`)

  for (const trip of SEED_TRIPS) {
    await prisma.trip.create({
      data: {
        title: trip.title,
        description: trip.description,
        region: trip.region,
        tags: trip.tags,
        authorId: author.id,
        places: {
          create: trip.places.map((place, index) => ({
            ...place,
            order: index + 1,
          })),
        },
      },
    })
    console.log(`✓ 생성: ${trip.title} (${trip.places.length}개 장소)`)
  }

  console.log("\n✅ 시드 완료")
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
