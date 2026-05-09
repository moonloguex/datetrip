import Link from "next/link"
import { Button } from "@/components/ui/button"

// 비공개 코스 접근, 존재하지 않는 ID 모두 동일하게 표시 (정보 누설 방지).

export default function TripNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">코스를 찾을 수 없어요</h1>
      <p className="text-sm text-muted-foreground">
        삭제됐거나 비공개 코스일 수 있어요
      </p>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        size="sm"
        className="mt-2"
      >
        홈으로 돌아가기
      </Button>
    </div>
  )
}
