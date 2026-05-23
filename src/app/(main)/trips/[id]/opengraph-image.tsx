import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const alt = "데이트립 코스"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const trip = await prisma.trip.findUnique({
    where: { id },
    select: {
      title: true,
      region: true,
      tags: true,
      likeCount: true,
      _count: { select: { places: true } },
    },
  })

  if (!trip) {
    return new Response("not found", { status: 404 })
  }

  const [fontBold, fontRegular] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/pretendard/dist/web/static/woff/Pretendard-Bold.woff",
      ),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/pretendard/dist/web/static/woff/Pretendard-Regular.woff",
      ),
    ),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f8f4ff 0%, #fde8e8 100%)",
          padding: 80,
          fontFamily: "Pretendard",
        }}
      >
        {/* 상단 브랜드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#888",
            marginBottom: 60,
            letterSpacing: -1,
          }}
        >
          ✦ 데이트립
        </div>

        {/* 태그 */}
        {trip.tags.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {trip.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "#666",
                  background: "white",
                  padding: "8px 20px",
                  borderRadius: 999,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}

        {/* 코스 제목 */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: -3,
            lineHeight: 1.1,
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          {trip.title.length > 20 ? trip.title.slice(0, 20) + "…" : trip.title}
        </div>

        {/* 메타: 지역 · N곳 · 좋아요 */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 400,
            color: "#555",
            gap: 24,
            letterSpacing: -1,
          }}
        >
          {trip.region && <span>{trip.region}</span>}
          {trip.region && <span>·</span>}
          <span>장소 {trip._count.places}곳</span>
          <span>·</span>
          <span>♥ {trip.likeCount}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: fontBold, weight: 700, style: "normal" },
        { name: "Pretendard", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  )
}
