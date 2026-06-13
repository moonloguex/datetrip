"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { validateNickname } from "@/lib/nickname"

export type UpdateNicknameResult =
  | { ok: true; nickname: string }
  | { ok: false; error: string }

export async function updateNickname(
  input: string
): Promise<UpdateNicknameResult> {
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

  // 현재 닉네임과 동일하면 불필요한 update/unique 충돌 없이 조기 반환.
  const current = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nickname: true },
  })
  if (current?.nickname === trimmed) {
    return { ok: true, nickname: trimmed }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: trimmed },
    })
    revalidatePath("/me")
    revalidatePath("/")
    return { ok: true, nickname: trimmed }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "이미 사용 중인 닉네임이에요" }
    }
    console.error("[updateNickname] error:", error)
    return { ok: false, error: "닉네임 수정에 실패했어요" }
  }
}

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteAccount(): Promise<DeleteAccountResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: "로그인이 필요합니다" }
  }

  try {
    // Account/Session/Trip/Like/Recommendation은 onDelete: Cascade로 함께 삭제됨.
    await prisma.user.delete({ where: { id: session.user.id } })
    revalidatePath("/")
    return { ok: true }
  } catch (error) {
    console.error("[deleteAccount] error:", error)
    return { ok: false, error: "탈퇴 처리에 실패했어요" }
  }
}
