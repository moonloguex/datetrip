"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { savePreferences } from "@/app/actions/preferences"
import { PREFERENCE_GROUPS } from "@/lib/preference-tags"

interface Props {
  initialTags: string[]
}

export function PreferencesForm({ initialTags }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialTags),
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromOnboarding = searchParams.get("from") === "onboarding"
  const redirectTo = fromOnboarding ? "/" : "/me"

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  function handleSubmit() {
    startTransition(async () => {
      await savePreferences(Array.from(selected))
      window.location.href = redirectTo
    })
  }

  function handleSkip() {
    window.location.href = redirectTo
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">관심사를 알려주세요</h1>
        <p className="text-sm text-muted-foreground">
          2-3개 정도 골라주시면 추천이 더 정확해져요
        </p>
      </header>

      <div className="space-y-6">
        {PREFERENCE_GROUPS.map((group) => (
          <section key={group.id} className="space-y-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const isSelected = selected.has(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle(tag)}
                    aria-pressed={isSelected}
                    className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isPending}
          className="h-11 flex-1 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-accent disabled:opacity-50"
        >
          건너뛰기
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-11 flex-1 rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isPending ? "저장 중..." : "저장하기"}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        선택한 태그는 마이페이지에서 언제든 바꿀 수 있어요
      </p>
    </div>
  )
}
