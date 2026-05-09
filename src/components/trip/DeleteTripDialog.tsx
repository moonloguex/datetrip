"use client"

// 코스 삭제 확인 다이얼로그.
// AlertDialog는 Dialog와 달리 ESC/외부 클릭으로 닫히지 않아 실수 방지에 적합.

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteTrip } from "@/app/actions/trips"

type Props = {
  tripId: string
  tripTitle: string
}

export function DeleteTripDialog({ tripId, tripTitle }: Props) {
  const router = useRouter()
  const [isDeleting, startDeleting] = useTransition()

  function handleDelete() {
    startDeleting(async () => {
      const result = await deleteTrip(tripId)
      if (result.ok) {
        toast.success("코스를 삭제했어요")
        router.push("/")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive"
          />
        }
      >
        삭제
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이 코스를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{tripTitle}</strong> 코스가
            완전히 삭제되며, 좋아요 기록도 함께 사라집니다. 이 작업은 되돌릴
            수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
