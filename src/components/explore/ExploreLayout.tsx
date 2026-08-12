"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { ExploreMap } from "@/components/explore/ExploreMap"
import { CourseListPanel } from "@/components/explore/CourseListPanel"
import { CourseListItem } from "@/components/explore/CourseListItem"
import { CourseSearchFilter } from "@/components/explore/CourseSearchFilter"
import { CourseTripModal } from "@/components/explore/CourseTripModal"
import { MapCtaBanner } from "@/components/explore/MapCtaBanner"

export type ExploreTrip = {
  id: string
  slug: string | null
  title: string
  description: string | null
  region: string | null
  likeCount: number
  tags: string[]
  authorId: string
  author: { nickname: string | null }
  places: Array<{
    latitude: number
    longitude: number
    order: number
    name: string
    imageUrl: string | null
    address: string
    roadAddress: string | null
    memo: string | null
  }>
}

type Props = {
  trips: ExploreTrip[]
  recommendedIds: string[]
  isAuthenticated: boolean
  mineOnly: boolean
  userId: string | null
  likedTripIds: string[]
  initialTripId?: string
}

const SESSION_KEY = "explore-selected-trip"

export function ExploreLayout({
  trips,
  recommendedIds,
  isAuthenticated,
  mineOnly,
  userId,
  likedTripIds,
  initialTripId,
}: Props) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_KEY) ?? initialTripId ?? null
    }
    return initialTripId ?? null
  })
  const [visibleCount, setVisibleCount] = useState(10)
  const [sheetExpanded, setSheetExpanded] = useState(false)

  // 검색/필터 상태 (클라이언트 사이드)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [drawerTrip, setDrawerTrip] = useState<ExploreTrip | null>(null)

  const likedSet = useMemo(() => new Set(likedTripIds), [likedTripIds])

  // 지도에서 코스 선택 시 → 리스트에서 해당 아이템으로 스크롤
  const listScrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectedTripId || !listScrollRef.current) return
    const el = listScrollRef.current.querySelector(`[data-trip-id="${selectedTripId}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedTripId])

  // 추천 ID 순서 우선, 나머지는 likeCount 내림차순
  const sortedTrips = useMemo(() => {
    if (recommendedIds.length === 0) return trips
    const recOrder = new Map(recommendedIds.map((id, i) => [id, i]))
    return [...trips].sort((a, b) => {
      const aIdx = recOrder.get(a.id) ?? Infinity
      const bIdx = recOrder.get(b.id) ?? Infinity
      if (aIdx !== bIdx) return aIdx - bIdx
      return b.likeCount - a.likeCount
    })
  }, [trips, recommendedIds])

  // 검색 + 태그 클라이언트 필터
  const filteredTrips = useMemo(() => {
    let result = sortedTrips
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.region?.toLowerCase().includes(q) ?? false),
      )
    }
    if (activeTags.size > 0) {
      result = result.filter((t) => t.tags.some((tag) => activeTags.has(tag)))
    }
    return result
  }, [sortedTrips, searchQuery, activeTags])

  // 필터 바뀌면 더 보기 카운트 초기화.
  // effect 대신 렌더 중 이전 값과 비교해 즉시 반영 (React "Adjusting state" 패턴 — 이중 렌더 회피)
  const [prevFilterKey, setPrevFilterKey] = useState({ searchQuery, activeTags })
  if (prevFilterKey.searchQuery !== searchQuery || prevFilterKey.activeTags !== activeTags) {
    setPrevFilterKey({ searchQuery, activeTags })
    setVisibleCount(10)
  }

  const visibleTrips = useMemo(
    () => filteredTrips.slice(0, visibleCount),
    [filteredTrips, visibleCount],
  )

  function selectTrip(id: string) {
    setSelectedTripId(id)
    sessionStorage.setItem(SESSION_KEY, id)
    setSheetExpanded(false)
  }

  function deselectTrip() {
    setSelectedTripId(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  function openDrawer(id: string) {
    const trip = trips.find((t) => t.id === id) ?? null
    setDrawerTrip(trip)
    // 지도에도 선택 반영
    if (trip) selectTrip(id)
  }

  function closeDrawer() {
    setDrawerTrip(null)
  }

  function loadMore() {
    setVisibleCount((prev) => prev + 10)
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const searchFilterNode = (
    <CourseSearchFilter
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTags={activeTags}
      onTagToggle={toggleTag}
      isAuthenticated={isAuthenticated}
    />
  )

  return (
    <>
      {/* 데스크톱: 좌측 리스트 + 우측 지도 */}
      <div className="hidden sm:flex h-[calc(100vh-4rem)]">
        <div className="w-[420px] shrink-0 border-r flex flex-col">
          <CourseListPanel
            trips={visibleTrips}
            selectedTripId={selectedTripId}
            onSelect={selectTrip}
            onDetail={openDrawer}
            total={filteredTrips.length}
            onLoadMore={loadMore}
            searchFilterNode={searchFilterNode}
            listScrollRef={listScrollRef}
          />
        </div>
        <div className="flex-1 relative">
          <ExploreMap
            trips={visibleTrips}
            mineOnly={mineOnly}
            isAuthenticated={isAuthenticated}
            selectedTripId={selectedTripId}
            onSelect={selectTrip}
            onDeselect={deselectTrip}
          />
          {!isAuthenticated && (
            <div className="absolute bottom-4 left-0 right-0 z-10 pointer-events-none">
              <MapCtaBanner />
            </div>
          )}
        </div>
      </div>

      {/* 모바일: 전체 지도 + 하단 시트 */}
      <div className="sm:hidden relative" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="absolute inset-0">
          <ExploreMap
            trips={visibleTrips}
            mineOnly={mineOnly}
            isAuthenticated={isAuthenticated}
            selectedTripId={selectedTripId}
            onSelect={selectTrip}
            onDeselect={deselectTrip}
          />
        </div>

        {!isAuthenticated && (
          <div className="absolute bottom-14 left-0 right-0 z-20 pointer-events-none">
            <MapCtaBanner />
          </div>
        )}

        {/* 하단 시트 */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-background border-t shadow-2xl overflow-hidden transition-[height] duration-300 ${
            sheetExpanded ? "h-[70vh]" : "h-14"
          }`}
        >
          <button
            type="button"
            onClick={() => setSheetExpanded((v) => !v)}
            aria-expanded={sheetExpanded}
            className="flex h-14 w-full shrink-0 items-center justify-between px-4"
          >
            <span className="text-sm font-medium">
              코스 {filteredTrips.length}개
              {activeTags.size > 0 || searchQuery ? ` (필터 적용)` : ""}
            </span>
            <span className="text-xs text-muted-foreground" aria-hidden>
              {sheetExpanded ? "닫기 ▼" : "목록 ▲"}
            </span>
          </button>

          <div className="overflow-y-auto" style={{ height: "calc(70vh - 3.5rem)" }}>
            <div className="px-4 py-3 border-b">
              {searchFilterNode}
            </div>
            {visibleTrips.map((trip) => (
              <CourseListItem
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onSelect={selectTrip}
                onDetail={openDrawer}
              />
            ))}
            {visibleTrips.length < filteredTrips.length && (
              <div className="p-4 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  더 보기 ({visibleTrips.length} / {filteredTrips.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 코스 상세 모달 (인스타그램 스타일) */}
      <CourseTripModal
        trip={drawerTrip}
        userId={userId}
        likedTripIds={likedSet}
        onClose={closeDrawer}
      />
    </>
  )
}
