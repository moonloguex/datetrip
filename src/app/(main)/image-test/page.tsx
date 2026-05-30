// 12-A 검증 전용 임시 페이지.
// Blob URL이 next/image로 정상 렌더되는지 확인용.
// 12-B 캐러셀 완성 후 삭제.

import Image from "next/image"
import { prisma } from "@/lib/prisma"

export default async function ImageTestPage() {
  const places = await prisma.place.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, name: true, imageUrl: true },
    take: 10,
  })

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-xl font-bold">이미지 렌더 테스트 (임시 · 12-A)</h1>
      <p className="mb-8 text-sm text-gray-500">
        imageUrl이 있는 장소 {places.length}개
      </p>
      {places.length === 0 ? (
        <p className="text-gray-500">
          imageUrl 있는 장소 없음. 시드 스크립트를 먼저 실행하세요.
          <br />
          <code className="text-xs">npx tsx scripts/seed-place-images.ts</code>
        </p>
      ) : (
        <div className="space-y-8">
          {places.map((p) => (
            <div key={p.id}>
              <p className="mb-2 text-sm font-medium">{p.name}</p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={p.imageUrl!}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
