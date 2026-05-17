"use client"

// 기존 사용자(닉네임 있고 preferences 비어있음) 대상 1회성 안내 배너.
//
// 노출 조건:
//   서버(홈 페이지): 닉네임 있고 preferences 비어있을 때만 렌더
//   클라이언트(여기): localStorage dismiss 여부 확인
//
// 초기값 true(숨김)로 설정해 hydration mismatch 방지.
// useEffect에서 localStorage를 읽어 실제 값으로 업데이트.

import { useEffect, useState } from "react"
import Link from "next/link"

const DISMISSAL_KEY = "preferenceBannerDismissed"

export function PreferenceBanner() {
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    try {
      setIsDismissed(localStorage.getItem(DISMISSAL_KEY) === "true")
    } catch {
      setIsDismissed(false)
    }
  }, [])

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISSAL_KEY, "true")
    } catch {
      // ignore
    }
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <div className="border-b border-border bg-muted px-4 py-3">
      <div className="mx-auto flex max-w-screen-md items-center gap-3">
        <p className="flex-1 text-sm text-muted-foreground">
          관심사를 알려주시면 추천이 더 정확해져요
        </p>
        <Link
          href="/onboarding/preferences"
          className="text-sm font-medium text-foreground underline underline-offset-2"
        >
          설정하기
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="배너 닫기"
          className="px-1 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
