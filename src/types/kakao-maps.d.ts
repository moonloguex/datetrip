// 카카오맵 JavaScript SDK 타입 선언 (수동 정의)
//
// 카카오맵은 공식 @types 패키지가 없어서, 우리가 사용하는 API 표면만 직접 선언함.
// 사용하는 API가 늘어나면 여기에 점진적으로 추가.

// ambient 파일(import/export 없음)에서는 declare global 없이 바로 전역 보강 가능.
interface Window {
  kakao: typeof kakao
}

declare namespace kakao.maps {
  // SDK 로딩 후 콜백에서 사용. autoload=false 옵션과 짝.
  function load(callback: () => void): void

  class LatLng {
    constructor(lat: number, lng: number)
    getLat(): number
    getLng(): number
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions)
    setCenter(latlng: LatLng): void
    getCenter(): LatLng
    setLevel(level: number): void
    getLevel(): number
    setBounds(bounds: LatLngBounds): void
  }

  interface MapOptions {
    center: LatLng
    level: number  // 줌 레벨 (1=최대 확대, 14=최대 축소)
    draggable?: boolean
    scrollwheel?: boolean
  }

  class LatLngBounds {
    constructor()
    extend(latlng: LatLng): void
    isEmpty(): boolean
  }

  class Polyline {
    constructor(options: PolylineOptions)
    setMap(map: Map | null): void
    setOptions(options: Partial<PolylineOptions>): void
  }

  interface PolylineOptions {
    path: LatLng[]
    strokeWeight?: number
    strokeColor?: string
    strokeOpacity?: number
    strokeStyle?: "solid" | "shortdash" | "shortdot" | "shortdashdot" | "longdash" | "longdashdot"
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions)
    setMap(map: Map | null): void
    setPosition(position: LatLng): void
  }

  interface CustomOverlayOptions {
    position: LatLng
    content: string | HTMLElement
    xAnchor?: number
    yAnchor?: number
    zIndex?: number
    clickable?: boolean
  }

  namespace event {
    function addListener(
      target: object,
      type: string,
      handler: (...args: unknown[]) => void,
    ): void
  }
}

