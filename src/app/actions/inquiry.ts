"use server"

import { prisma } from "@/lib/prisma"
import { sendInquiryNotification } from "@/lib/email"

interface SubmitInquiryInput {
  email: string
  name?: string
  category: string
  message: string
}

const VALID_CATEGORIES = new Set(["general", "bug", "report", "other"])

export async function submitInquiry(input: SubmitInquiryInput) {
  const email = input.email.trim()
  const message = input.message.trim()
  const category = VALID_CATEGORIES.has(input.category)
    ? input.category
    : "other"

  if (!email || !email.includes("@")) {
    return { success: false, error: "이메일 형식이 올바르지 않습니다" }
  }
  if (message.length < 10) {
    return { success: false, error: "메시지는 최소 10자 이상이어야 합니다" }
  }
  if (message.length > 5000) {
    return { success: false, error: "메시지는 5000자를 넘을 수 없습니다" }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      email,
      name: input.name?.trim() || null,
      category,
      message,
    },
  })

  // 실패해도 사용자 흐름 정상 진행 (email.ts 내부에서 catch)
  await sendInquiryNotification({
    inquiryId: inquiry.id,
    email: inquiry.email,
    name: inquiry.name,
    category: inquiry.category,
    message: inquiry.message,
  })

  return { success: true }
}
