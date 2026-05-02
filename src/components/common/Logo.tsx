import { MapPin } from "lucide-react"
import Link from "next/link"

// 헤더와 로그인 페이지 등에서 재사용되는 브랜드 로고.
// size prop으로 헤더용(작은) / 랜딩용(큰) 두 가지를 한 컴포넌트에서 처리.

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const isLarge = size === "large"
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-bold tracking-tight"
    >
      <MapPin
        className={isLarge ? "h-7 w-7" : "h-5 w-5"}
        // fill로 핀이 솔리드하게 보이도록. 데이트립의 정체성을 살짝 강조.
        fill="currentColor"
        strokeWidth={1.5}
      />
      <span className={isLarge ? "text-2xl" : "text-lg"}>데이트립</span>
    </Link>
  )
}
