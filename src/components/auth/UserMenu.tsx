"use client"

// dropdown-menu가 클라이언트 인터랙션을 요구하므로 "use client".
// 서버 액션은 props로 받아서 form action에 연결.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  user: {
    nickname: string | null
    email: string | null
    image: string | null
  }
  signOutAction: () => Promise<void>
}

export function UserMenu({ user, signOutAction }: Readonly<Props>) {
  const initial = (user.nickname ?? user.email ?? "?").charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9">
          {user.image && <AvatarImage src={user.image} alt={user.nickname ?? ""} />}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.nickname ?? "사용자"}</p>
          {user.email && (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOutAction} className="w-full">
            <button type="submit" className="w-full cursor-default text-left">
              로그아웃
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
