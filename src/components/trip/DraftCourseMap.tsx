"use client"

import { useMemo } from "react"
import { KakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { COURSE_COLOR_PALETTE } from "@/lib/courseColors"
import type { DraftPlace } from "@/types/place"

type Props = Readonly<{
  places: DraftPlace[]
}>

const DRAFT_COLOR = COURSE_COLOR_PALETTE[0]
const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }

export function DraftCourseMap({ places }: Props) {
  const fitBoundsPoints = useMemo(
    () => places.map((p) => ({ lat: p.latitude, lng: p.longitude })),
    [places],
  )

  const coursePoints = useMemo(
    () =>
      places.map((p, i) => ({
        latitude: p.latitude,
        longitude: p.longitude,
        order: i + 1,
        name: p.name,
      })),
    [places],
  )

  return (
    <KakaoMap
      className="h-full w-full"
      initialCenter={SEOUL_CENTER}
      initialLevel={8}
      fitBoundsPoints={fitBoundsPoints.length > 0 ? fitBoundsPoints : undefined}
    >
      {places.length > 0 && (
        <CoursePolyline
          tripId="draft"
          tripTitle="새 코스"
          points={coursePoints}
          color={DRAFT_COLOR}
          selectedTripId={null}
          onSelect={() => {}}
        />
      )}
    </KakaoMap>
  )
}
