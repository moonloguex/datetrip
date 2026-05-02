import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/common/Logo"
import { UserMenu } from "@/components/auth/UserMenu"
import { signOutAction } from "@/app/actions/auth"

// 서버 컴포넌트로 두는 이유: auth() 호출이 서버에서 일어나야 하고,
// 세션 정보를 클라이언트로 넘기지 않아도 되어서 보안상 유리.

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Button render={<Link href="/trips/new" />} size="sm" nativeButton={false}>
                + 새 코스
              </Button>
              <UserMenu
                user={{
                  name: session.user.name ?? null,
                  email: session.user.email ?? null,
                  image: session.user.image ?? null,
                }}
                signOutAction={signOutAction}
              />
            </>
          ) : (
            <Button render={<Link href="/login" />} size="sm" variant="outline" nativeButton={false}>
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
