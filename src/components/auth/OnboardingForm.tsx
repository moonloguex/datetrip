"use client"

// 닉네임 입력 폼. 클라이언트 검증으로 즉각적 피드백.
// 서버 액션에서 한 번 더 검증해서 안전성 확보.

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setNickname } from "@/app/actions/onboarding"
import { validateNickname } from "@/lib/nickname"

export function OnboardingForm() {
  const { update } = useSession()
  const [nicknameInput, setNicknameInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clientValidation = validateNickname(nicknameInput)
  const canSubmit = clientValidation.ok && !isPending

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return

    setError(null)
    startTransition(async () => {
      const result = await setNickname(nicknameInput)
      if (result.ok) {
        // JWT 갱신 후 풀 리로드.
        // update()가 /api/auth/session에 PATCH를 보내 jwt callback(trigger="update")을
        // 실행시켜 DB의 최신 nickname을 JWT 쿠키에 반영한다.
        // 그 뒤 window.location으로 이동해야 미들웨어가 갱신된 JWT를 읽을 수 있음.
        await update()
        window.location.href = "/"
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          데이트립에 오신 걸 환영해요
        </h1>
        <p className="text-sm text-muted-foreground">
          데이트립에서 사용할 닉네임을 정해주세요
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          autoFocus
          value={nicknameInput}
          onChange={(e) => {
            setNicknameInput(e.target.value)
            setError(null)
          }}
          placeholder="예: 코스헌터"
          maxLength={15}
        />
        <p className="text-xs text-muted-foreground">
          한글, 영문, 숫자, 언더스코어(_) 사용 가능 · 2-15자
        </p>

        {/* 클라이언트 검증 실패 메시지 (입력은 했으나 형식 안 맞음) */}
        {nicknameInput.length > 0 && !clientValidation.ok && (
          <p className="text-xs text-destructive">{clientValidation.error}</p>
        )}

        {/* 서버 검증 실패 메시지 (중복 등) */}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      <Button type="submit" disabled={!canSubmit} className="w-full">
        {isPending ? "저장 중..." : "시작하기"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        닉네임은 다른 사용자에게 표시돼요.
        <br />
        실명이나 개인정보가 드러나지 않는 이름을 추천드려요.
      </p>
    </form>
  )
}
