// Anthropic SDK 클라이언트 wrapper.
//
// 정책 (CLAUDE.md AI 추천 시스템 규약 기준):
//   - 절대 클라이언트 컴포넌트에서 import 금지. 키 노출 위험
//   - 키 없으면 hasApiKey: false 반환. 호출자가 폴백으로 분기
//   - 클라이언트 인스턴스는 모듈 레벨 캐싱 (요청마다 재생성 비용 회피)

import Anthropic from "@anthropic-ai/sdk"

const apiKey = process.env.ANTHROPIC_API_KEY

/** 환경변수에 키가 있는지. 호출자가 분기 판단에 사용 */
export const hasApiKey = !!apiKey

let _client: Anthropic | null = null

/**
 * Anthropic SDK 인스턴스 반환.
 * 키가 없으면 throw. 호출자는 hasApiKey로 먼저 체크.
 */
export function getAnthropicClient(): Anthropic {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY가 설정되지 않았습니다")
  }
  if (!_client) {
    _client = new Anthropic({ apiKey })
  }
  return _client
}
