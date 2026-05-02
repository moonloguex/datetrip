import Link from "next/link"

// 워드마크 전용 로고. 아이콘 없이 타이포그래피만으로 정체성을 표현.
// - font-extrabold (800): 두툼한 무게감으로 brand presence 확보
// - tracking-tight: 자간을 살짝 좁혀서 "데이트립" 글자 덩어리감 강조
// - leading-none: 행간 제거로 헤더 수직 정렬 깨끗하게
//
// size prop으로 헤더용(default)과 로그인 화면용(large) 분기.

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const sizeClass = size === "large" ? "text-3xl" : "text-xl"
  return (
    <Link
      href="/"
      className={`inline-block font-extrabold tracking-tight leading-none ${sizeClass}`}
    >
      데이트립
    </Link>
  )
}
