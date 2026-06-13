"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateNickname } from "@/app/actions/account"
import { validateNickname } from "@/lib/nickname"

type Props = {
  initialNickname: string | null
}

export function NicknameEditor({ initialNickname }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialNickname ?? "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const clientValidation = validateNickname(value)
  const canSave = clientValidation.ok && !isPending

  function startEditing() {
    setValue(initialNickname ?? "")
    setError(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setError(null)
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!canSave) return

    setError(null)
    startTransition(async () => {
      const res = await updateNickname(value)
      if (res.ok) {
        setIsEditing(false)
        toast.success("닉네임을 수정했어요")
        router.refresh()
      } else {
        setError(res.error)
      }
    })
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">{initialNickname}</p>
        <Button variant="ghost" size="sm" onClick={startEditing}>
          <Pencil className="size-3.5" />
          수정
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          value={value}
          maxLength={15}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
        />
        <Button
          type="submit"
          size="icon-sm"
          variant="default"
          disabled={!canSave}
          aria-label="저장"
        >
          <Check className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={cancelEditing}
          disabled={isPending}
          aria-label="취소"
        >
          <X className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        한글, 영문, 숫자, 언더스코어(_) · 2-15자
      </p>
      {value.length > 0 && !clientValidation.ok && (
        <p className="text-xs text-destructive">{clientValidation.error}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  )
}
