"use client"

// 한 코스를 지도 위에 그리는 컴포넌트.
// - 폴리라인: 같은 색의 선으로 점들을 순서대로 연결
// - 점 (CustomOverlay): 같은 색의 작은 원
//
// CircleMarker 대신 CustomOverlay를 쓰는 이유:
//   카카오 SDK의 CircleMarker는 옵션이 제한적이라 색/사이즈를
//   원하는 대로 컨트롤하기 어려움. CSS로 그리는 게 자유도 높음.
//
// useEffect cleanup으로 컴포넌트 unmount 시 지도에서 제거 (memory leak 방지).

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

    // order 기준으로 정렬 보장 (DB에서 이미 정렬해서 받지만 안전을 위해)
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
      `
      dot.title = `${point.order}. ${point.name}`

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
    }
  }, [map, points, color])

  return null
}
