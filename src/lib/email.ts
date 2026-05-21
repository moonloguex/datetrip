// Resend를 통한 이메일 전송.
// 환경변수 없으면 graceful degradation (콘솔 로그만 남기고 throw X).
// RESEND_API_KEY 없어도 문의 DB 저장은 정상 동작 — 이메일 알림만 스킵.

import { Resend } from "resend"

const apiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.RESEND_FROM_EMAIL
const adminEmail = process.env.ADMIN_EMAIL

export const hasEmailEnabled = !!apiKey && !!fromAddress && !!adminEmail

let _client: Resend | null = null
function getClient(): Resend {
  if (!apiKey) throw new Error("RESEND_API_KEY 미설정")
  if (!_client) _client = new Resend(apiKey)
  return _client
}

interface InquiryNotificationData {
  inquiryId: string
  email: string
  name: string | null
  category: string
  message: string
}

export async function sendInquiryNotification(
  data: InquiryNotificationData,
): Promise<void> {
  if (!hasEmailEnabled) {
    console.log("[email] 이메일 비활성. 문의 알림 스킵:", data.inquiryId)
    return
  }

  try {
    await getClient().emails.send({
      from: fromAddress!,
      to: adminEmail!,
      subject: `[데이트립 문의] ${data.category} - ${data.email}`,
      text: `
새 문의가 도착했습니다.

ID: ${data.inquiryId}
이메일: ${data.email}
이름: ${data.name || "(미입력)"}
카테고리: ${data.category}

메시지:
${data.message}

회신은 이 메일에 "회신" 또는 위 이메일로 직접 보내세요.
      `.trim(),
    })
  } catch (error) {
    // 알림 실패해도 사용자 흐름은 정상 진행. DB엔 저장됨.
    console.error("[email] 문의 알림 전송 실패:", error)
  }
}
