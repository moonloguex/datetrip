"use client"

import { Button } from "@/components/ui/button"
import { signInWithKakao, signInWithGoogle } from "@/app/actions/auth"

// 로그인 페이지에서 사용. 카카오와 구글 두 버튼을 묶어서 노출.

export function LoginButtons() {
  return (
    <div className="flex w-full flex-col gap-2">
      <form action={signInWithKakao}>
        <Button
          type="submit"
          className="h-11 w-full bg-[#FEE500] text-[#181600] hover:bg-[#FDD800]"
        >
          카카오로 시작하기
        </Button>
      </form>
      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" className="h-11 w-full">
          구글로 시작하기
        </Button>
      </form>
    </div>
  )
}
