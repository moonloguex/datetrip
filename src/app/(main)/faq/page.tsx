import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "자주 묻는 질문 - 데이트립",
}

const FAQS = [
  {
    q: "데이트립은 어떤 서비스인가요?",
    a: "데이트 코스를 큐레이션하고 공유하는 서비스입니다. AI가 사용자 취향에 맞춰 코스를 추천해드립니다.",
  },
  {
    q: "추천된 코스의 정보가 부정확해요. 어떻게 알리나요?",
    a: "문의하기에서 \"콘텐츠 신고\" 카테고리로 보내주세요. 확인 후 수정 또는 삭제합니다.",
  },
  {
    q: "회원 탈퇴는 어떻게 하나요?",
    a: "마이페이지에서 가능합니다. (구현 예정) 그 전까지는 문의하기로 요청해 주세요.",
  },
  {
    q: "AI 추천은 어떤 정보를 사용하나요?",
    a: "선호 태그(직접 설정)와 좋아요 이력만 사용합니다. 자세한 내용은 개인정보처리방침을 참고해 주세요.",
  },
]

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">자주 묻는 질문</h1>

      <ul className="space-y-6">
        {FAQS.map(({ q, a }) => (
          <li key={q}>
            <p className="mb-1 font-medium">{q}</p>
            <p className="text-gray-600">{a}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
