import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "데이트립 소개",
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">데이트립 소개</h1>

      <p className="mb-8 text-gray-600">
        본 페이지는 준비 중입니다. 궁금한 점은{" "}
        <Link href="/contact" className="underline hover:text-gray-900">
          문의하기
        </Link>
        로 보내주세요.
      </p>
    </main>
  )
}
