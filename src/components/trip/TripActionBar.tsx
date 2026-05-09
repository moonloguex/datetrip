"use client"

// 코스 상세 페이지의 액션 버튼 묶음 (좋아요/공유/수정/삭제).
// 좋아요는 useOptimistic으로 즉각적 피드백.
// 공유는 navigator.clipboard로 URL 복사.

import Link from "next/link"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DeleteTripDialog } from "@/components/trip/DeleteTripDialog"
import { toggleLike } from "@/app/actions/likes"

type Props = {
  tripId: string
  tripTitle: string
  initialLikeCount: number
  initialLiked: boolean
  isOwner: boolean
}

export function TripActionBar({
  tripId,
  tripTitle,
  initialLikeCount,
  initialLiked,
  isOwner,
}: Props) {
  // 낙관적 상태: 클릭 즉시 반영, 서버 응답 후 실제값으로 동기화
  const [optimisticState, applyOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialLikeCount },
    (current, action: "toggle") => {
      if (action !== "toggle") return current
      return {
        liked: !current.liked,
        count: current.count + (current.liked ? -1 : 1),
      }
    },
  )
  const [isPending, startTransition] = useTransition()

  function handleLike() {
    startTransition(async () => {
      applyOptimistic("toggle")
      const result = await toggleLike(tripId)
      if (!result.ok) {
        // 실패 시 useOptimistic은 자동으로 원래 상태 표시.
        // (transition 내에서 적용된 optimistic은 transition 끝나면 원본 사용)
        toast.error(result.error)
      }
    })
  }

  async function handleShare() {
    const url = `${window.location.origin}/trips/${tripId}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("링크를 복사했어요")
    } catch {
      // 일부 브라우저(특히 비-https 환경)에서 clipboard API 실패 가능
      toast.error("복사에 실패했어요. URL을 직접 복사해주세요.")
    }
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button
        type="button"
        variant={optimisticState.liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isPending}
      >
        {optimisticState.liked ? "♥" : "♡"} 좋아요 {optimisticState.count}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        공유
      </Button>

      {isOwner && (
        <>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/trips/${tripId}/edit`} />}
          >
            수정
          </Button>
          <DeleteTripDialog tripId={tripId} tripTitle={tripTitle} />
        </>
      )}
    </div>
  )
}
