import { put } from "@vercel/blob"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "이미지 파일만 업로드할 수 있어요" }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "5MB 이하 파일만 업로드할 수 있어요" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `places/${session.user.id}/${Date.now()}.${ext}`
  const blob = await put(path, file, { access: "public" })

  return NextResponse.json({ url: blob.url })
}
