"use client"

// 코스 상세 페이지의 메인 뷰.
// 좌측: 메타 + 장소 리스트
// 우측: 이 코스만 표시한 지도
//
// 좋아요/공유/수정/삭제 버튼은 자리만 만들어둠. 동작은 8-B에서.

import Link from "next/link"
import { KakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { TripActionBar } from "@/components/trip/TripActionBar"
import { getCourseColor } from "@/lib/courseColors"
import type { TripDetail } from "@/lib/trips"

type Props = {
  trip: TripDetail
  isOwner: boolean
  isLiked: boolean
  similarSection?: React.ReactNode
}

export function TripDetailView({ trip, isOwner, isLiked, similarSection }: Readonly<Props>) {
  const color = getCourseColor(trip.id)

  const fitBoundsPoints = trip.places.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
  }))

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-[minmax(420px,2fr)_3fr]">
      {/* 좌측 ─ 정보 패널 */}
      <div className="flex flex-col overflow-y-auto border-r">
        {/* 헤더 영역 */}
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
            tripTitle={trip.title}
            initialLikeCount={trip.likeCount}
            initialLiked={isLiked}
            isOwner={isOwner}
          />
        </div>

        {/* 장소 리스트 */}
        <div className="space-y-3 p-6">
          <h2 className="text-sm font-semibold text-muted-foreground">
            코스 ({trip.places.length}개 장소)
          </h2>
          <ol className="space-y-3">
            {trip.places.map((place, idx) => (
              <li key={place.id} className="rounded-lg border p-4">
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

        {/* 비슷한 코스 (page.tsx에서 서버 컴포넌트로 주입) */}
        {similarSection}
      </div>

      {/* 우측 ─ 지도 */}
      <div className="relative">
        <KakaoMap
          className="h-full w-full"
          fitBoundsPoints={fitBoundsPoints}
        >
          <CoursePolyline
            tripId={trip.id}
            tripTitle={trip.title}
            points={trip.places}
            color={color}
            // 상세 페이지에서는 항상 선택 강조 상태.
            selectedTripId={trip.id}
            onSelect={() => {}}
          />
        </KakaoMap>
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
