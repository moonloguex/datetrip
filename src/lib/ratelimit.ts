// Upstash Ratelimit + Redis.
// 환경변수 없으면 graceful pass — dev 또는 셋업 전 환경에서 막힘 없이 동작.
// production에서 UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN 설정 시 자동 활성화.
//
// 정책: IP당 분당 60회 sliding window (실제 사용 패턴엔 영향 없음)

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

export const hasRateLimitEnabled = !!url && !!token

let _ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (!hasRateLimitEnabled) return null
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: new Redis({ url: url!, token: token! }),
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "datetrip:ratelimit",
    })
  }
  return _ratelimit
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean
  remaining: number
  reset: number
}> {
  const ratelimit = getRatelimit()
  if (!ratelimit) {
    return { success: true, remaining: 999, reset: 0 }
  }

  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  }
}
