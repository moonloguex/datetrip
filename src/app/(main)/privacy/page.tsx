import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "개인정보처리방침 - 데이트립",
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">개인정보처리방침</h1>
      <p className="mb-8 text-sm text-gray-500">최종 업데이트: [날짜]</p>

      <p className="text-gray-600">
        본 페이지는 준비 중입니다. 정식 운영 시작 전 작성 완료 예정입니다.
        궁금한 점은{" "}
        <Link href="/contact" className="underline hover:text-gray-900">
          문의하기
        </Link>
        로 보내주세요.
      </p>
    </main>
  )
}
