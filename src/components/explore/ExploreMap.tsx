"use client"

// 홈 페이지의 지도 + 코스들을 모아 렌더하는 클라이언트 컴포넌트.
// page.tsx(서버 컴포넌트)에서 trip 데이터를 받아와 props로 전달.

import { useState, useMemo } from "react"
import Link from "next/link"
import { KakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { MapFilterBar } from "@/components/explore/MapFilterBar"
import { TripPreviewCard } from "@/components/explore/TripPreviewCard"
import { getCourseColor } from "@/lib/courseColors"
import { Button } from "@/components/ui/button"

type Trip = {
  id: string
  title: string
  description: string | null
  region: string | null
  likeCount: number
  author: {
    nickname: string | null
  }
  places: Array<{
    latitude: number
    longitude: number
    order: number
    name: string
  }>
}

type Props = Readonly<{
  trips: Trip[]
  mineOnly: boolean
}>

export function ExploreMap({ trips, mineOnly }: Props) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)

  const allPoints = trips.flatMap((trip) =>
    trip.places.map((p) => ({ lat: p.latitude, lng: p.longitude })),
  )

  const selectedTrip = useMemo(
    () => trips.find((t) => t.id === selectedTripId) ?? null,
    [trips, selectedTripId],
  )

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <KakaoMap
        className="h-full w-full"
        fitBoundsPoints={allPoints.length > 0 ? allPoints : undefined}
      >
        {trips.map((trip) => (
          <CoursePolyline
            key={trip.id}
            tripId={trip.id}
            tripTitle={trip.title}
            points={trip.places}
            color={getCourseColor(trip.id)}
            selectedTripId={selectedTripId}
            onSelect={setSelectedTripId}
          />
        ))}
      </KakaoMap>

      {/* 좌상단: 필터 바 */}
      <div className="absolute left-4 top-4 z-10">
        <MapFilterBar />
      </div>

      {/* 우상단: 선택 해제 버튼 (코스 선택 시에만) */}
      {selectedTripId && (
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={() => setSelectedTripId(null)}
            className="rounded-full border bg-background/95 px-4 py-1.5 text-sm font-medium shadow-md backdrop-blur-sm hover:bg-accent"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* 좌하단: 선택된 코스 미리보기 카드 */}
      {selectedTrip && (
        <div className="absolute bottom-4 left-4 z-10">
          <TripPreviewCard
            trip={selectedTrip}
            onClose={() => setSelectedTripId(null)}
          />
        </div>
      )}

      {/* 빈 상태 오버레이 */}
      {trips.length === 0 && <EmptyState mineOnly={mineOnly} />}
    </div>
  )
}

function EmptyState({ mineOnly }: Readonly<{ mineOnly: boolean }>) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="pointer-events-auto flex flex-col items-center gap-4 rounded-2xl border bg-background/95 px-8 py-10 shadow-xl backdrop-blur-sm">
        <p className="text-base font-medium">
          {mineOnly ? "아직 만든 코스가 없어요" : "아직 공개된 코스가 없어요"}
        </p>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          {mineOnly
            ? "마음에 드는 장소들을 모아 첫 코스를 만들어보세요"
            : "첫 코스의 주인공이 되어보세요"}
        </p>
        <Button render={<Link href="/trips/new" />} size="sm" nativeButton={false}>
          + 새 코스 만들기
        </Button>
      </div>
    </div>
  )
}
