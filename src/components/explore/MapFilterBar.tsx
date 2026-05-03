"use client"

// URL 쿼리 파라미터(?mine=1) 기반 필터 바.
// useState 대신 URL을 진실의 원천으로 삼음:
// - 새로고침 보존
// - 친구에게 링크 공유 시 동일 화면 재현 가능
// - 서버 컴포넌트(page.tsx)가 searchParams를 받아 DB 쿼리에 바로 반영

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function MapFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const mineOnly = searchParams.get("mine") === "1"

  function toggleMineOnly() {
    const params = new URLSearchParams(searchParams)
    if (mineOnly) {
      params.delete("mine")
    } else {
      params.set("mine", "1")
    }
    const query = params.toString()
    // useTransition으로 감싸면 페이지 갱신이 비차단으로 처리되어
    // 토글 자체는 즉시 반응하면서 데이터는 백그라운드에서 새로 받음.
    startTransition(() => {
      router.push(query ? `/?${query}` : "/")
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border bg-background/95 p-1.5 shadow-md backdrop-blur-sm">
      <button
        type="button"
        onClick={toggleMineOnly}
        disabled={isPending}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          mineOnly
            ? "border-foreground bg-foreground text-background"
            : "border-transparent bg-transparent hover:bg-accent"
        } ${isPending ? "opacity-60" : ""}`}
      >
        내 코스만
      </button>

      <button
        type="button"
        disabled
        className="rounded-full border border-transparent bg-transparent px-4 py-1.5 text-sm text-muted-foreground"
        title="다음 단계에서 동작 추가 예정"
      >
        카테고리 ▾
      </button>
    </div>
  )
}
