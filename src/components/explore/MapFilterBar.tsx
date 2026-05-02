"use client"

// 지도 위에 떠있는 필터 바. 이번 단계에서는 UI만 배치하고
// 실제 필터링 로직은 6단계 지도 구현 시 연결.
//
// 두 종류의 필터:
// 1. "내 코스만" 토글 ─ 본인이 만든 코스만 보기
// 2. "카테고리" 셀렉트 ─ 추천 카테고리 (데이트, 가족, 친구 등) 필터
//
// 향후 확장: 지역 필터, 거리 정렬, 좋아요 순 정렬 등.

import { useState } from "react"

export function MapFilterBar() {
  const [showMineOnly, setShowMineOnly] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border bg-background/95 p-1.5 shadow-md backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setShowMineOnly((v) => !v)}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          showMineOnly
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-background hover:bg-accent"
        }`}
      >
        내 코스만
      </button>

      <button
        type="button"
        disabled
        className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground"
        title="다음 단계에서 동작 추가 예정"
      >
        카테고리 ▾
      </button>
    </div>
  )
}
