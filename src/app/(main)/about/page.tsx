import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const metadata: Metadata = {
  title: "데이트립 소개",
  description: "좋아하는 장소들을 모아 하나의 데이트 코스로",
}

const ABOUT_CONTENT = `
# 데이트립

좋아하는 장소들을 모아 하나의 데이트 코스로 만들고 공유하는 서비스입니다.

## 이렇게 사용하세요

**마음에 드는 코스를 둘러보세요**  
지도에서 동네별로 큐레이션된 데이트 코스를 살펴볼 수 있습니다.

**내 코스를 만들어보세요**  
"여기 좋아!" 하는 장소들을 모아 나만의 데이트 코스를 만들고, 친구들에게 공유할 수 있어요.

**AI가 코스를 추천해줘요**  
관심 태그를 알려주시면 데이트립이 취향에 맞는 코스를 골라 추천해드립니다.

## 왜 만들었나요

- 데이트할 때마다 "어디 가지?" 검색하는 데 한참 걸렸어요. 한 번 좋았던 코스를 정리해두고, 다른 사람들 코스도 구경할 수 있으면 좋겠다고 생각했습니다.

- 맛집 정보는 많지만 "이 카페 → 저 산책로 → 그 식당" 같이 코스로 묶인 큐레이션은 흔치 않더라고요. 그런 게 모이는 공간이 있으면 좋겠다 싶어 만들기 시작했습니다.

- 나만의 장소, 나만의 코스를 다른 사람과도 공유하고 싶었어요. 데이트립이 그런 공간이 되면 좋겠습니다.

## 만든 사람

김장문

- 낮에는 손으로, 밤에는 AI로 뭔가 만드는 개발자

피드백·문의·"이런 기능 있으면 좋겠다" 같은 의견은 언제든 환영입니다.

문의하기(/contact)로 보내주시거나 moonloguex@gmail.com로 직접 보내주세요.
`

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-sm sm:prose-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{ABOUT_CONTENT}</ReactMarkdown>
    </main>
  )
}