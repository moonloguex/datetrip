"use client"

// 비로그인 사용자 전용 가입 유도 배너.
// 지도 위에 떠 있는 pill 형태. sessionStorage 기반으로 세션 단위 dismiss.
// pointer-events 정책: 컨테이너 none, 카드만 auto (지도 드래그 통과).

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const DISMISS_KEY = "mapCtaBannerDismissed"

export function MapCtaBanner() {
  // 초기값 true(숨김)로 설정해 hydration mismatch 방지.
  // useEffect에서 sessionStorage를 읽어 실제 값으로 업데이트.
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    // sessionStorage는 서버에 없어 초기 렌더에 포함할 수 없음 — 마운트 후 1회 보정.
    // 정당한 예외: hydration mismatch를 피하려는 브라우저 전용 스토리지 동기화.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDismissed(sessionStorage.getItem(DISMISS_KEY) === "true")
    } catch {
      setIsDismissed(false)
    }
  }, [])

  function handleDismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "true")
    } catch {
      // ignore
    }
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <div className="px-4 pointer-events-none">
      <div className="flex justify-center animate-slide-up">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-full border bg-background/95 px-3 sm:px-4 py-2 shadow-lg backdrop-blur-sm max-w-[calc(100vw-2rem)]">
          <span className="text-dusk-rose text-sm select-none shrink-0">◆</span>
          <p className="text-sm font-medium leading-snug">
            우리만의 코스, 지금 만들어보세요
          </p>
          <Button size="sm" className="shrink-0 min-h-11 sm:min-h-0" nativeButton={false} render={<Link href="/login" />}>
            시작하기
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="배너 닫기"
            className="shrink-0 flex items-center justify-center min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
