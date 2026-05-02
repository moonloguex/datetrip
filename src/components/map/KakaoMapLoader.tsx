"use client"

// 카카오맵 SDK를 페이지에 한 번만 로드하는 컴포넌트.
// (main) 레이아웃에 배치해서, 사용자가 페이지를 이동해도 SDK가 매번 다시 로드되지 않게 함.
//
// autoload=false 옵션:
//   기본값(true)은 스크립트 로드 즉시 SDK가 init되어, 우리가 준비되기 전에 동작.
//   false로 받으면 kakao.maps.load(callback) 호출 시점까지 init이 미뤄짐.
//   비동기 로딩과 SSR을 안전하게 다루려면 false가 필수.
//
// strategy="afterInteractive": 페이지 인터랙티브 후 로드.
//   이 SDK는 즉시 필요하지 않으니 afterInteractive가 적절함.

import Script from "next/script"

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY

export function KakaoMapLoader() {
  if (!KAKAO_JS_KEY) {
    // 빌드/런타임에서 키가 없으면 명확하게 표시 (조용히 실패하지 않도록)
    return (
      <div className="rounded border border-destructive bg-destructive/10 p-3 text-xs text-destructive">
        NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다. .env를 확인하세요.
      </div>
    )
  }

  const sdkUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`

  return <Script src={sdkUrl} strategy="afterInteractive" />
}
