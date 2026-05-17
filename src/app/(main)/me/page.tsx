import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function MePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nickname: true, preferences: true },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <main className="mx-auto max-w-screen-sm px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">닉네임</h2>
        <p className="text-sm text-muted-foreground">{user.nickname}</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">관심 태그</h2>
          <Link
            href="/onboarding/preferences"
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            수정
          </Link>
        </div>
        {user.preferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.preferences.map((tag) => (
              <span
                key={tag}
                className="inline-flex h-8 items-center rounded-full bg-secondary px-3 text-sm text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            아직 관심 태그가 없어요.{" "}
            <Link
              href="/onboarding/preferences"
              className="text-foreground underline underline-offset-2"
            >
              설정하기
            </Link>
          </p>
        )}
      </section>
    </main>
  )
}
