import { PrismaClient } from "@prisma/client"
import { slugify } from "../../src/lib/slug"
import { createId } from "@paralleldrive/cuid2"

const prisma = new PrismaClient()

async function main() {
  const trips = await prisma.trip.findMany({
    where: { slug: null },
    select: { id: true, title: true },
  })

  if (trips.length === 0) {
    console.log("백필 대상 없음")
    return
  }

  // 기존 slug Set을 메모리에 로드 (배치 내 중복 방지)
  const existing = await prisma.trip.findMany({
    where: { slug: { not: null } },
    select: { slug: true },
  })
  const usedSlugs = new Set(existing.map((t) => t.slug!))

  let count = 0
  for (const trip of trips) {
    try {
      let base = slugify(trip.title)
      if (base.length < 2) base = `trip-${createId().slice(0, 8).toLowerCase()}`

      let candidate = base
      let attempts = 0
      while (usedSlugs.has(candidate) && attempts < 5) {
        candidate = `${base}-${createId().slice(0, 6).toLowerCase()}`
        attempts++
      }
      if (usedSlugs.has(candidate)) {
        candidate = `${base}-${Date.now().toString(36)}`
      }

      await prisma.trip.update({ where: { id: trip.id }, data: { slug: candidate } })
      usedSlugs.add(candidate)
      console.log(`✓ ${trip.title} → ${candidate}`)
      count++
    } catch (e) {
      console.error(`✗ ${trip.title} 스킵:`, e)
    }
  }

  console.log(`\n완료: ${count}/${trips.length}개 백필`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
