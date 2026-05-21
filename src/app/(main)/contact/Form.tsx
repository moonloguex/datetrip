"use client"

import { useState, useTransition } from "react"
import { submitInquiry } from "@/app/actions/inquiry"

const CATEGORIES = [
  { value: "general", label: "일반 문의" },
  { value: "bug", label: "버그 신고" },
  { value: "report", label: "콘텐츠 신고" },
  { value: "other", label: "기타" },
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitInquiry({
        email: String(formData.get("email") || ""),
        name: String(formData.get("name") || "") || undefined,
        category: String(formData.get("category") || "general"),
        message: String(formData.get("message") || ""),
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || "전송에 실패했습니다")
      }
    })
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          문의가 접수되었습니다. 입력하신 이메일로 회신드릴게요.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          이메일 *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-10 w-full rounded-md border border-gray-300 px-3"
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          이름 (선택)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="h-10 w-full rounded-md border border-gray-300 px-3"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          문의 유형
        </label>
        <select
          id="category"
          name="category"
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          내용 * (10자 이상)
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-md bg-gray-900 font-medium text-white disabled:opacity-50"
      >
        {isPending ? "전송 중..." : "보내기"}
      </button>
    </form>
  )
}
