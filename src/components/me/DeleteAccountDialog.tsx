"use client"

import { useTransition } from "react"
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
import { deleteAccount } from "@/app/actions/account"
import { signOutAction } from "@/app/actions/auth"

export function DeleteAccountDialog() {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteAccount()
      if (res.ok) {
        toast.success("탈퇴가 완료되었어요")
        await signOutAction()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-destructive"
          />
        }
      >
        계정 탈퇴
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 탈퇴하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            계정을 삭제하면 작성한 모든 코스와 좋아요 기록이 영구적으로
            사라집니다. 이 작업은 되돌릴 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "탈퇴 중..." : "탈퇴하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
