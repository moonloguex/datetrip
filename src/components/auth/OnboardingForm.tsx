"use client"

// 닉네임 입력 폼. 클라이언트 검증으로 즉각적 피드백.
// 서버 액션에서 한 번 더 검증해서 안전성 확보.

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setNickname } from "@/app/actions/onboarding"
import { validateNickname } from "@/lib/nickname"

export function OnboardingForm() {
  const router = useRouter()
  const [nickname, setNicknameInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clientValidation = validateNickname(nickname)
  const canSubmit = clientValidation.ok && !isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setError(null)
    startTransition(async () => {
      const result = await setNickname(nickname)
      if (result.ok) {
        // session 갱신을 위해 router.refresh + 홈으로 이동
        router.push("/")
        router.refresh()
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
          value={nickname}
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
        {nickname.length > 0 && !clientValidation.ok && (
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
