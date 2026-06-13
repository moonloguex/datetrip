"use client"

// 코스 상세 페이지의 메인 뷰.
// 레이아웃(모바일 우선 수직 스택):
//   지도 (h-[50vh]) → 이미지 캐러셀 → 정보 패널 (스크롤)
//
// 활성 장소(activeIndex)는 캐러셀과 지도가 공유.
// 캐러셀 스와이프 → 지도 pan + 마커 강조
// 마커 클릭 → 캐러셀 스크롤 (양방향 동기화)

import { useState, useEffect } from "react"
import Link from "next/link"
import { KakaoMap } from "@/components/map/KakaoMap"
import { useKakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { TripActionBar } from "@/components/trip/TripActionBar"
import { CourseImageCarousel } from "@/components/CourseImageCarousel"
import { getCourseColor } from "@/lib/courseColors"
import type { TripDetail } from "@/lib/trips"

type Props = {
  trip: TripDetail
  isOwner: boolean
  isLiked: boolean
  isAuthenticated: boolean
  similarSection?: React.ReactNode
}

// KakaoMap children 안에서 map 인스턴스에 접근해 특정 장소로 이동
function MapPanController({
  activePlace,
}: {
  activePlace: { latitude: number; longitude: number } | undefined
}) {
  const map = useKakaoMap()

  useEffect(() => {
    if (!map || !activePlace) return
    map.setCenter(
      new window.kakao.maps.LatLng(activePlace.latitude, activePlace.longitude),
    )
  }, [map, activePlace])

  return null
}

export function TripDetailView({ trip, isOwner, isLiked, isAuthenticated, similarSection }: Readonly<Props>) {
  const color = getCourseColor(trip.id)
  const [activeIndex, setActiveIndex] = useState(0)

  const fitBoundsPoints = trip.places.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
  }))

  const activePlace = trip.places[activeIndex]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* 지도 */}
      <div className="relative h-[50vh] shrink-0">
        <KakaoMap className="h-full w-full" fitBoundsPoints={fitBoundsPoints}>
          <CoursePolyline
            tripId={trip.id}
            tripTitle={trip.title}
            points={trip.places}
            color={color}
            selectedTripId={trip.id}
            onSelect={() => {}}
            activePlaceIndex={activeIndex}
            onPlaceSelect={setActiveIndex}
          />
          <MapPanController activePlace={activePlace} />
        </KakaoMap>
      </div>

      {/* 캐러셀 */}
      {trip.places.length > 0 && (
        <div className="py-4 border-b bg-background shrink-0">
          <CourseImageCarousel
            places={trip.places.map((p) => ({
              id: p.id,
              name: p.name,
              imageUrl: p.imageUrl ?? null,
              order: p.order,
              memo: p.memo ?? null,
            }))}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
          />
        </div>
      )}

      {/* 정보 패널 */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* 헤더 */}
        <div className="space-y-4 border-b p-6">
          <Link
            href="/"
            className="inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← 돌아가기
          </Link>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div
                className="mt-2 h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <h1 className="text-2xl font-bold tracking-tight">{trip.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>by {trip.author.nickname ?? "익명"}</span>
              <span>·</span>
              <span>{formatRelativeDate(trip.createdAt)}</span>
              {!trip.isPublic && (
                <>
                  <span>·</span>
                  <span className="text-amber-600">비공개</span>
                </>
              )}
            </div>

            {(trip.region || trip.tags.length > 0) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {trip.region && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs">
                    {trip.region}
                  </span>
                )}
                {trip.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent px-2.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {trip.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {trip.description}
            </p>
          )}

          <TripActionBar
            tripId={trip.id}
            tripSlug={trip.slug}
            tripTitle={trip.title}
            initialLikeCount={trip.likeCount}
            initialLiked={isLiked}
            isOwner={isOwner}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* 장소 리스트 */}
        <div className="space-y-3 p-6">
          <h2 className="text-sm font-semibold text-muted-foreground">
            코스 ({trip.places.length}개 장소)
          </h2>
          <ol className="space-y-3">
            {trip.places.map((place, idx) => (
              <li
                key={place.id}
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  activeIndex === idx
                    ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setActiveIndex(idx)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-medium">{place.name}</p>
                      {place.category && (
                        <span className="text-xs text-muted-foreground">
                          {place.category}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {place.roadAddress || place.address}
                    </p>
                    {place.memo && (
                      <p className="border-l-2 pl-2 text-sm leading-relaxed text-muted-foreground">
                        {place.memo}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 비슷한 코스 */}
        {similarSection}
      </div>
    </div>
  )
}

function formatRelativeDate(date: Date): string {
  const now = Date.now()
  const target = new Date(date).getTime()
  const diffSec = Math.floor((now - target) / 1000)

  if (diffSec < 60) return "방금 전"
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}일 전`
  if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400 / 7)}주 전`
  if (diffSec < 86400 * 365) return `${Math.floor(diffSec / 86400 / 30)}달 전`
  return `${Math.floor(diffSec / 86400 / 365)}년 전`
}
