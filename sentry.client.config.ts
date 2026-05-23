import * as Sentry from "@sentry/nextjs"

// SENTRY_DSN 없으면 비활성. 등록 후 자동 활성화.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // 에러 샘플링 ─ 거의 모든 에러 잡고 싶음
  sampleRate: 1.0,
  
  // 성능 추적 (Performance) ─ 비용 절감 위해 production은 낮게
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // 환경 태그 ─ 이걸로 dev/prod 구분
  environment: process.env.NODE_ENV,
  
  // 릴리스 추적 (선택) ─ 어느 배포에서 에러 났는지 추적
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Session replay (비용 발생, 신중하게)
  // replaysSessionSampleRate: 0,  // 평소 세션은 녹화 안 함
  // replaysOnErrorSampleRate: 1.0,  // 에러 발생 시만 녹화
  
  // 개발 시 콘솔로 디버그 정보 출력 (production은 false)
  debug: process.env.NODE_ENV !== "production",
  })
}
