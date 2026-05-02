"use client"

// 빈 카카오맵을 렌더링하는 컴포넌트.
// SDK 로딩 상태를 polling으로 확인 (Script onLoad 이벤트 대신 polling을 쓰는 이유:
// 동일 페이지에서 여러 인스턴스가 떠도 안전하게 동작하게 하려고).
//
// 6-A 단계: 빈 지도만. 마커/폴리라인은 6-B 단계에서 추가 예정.

import { useEffect, useRef, useState } from "react"

type Props = {
  // 초기 중심 좌표. 기본값은 서울 시청.
  initialCenter?: { lat: number; lng: number }
  // 초기 줌 레벨 (1=최대 확대, 14=최대 축소). 기본값 6 = 서울 전체가 보이는 정도.
  initialLevel?: number
  className?: string
}

export function KakaoMap({
  initialCenter = { lat: 37.5665, lng: 126.978 },
  initialLevel = 6,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const [isReady, setIsReady] = useState(false)

  // SDK 로딩 polling
  // KakaoMapLoader가 비동기로 SDK를 받아오므로, 컴포넌트 마운트 시점에는 아직 없을 수 있음.
  // window.kakao.maps가 등장할 때까지 짧은 간격으로 확인.
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkSdk = () => {
      if (window.kakao?.maps) {
        // autoload=false로 받았으므로 명시적 init 필요.
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
    if (!isReady || !containerRef.current || mapRef.current) return

    mapRef.current = new window.kakao.maps.Map(containerRef.current, {
      center: new window.kakao.maps.LatLng(initialCenter.lat, initialCenter.lng),
      level: initialLevel,
    })
  }, [isReady, initialCenter.lat, initialCenter.lng, initialLevel])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full"
        // 카카오맵은 컨테이너 크기를 명시적으로 잡아줘야 정상 렌더됨.
        // 부모에서 height를 줘야 하니, 사용 시 className으로 h-* 지정.
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted/30 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      )}
    </div>
  )
}
