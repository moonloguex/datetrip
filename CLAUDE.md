# 데이트립 (DateTrip) ─ 프로젝트 컨텍스트

## 한 줄 요약
사용자가 좋아하는 데이트/여행 코스를 순서대로 등록하고, 그 경로를 다른 사람과 공유하는 웹 서비스.

## 기술 스택
- 프레임워크: Next.js 16+ (App Router, TypeScript)
- 스타일링: Tailwind CSS + shadcn/ui
- DB: PostgreSQL (Neon 호스팅)
- ORM: Prisma 6
- 인증: NextAuth.js (Auth.js v5) ─ 카카오 + 구글 OAuth
- 지도: 카카오맵 JavaScript SDK + 카카오 로컬 REST API
- 배포: Vercel

## 디자인 원칙
- 톤: 미니멀, 절제된 컬러, 충분한 여백 (참고: 토스, 노션)
- 컴포넌트: shadcn/ui 베이스, 필요 시 커스터마이징
- 타이포그래피: Pretendard 또는 Inter (한글 가독성 우선)

## 핵심 도메인 모델
- User: 사용자. 카카오/구글 OAuth로 로그인.
- Trip: 데이트 코스 하나 (제목, 지역, 태그, 작성자).
- Place: 코스 안의 정류지. `order` 필드로 순서 보장. 카카오맵에서 가져온 정보 + 사용자 메모.
- Like: 좋아요. (userId, tripId) 복합 PK로 중복 방지.

## 보안/환경변수 컨벤션
- `NEXT_PUBLIC_` 접두사가 붙은 변수만 브라우저에 노출. 그 외는 서버 전용.
- 카카오 REST API 키는 절대 클라이언트 노출 금지 → `/api/places/search` 같은 서버 라우트 통해서만 호출.
- 카카오맵 SDK용 JavaScript 키는 도메인 제한이 걸려있어 노출 가능 (`NEXT_PUBLIC_KAKAO_JS_KEY`).

## 코딩 컨벤션
- 언어: TypeScript strict 모드
- import 경로: `@/*` 절대 경로 사용
- 파일명: 컴포넌트 파일은 `PascalCase.tsx`, 그 외는 `camelCase.ts`
- 서버/클라이언트 컴포넌트: 기본은 서버 컴포넌트. 인터랙션 필요할 때만 `"use client"` 명시.
- 데이터 페칭: 가능하면 서버 컴포넌트에서 직접 Prisma 호출. 클라이언트에서 필요하면 Route Handler 경유.
- 주석: 자명한 코드에는 주석 X. "왜 이렇게 했는지(why)"가 필요한 경우에만 주석 작성.
- **Prisma 클라이언트 import**: 표준 경로 `@prisma/client`에서 import. Turbopack NFT 호환을 위해 커스텀 output 경로 사용하지 않음.
  ```typescript
  import { PrismaClient } from "@prisma/client"
  ```

## 작업 시 기대사항
- 코드를 작성/수정할 때는 **변경 이유와 근거**를 함께 설명할 것.
- 라이브러리를 새로 추가할 때는 **왜 이 라이브러리인지** 간단히 정당화.
- 파괴적 변경(파일 삭제, 스키마 변경) 전에는 한 번 확인 받기.
- 한국어로 응답.

## 알려진 함정

### NextAuth OAuth 사용자 식별
- 같은 사람이 카카오/구글 등 서로 다른 provider로 로그인하면 DB에 **별개 User** 레코드가 생성됨.
  이메일이 같아도 분리된다.
- `authorId`, `userId` 등으로 데이터를 필터링할 때 사용자가 어떤 provider로 로그인했는지에 따라
  다른 결과가 나올 수 있음.
- 시드 데이터의 작성자는 `.env`의 `SEED_AUTHOR_EMAIL`로 고정.
  시드를 돌리기 전 해당 이메일로 최소 한 번 로그인되어 있어야 함.

### 환경별 주의사항
- Tailwind v4: 설정은 `src/app/globals.css`의 `@theme` 디렉티브 사용. `tailwind.config.js` 없음.
- Next.js 16: middleware → `src/proxy.ts`로 이름 변경.
- shadcn Vega 스타일 Button: `render={<Link href="..." />}` + `nativeButton={false}` 패턴 사용.
  `asChild`는 Vega 스타일에서 동작하지 않음.
- seed.ts의 Prisma import는 `@prisma/client` npm 패키지 이름으로 통일. `@/` 경로 별칭은 불가.
