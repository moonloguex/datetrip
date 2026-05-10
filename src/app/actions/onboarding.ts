"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { validateNickname } from "@/lib/nickname"

export type SetNicknameResult =
  | { ok: true }
  | { ok: false; error: string }

export async function setNickname(input: string): Promise<SetNicknameResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }

  // 클라이언트 검증을 신뢰하지 않음. 서버에서 다시 검증.
  const validation = validateNickname(input)
  if (!validation.ok) {
    return { ok: false, error: validation.error }
  }

  const trimmed = input.trim()

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: trimmed },
    })
    revalidatePath("/")
    return { ok: true }
  } catch (error) {
    // Prisma의 unique 제약 위반 (P2002)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "이미 사용 중인 닉네임이에요" }
    }
    console.error("[setNickname] error:", error)
    return { ok: false, error: "닉네임 설정에 실패했어요" }
  }
}
