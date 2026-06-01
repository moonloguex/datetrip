"use client"

// 한 코스를 지도 위에 그리는 컴포넌트.
//
// 인터랙션 정책:
// - 기본: opacity 0.85, strokeWeight 3
// - 선택됨: opacity 1, strokeWeight 4
// - 다른 코스가 선택된 상태: opacity 0.25 (흐려짐)
// - 클릭(선 또는 점): onSelect 호출

import { useEffect, useRef } from "react"
import { useKakaoMap } from "@/components/map/KakaoMap"

type CoursePoint = {
  latitude: number
  longitude: number
  order: number
  name: string
}

type Props = Readonly<{
  tripId: string
  tripTitle: string
  points: CoursePoint[]
  color: string
  selectedTripId: string | null
  onSelect: (id: string) => void
  activePlaceIndex?: number
  onPlaceSelect?: (idx: number) => void
}>

export function CoursePolyline({
  tripId,
  points,
  color,
  selectedTripId,
  onSelect,
  activePlaceIndex,
  onPlaceSelect,
}: Props) {
  const map = useKakaoMap()
  const polylineRef = useRef<kakao.maps.Polyline | null>(null)
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([])
  const dotsRef = useRef<HTMLDivElement[]>([])
  const tooltipRef = useRef<kakao.maps.CustomOverlay | null>(null)

  // Effect 1: 그리기 (map/points/color 변경 시 재생성)
  useEffect(() => {
    if (!map || points.length === 0) return

    const sorted = [...points].sort((a, b) => a.order - b.order)
    const path = sorted.map(
      (p) => new window.kakao.maps.LatLng(p.latitude, p.longitude),
    )

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    })
    polyline.setMap(map)
    polylineRef.current = polyline

    // 폴리라인 클릭 이벤트
    window.kakao.maps.event.addListener(polyline, "click", () => {
      onSelect(tripId)
    })

    // 툴팁용 단일 오버레이 (hover 시 재사용)
    const tooltipEl = document.createElement("div")
    tooltipEl.style.cssText = `
      background: rgba(20, 20, 22, 0.92);
      color: white;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    `
    const tooltip = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(0, 0),
      content: tooltipEl,
      xAnchor: 0.5,
      yAnchor: 1.4,
      zIndex: 10,
    })
    tooltipRef.current = tooltip

    const dots: HTMLDivElement[] = []
    const overlays = sorted.map((point, idx) => {
      const isStart = idx === 0
      const dotSize = isStart ? 14 : 10

      const dot = document.createElement("div")
      dot.style.cssText = `
        width: ${dotSize}px;
        height: ${dotSize}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.12s ease, opacity 0.18s ease;
      `
      dots.push(dot)

      dot.addEventListener("mouseenter", () => {
        dot.style.transform = "scale(1.4)"
        tooltipEl.textContent = `${point.order}. ${point.name}`
        tooltip.setPosition(
          new window.kakao.maps.LatLng(point.latitude, point.longitude),
        )
        tooltip.setMap(map)
      })
      dot.addEventListener("mouseleave", () => {
        dot.style.transform = "scale(1)"
        tooltip.setMap(null)
      })
      dot.addEventListener("click", () => {
        onSelect(tripId)
        onPlaceSelect?.(idx)
      })

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(point.latitude, point.longitude),
        content: dot,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 2,
      })
      overlay.setMap(map)
      return overlay
    })
    overlaysRef.current = overlays
    dotsRef.current = dots

    return () => {
      polyline.setMap(null)
      overlays.forEach((o) => o.setMap(null))
      tooltip.setMap(null)
      polylineRef.current = null
      overlaysRef.current = []
      dotsRef.current = []
      tooltipRef.current = null
    }
  }, [map, points, color, tripId, onSelect])

  // Effect 2: 선택 상태 반응 (재생성 없이 스타일만 변경)
  useEffect(() => {
    const polyline = polylineRef.current
    const dots = dotsRef.current
    if (!polyline) return

    const isSelected = selectedTripId === tripId
    const isOtherSelected = selectedTripId !== null && !isSelected

    polyline.setOptions({
      strokeWeight: isSelected ? 4 : 3,
      strokeOpacity: isOtherSelected ? 0.25 : 0.85,
    })

    dots.forEach((dot, idx) => {
      dot.style.opacity = isOtherSelected ? "0.25" : "1"

      // 캐러셀 활성 장소 강조
      const isActive = activePlaceIndex === idx
      dot.style.transform = isActive ? "scale(1.6)" : "scale(1)"
      dot.style.border = isActive ? "3px solid white" : "2px solid white"
      dot.style.boxShadow = isActive
        ? "0 0 0 3px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.4)"
        : "0 1px 3px rgba(0,0,0,0.3)"
    })
  }, [selectedTripId, tripId, activePlaceIndex])

  return null
}
