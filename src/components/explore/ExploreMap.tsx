"use client"

// 홈 페이지의 지도 + 코스들을 모아 렌더하는 클라이언트 컴포넌트.
// page.tsx(서버 컴포넌트)에서 trip 데이터를 받아와 props로 전달.

import { KakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { MapFilterBar } from "@/components/explore/MapFilterBar"
import { getCourseColor } from "@/lib/courseColors"

type Trip = {
  id: string
  places: Array<{
    latitude: number
    longitude: number
    order: number
    name: string
  }>
}

type Props = Readonly<{
  trips: Trip[]
}>

export function ExploreMap({ trips }: Props) {
  const allPoints = trips.flatMap((trip) =>
    trip.places.map((p) => ({ lat: p.latitude, lng: p.longitude })),
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
            points={trip.places}
            color={getCourseColor(trip.id)}
          />
        ))}
      </KakaoMap>
      <div className="absolute left-4 top-4 z-10">
        <MapFilterBar />
      </div>
    </div>
  )
}
