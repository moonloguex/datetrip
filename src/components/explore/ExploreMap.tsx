"use client"

import { useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { KakaoMap, useKakaoMap } from "@/components/map/KakaoMap"
import { CoursePolyline } from "@/components/map/CoursePolyline"
import { getCourseColor } from "@/lib/courseColors"
import { Button } from "@/components/ui/button"

type Trip = {
  id: string
  slug: string | null
  title: string
  description: string | null
  region: string | null
  likeCount: number
  tags: string[]
  author: { nickname: string | null }
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
  isAuthenticated: boolean
  selectedTripId: string | null
  onSelect: (id: string) => void
  onDeselect: () => void
}>

export function ExploreMap({ trips, mineOnly, isAuthenticated, selectedTripId, onSelect, onDeselect }: Props) {
  const allPoints = useMemo(
    () => trips.flatMap((trip) => trip.places.map((p) => ({ lat: p.latitude, lng: p.longitude }))),
    [trips],
  )

  const selectedTrip = useMemo(
    () => trips.find((t) => t.id === selectedTripId) ?? null,
    [trips, selectedTripId],
  )

  return (
    <div className="relative h-full w-full">
      <KakaoMap className="h-full w-full">
        <MapViewportController
          selectedTripId={selectedTripId}
          selectedTrip={selectedTrip}
          allPoints={allPoints}
        />
        {trips.map((trip) => (
          <CoursePolyline
            key={trip.id}
            tripId={trip.id}
            tripTitle={trip.title}
            points={trip.places}
            color={getCourseColor(trip.id)}
            selectedTripId={selectedTripId}
            onSelect={onSelect}
          />
        ))}
      </KakaoMap>

      {/* 선택 해제 버튼 */}
      {selectedTripId && (
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={onDeselect}
            className="flex items-center rounded-full border bg-background/95 px-4 min-h-11 sm:min-h-0 sm:py-1.5 text-sm font-medium shadow-md backdrop-blur-sm hover:bg-accent"
          >
            선택 해제
          </button>
        </div>
      )}

      {trips.length === 0 && <EmptyState mineOnly={mineOnly} isAuthenticated={isAuthenticated} />}
    </div>
  )
}

function fitTripBounds(map: kakao.maps.Map, places: Array<{ latitude: number; longitude: number }>) {
  const bounds = new window.kakao.maps.LatLngBounds()
  places.forEach((p) => bounds.extend(new window.kakao.maps.LatLng(p.latitude, p.longitude)))
  if (!bounds.isEmpty()) map.setBounds(bounds)
}

function fitAllPoints(map: kakao.maps.Map, points: Array<{ lat: number; lng: number }>) {
  const bounds = new window.kakao.maps.LatLngBounds()
  points.forEach((p) => bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng)))
  if (!bounds.isEmpty()) map.setBounds(bounds)
}

function MapViewportController({
  selectedTripId,
  selectedTrip,
  allPoints,
}: Readonly<{
  selectedTripId: string | null
  selectedTrip: Trip | null
  allPoints: Array<{ lat: number; lng: number }>
}>) {
  const map = useKakaoMap()
  const savedViewpointRef = useRef<{ lat: number; lng: number; level: number } | null>(null)
  const prevIdRef = useRef<string | null>(null)
  const isInitialMountRef = useRef(true)

  useEffect(() => {
    if (!map) return

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      prevIdRef.current = selectedTripId
      if (selectedTripId !== null && selectedTrip && selectedTrip.places.length > 0) {
        fitTripBounds(map, selectedTrip.places)
      } else {
        fitAllPoints(map, allPoints)
      }
      return
    }

    const prev = prevIdRef.current
    const next = selectedTripId
    prevIdRef.current = next

    if (prev === null && next !== null) {
      const center = map.getCenter()
      savedViewpointRef.current = {
        lat: center.getLat(),
        lng: center.getLng(),
        level: map.getLevel(),
      }
    }

    if (next !== null && selectedTrip && selectedTrip.places.length > 0) {
      fitTripBounds(map, selectedTrip.places)
    }

    if (prev !== null && next === null) {
      if (savedViewpointRef.current) {
        const { lat, lng, level } = savedViewpointRef.current
        map.setCenter(new window.kakao.maps.LatLng(lat, lng))
        map.setLevel(level)
        savedViewpointRef.current = null
      } else {
        fitAllPoints(map, allPoints)
      }
    }
  }, [map, selectedTripId, selectedTrip, allPoints])

  return null
}

function EmptyState({ mineOnly, isAuthenticated }: Readonly<{ mineOnly: boolean; isAuthenticated: boolean }>) {
  const ctaHref = isAuthenticated ? "/trips/new" : "/login"
  const ctaLabel = isAuthenticated ? "+ 새 코스 만들기" : "로그인하고 시작하기"

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
        <Button render={<Link href={ctaHref} />} size="sm" nativeButton={false}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
