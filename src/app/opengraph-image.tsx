import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const runtime = "nodejs"
export const alt = "데이트립 - 좋아하는 곳들을 하나의 코스로"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f4ff 0%, #fde8e8 100%)",
          padding: 80,
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 24,
            letterSpacing: -4,
          }}
        >
          데이트립
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 44,
            fontWeight: 400,
            color: "#555",
            letterSpacing: -1,
            lineHeight: 1.4,
          }}
        >
          <span>좋아하는 곳들을</span>
          <span>하나의 코스로</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 24,
            color: "#888",
            fontWeight: 400,
          }}
        >
          datetrip
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
