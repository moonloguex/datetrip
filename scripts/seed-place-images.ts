// 검증용: scripts/sample-images/의 이미지들을 Vercel Blob에 업로드하고,
// seongsu-cafe-tour 코스의 장소들에 순서대로 imageUrl을 할당.
//
// 이미지 개수만큼 앞 장소에만 할당 → 나머지는 null 유지 (12-B 폴백 테스트용).
//
// 실행: npx tsx scripts/seed-place-images.ts
// 사전 조건: .env.local에 BLOB_READ_WRITE_TOKEN, DATABASE_URL 필요

import { put } from "@vercel/blob"
import { readFile, readdir } from "node:fs/promises"
import { join, extname } from "node:path"
import { config } from "dotenv"
import { PrismaClient } from "@prisma/client"

config({ path: ".env.local" })

const prisma = new PrismaClient()

const TARGET_TRIP_SLUG = "seongsu-cafe-tour"

async function main() {
  const dir = join(process.cwd(), "scripts/sample-images")
  const allFiles = await readdir(dir)
  const imageFiles = allFiles.filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

  if (imageFiles.length === 0) {
    console.error(
      "scripts/sample-images/에 이미지가 없습니다. jpg/png/webp 파일을 2-3장 넣어주세요.",
    )
    process.exit(1)
  }

  const trip = await prisma.trip.findUnique({
    where: { slug: TARGET_TRIP_SLUG },
    include: { places: { orderBy: { order: "asc" } } },
  })

  if (!trip) {
    console.error(`코스 "${TARGET_TRIP_SLUG}" 를 찾을 수 없습니다.`)
    process.exit(1)
  }

  console.log(
    `코스: ${trip.title} | 장소 ${trip.places.length}개 | 이미지 ${imageFiles.length}장`,
  )

  const count = Math.min(imageFiles.length, trip.places.length)

  for (let i = 0; i < count; i++) {
    const place = trip.places[i]
    const fileName = imageFiles[i]
    const fileBuffer = await readFile(join(dir, fileName))
    const ext = extname(fileName).slice(1).toLowerCase()
    const contentType =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
          ? "image/png"
          : "image/webp"

    const blob = await put(
      `places/${place.id}-${Date.now()}.${ext}`,
      fileBuffer,
      { access: "public", contentType },
    )

    await prisma.place.update({
      where: { id: place.id },
      data: { imageUrl: blob.url },
    })

    console.log(`  ✓ ${place.name} → ${blob.url}`)
  }

  const remaining = trip.places.length - count
  console.log(
    `\n완료. ${count}개 장소에 이미지 할당. 나머지 ${remaining}개는 null 유지 (폴백 테스트용).`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
