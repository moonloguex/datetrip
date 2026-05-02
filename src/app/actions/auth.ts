"use server"

// 클라이언트 컴포넌트에서 import해서 form action으로 호출 가능.
// auth.ts의 signIn/signOut을 직접 클라이언트에서 import하면
// "use server" 경계 위반이 나기 때문에 이렇게 wrapping이 필요함.

import { signIn, signOut } from "@/auth"

export async function signInWithKakao() {
  await signIn("kakao", { redirectTo: "/" })
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}
