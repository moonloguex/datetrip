// 홈 페이지. 로그인 여부에 따라 다른 컨텐츠를 보여줌.
// - 비로그인: 랜딩 (히어로 + 로그인 CTA)
// - 로그인: 마이페이지 (내 코스 + 좋아요한 코스)

import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { LoginButtons } from "@/components/auth/LoginButtons"

export default async function HomePage() {
  const session = await auth()

  if (!session?.user) {
    return <LandingView />
  }
  return <MyPageView userName={session.user.name ?? "친구"} />
}

// ─────────── 비로그인: 랜딩 ───────────

function LandingView() {
  return (
    <section className="flex flex-col items-center gap-8 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          좋아하는 곳들을
          <br />
          하나의 코스로
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          나만의 데이트 루트를 만들고, 친구들과 공유해보세요.
        </p>
      </div>
      <div className="w-full max-w-xs">
        <LoginButtons />
      </div>
    </section>
  )
}

// ─────────── 로그인: 마이페이지 ───────────

function MyPageView({ userName }: { userName: string }) {
  return (
    <div className="space-y-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          안녕하세요, {userName} 님
        </h1>
        <p className="text-sm text-muted-foreground">
          오늘은 어떤 코스를 만들어볼까요?
        </p>
      </header>

      <Section title="내가 만든 코스">
        {/* TODO: 다음 단계에서 실제 데이터로 교체. 지금은 빈 상태만. */}
        <EmptyState
          message="아직 만든 코스가 없어요"
          action={
            <Button render={<Link href="/trips/new" />} size="sm">
              + 첫 코스 만들기
            </Button>
          }
        />
      </Section>

      <Section title="좋아요한 코스">
        <EmptyState message="마음에 드는 코스를 발견하면 좋아요를 눌러보세요" />
      </Section>
    </div>
  )
}

// ─────────── 작은 헬퍼 컴포넌트 ───────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function EmptyState({
  message,
  action,
}: {
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}
