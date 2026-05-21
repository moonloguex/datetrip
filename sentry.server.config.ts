import * as Sentry from "@sentry/nextjs"

// SENTRY_DSN 없으면 비활성. 등록 후 자동 활성화.
if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,
  })
}
