"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { PREFERENCE_GROUPS } from "@/lib/preference-tags"

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
  activeTags: Set<string>
  onTagToggle: (tag: string) => void
  isAuthenticated: boolean
}

export function CourseSearchFilter({
  searchQuery,
  onSearchChange,
  activeTags,
  onTagToggle,
  isAuthenticated,
}: Props) {
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
    startTransition(() => {
      router.push(query ? `/?${query}` : "/")
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* 텍스트 검색 */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          aria-label="코스 검색"
          placeholder="코스명, 지역 검색"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-8 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="검색어 지우기"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 태그 필터 */}
      <div className="flex flex-col gap-1.5">
        {PREFERENCE_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-wrap gap-1">
            {group.tags.map((tag) => {
              const active = activeTags.has(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTagToggle(tag)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* 내 코스만 토글 (로그인 사용자만) */}
      {isAuthenticated && (
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-muted-foreground">내 코스만</span>
          <button
            type="button"
            role="switch"
            aria-checked={mineOnly}
            onClick={toggleMineOnly}
            disabled={isPending}
            className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
              mineOnly ? "bg-foreground" : "bg-muted"
            } ${isPending ? "opacity-60" : ""}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
                mineOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* 활성 필터 요약 (태그가 선택됐을 때) */}
      {activeTags.size > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {activeTags.size}개 태그 선택됨
          </span>
          <button
            type="button"
            onClick={() => [...activeTags].forEach(onTagToggle)}
            className="px-1.5 py-0.5 rounded text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  )
}
