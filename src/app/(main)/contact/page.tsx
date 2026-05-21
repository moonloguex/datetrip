import type { Metadata } from "next"
import { ContactForm } from "./Form"

export const metadata: Metadata = {
  title: "문의하기 - 데이트립",
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold">문의하기</h1>
        <p className="text-sm text-gray-500">
          서비스 이용 중 궁금하신 점이나 개선 제안을 보내주세요. 확인 후
          이메일로 회신드립니다.
        </p>
      </header>
      <ContactForm />
    </main>
  )
}
