import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {}

// SENTRY_AUTH_TOKEN 없으면 소스맵 업로드가 자동으로 스킵됨.
// DSN은 런타임 환경변수(NEXT_PUBLIC_SENTRY_DSN)로 제어.
export default withSentryConfig(nextConfig, {
  silent: true,
})
