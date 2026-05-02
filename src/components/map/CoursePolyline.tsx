"use client"

// 한 코스를 지도 위에 그리는 컴포넌트.
// - 폴리라인: 같은 색의 선으로 점들을 순서대로 연결
// - 점: CustomOverlay로 그린 작은 원
// - 호버 툴팁: 점 위에 마우스 올리면 즉시 뜨는 라벨 (네이티브 title 대체)
//
// CircleMarker 대신 CustomOverlay를 쓰는 이유:
//   카카오 SDK의 CircleMarker는 옵션이 제한적이라 색/사이즈를
//   원하는 대로 컨트롤하기 어려움. CSS로 그리는 게 자유도 높음.

import { useEffect } from "react"
import { useKakaoMap } from "@/components/map/KakaoMap"

type CoursePoint = {
  latitude: number
  longitude: number
  order: number
  name: string
}

type Props = Readonly<{
  points: CoursePoint[]
  color: string
}>

export function CoursePolyline({ points, color }: Props) {
  const map = useKakaoMap()

  useEffect(() => {
    if (!map || points.length === 0) return

    const sorted = [...points].sort((a, b) => a.order - b.order)
    const path = sorted.map(
      (p) => new window.kakao.maps.LatLng(p.latitude, p.longitude),
    )

    // 1. 폴리라인
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    })
    polyline.setMap(map)

    // 툴팁용 단일 오버레이 (hover 시 재사용, 한 번에 하나만 보임)
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
      yAnchor: 1.4, // 점 위쪽에 띄움
      zIndex: 10,
    })

    // 2. 점들
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
        transition: transform 0.12s ease;
      `

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

    return () => {
      polyline.setMap(null)
      overlays.forEach((o) => o.setMap(null))
      tooltip.setMap(null)
    }
  }, [map, points, color])

  return null
}
