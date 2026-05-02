"use client"

// 카카오맵 컴포넌트.
// children으로 받은 마커/폴리라인 컴포넌트들에 map 인스턴스를 context로 전달.
// SDK 로딩은 polling으로 확인 (여러 인스턴스가 동시에 떠도 안전).

import { createContext, useContext, useEffect, useRef, useState } from "react"

type Props = Readonly<{
  initialCenter?: { lat: number; lng: number }
  initialLevel?: number
  // 자동 fitBounds 대상 좌표들. 비어있으면 initialCenter/Level 사용.
  fitBoundsPoints?: Array<{ lat: number; lng: number }>
  className?: string
  children?: React.ReactNode
}>

const KakaoMapContext = createContext<kakao.maps.Map | null>(null)

export function useKakaoMap() {
  return useContext(KakaoMapContext)
}

export function KakaoMap({
  initialCenter = { lat: 37.5665, lng: 126.978 },
  initialLevel = 6,
  fitBoundsPoints,
  className = "",
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [isReady, setIsReady] = useState(false)

  // SDK 로딩 polling
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkSdk = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => setIsReady(true))
        return true
      }
      return false
    }

    if (checkSdk()) return
    const intervalId = setInterval(() => {
      if (checkSdk()) clearInterval(intervalId)
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  // 지도 인스턴스 생성
  useEffect(() => {
    if (!isReady || !containerRef.current || map) return

    const newMap = new window.kakao.maps.Map(containerRef.current, {
      center: new window.kakao.maps.LatLng(initialCenter.lat, initialCenter.lng),
      level: initialLevel,
    })
    setMap(newMap)
  }, [isReady, initialCenter.lat, initialCenter.lng, initialLevel, map])

  // 모든 코스 좌표를 포함하도록 자동 줌 조절
  useEffect(() => {
    if (!map || !fitBoundsPoints || fitBoundsPoints.length === 0) return

    const bounds = new window.kakao.maps.LatLngBounds()
    fitBoundsPoints.forEach((p) => {
      bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng))
    })
    if (!bounds.isEmpty()) {
      map.setBounds(bounds)
    }
  }, [map, fitBoundsPoints])

  return (
    <div className={`relative w-full ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      )}
      {/* map이 준비된 후에만 children을 렌더해서 자식들이 안전하게 map 사용 */}
      {map && (
        <KakaoMapContext.Provider value={map}>
          {children}
        </KakaoMapContext.Provider>
      )}
    </div>
  )
}
