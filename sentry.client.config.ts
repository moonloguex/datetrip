import * as Sentry from "@sentry/nextjs"

// SENTRY_DSN 없으면 비활성. 등록 후 자동 활성화.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    // 개발 환경에서 콘솔 출력 억제
    debug: false,
  })
}
