"use client"

import type { RefObject } from "react"
import { CourseListItem, type ListTrip } from "@/components/explore/CourseListItem"

type Props = {
  trips: ListTrip[]
  selectedTripId: string | null
  onSelect: (id: string) => void
  onDetail: (id: string) => void
  total: number
  onLoadMore: () => void
  searchFilterNode: React.ReactNode
  listScrollRef: RefObject<HTMLDivElement | null>
}

export function CourseListPanel({
  trips,
  selectedTripId,
  onSelect,
  onDetail,
  total,
  onLoadMore,
  searchFilterNode,
  listScrollRef,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* 조회 필터 영역 */}
      <div className="shrink-0 border-b px-4 py-3">
        {searchFilterNode}
      </div>

      {/* 결과 수 헤더 */}
      <div className="shrink-0 px-4 py-2 border-b">
        <p className="text-xs text-muted-foreground">코스 {total}개</p>
      </div>

      {/* 리스트 */}
      <div ref={listScrollRef} className="flex-1 overflow-y-auto">
        {trips.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            조건에 맞는 코스가 없어요
          </div>
        ) : (
          trips.map((trip) => (
            <CourseListItem
              key={trip.id}
              trip={trip}
              isSelected={selectedTripId === trip.id}
              onSelect={onSelect}
              onDetail={onDetail}
            />
          ))
        )}

        {trips.length < total && (
          <div className="p-4 text-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              더 보기 ({trips.length} / {total})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
