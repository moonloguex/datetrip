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

## 핵심 설계 원칙

### 지도 상태 영속화 패턴 (10-A-4에서 학습)

지도의 선택 상태와 뷰포트는 sessionStorage로 영속화함.

금지: `window.history.pushState`로 상태 영속화. Next.js App Router의
내부 navigation 스택을 건드리지 않아 뒤로 가기로 돌아왔을 때
복원이 깨짐.

권장: sessionStorage. 같은 탭 안에서 앞/뒤 이동 시 자연스럽게 복원되고
새 탭과는 격리됨. 컴포넌트 재마운트 시 useState 초기화 함수에서 읽기.

트레이드오프: "지도 + 선택된 코스" 조합을 URL로 공유할 수 없음.
데이트립의 공유 가치는 코스 상세 페이지에 있으므로 허용 가능한 손실.

### 시드와 사용자 콘텐츠는 동일하게 취급한다
데이트립은 큐레이션된 시드 코스와 사용자가 만든 코스를 동일한 데이터 모델·
동일한 코드 경로로 다룹니다. `authorId === SYSTEM_CURATOR_ID` 같은 특수 분기는
금지. 필요해 보이는 순간이 오면 그건 "이질감"의 신호이므로 설계를 다시 봐야 함.

이유:
- 큐레이션 우대는 사용자 기반 콘텐츠 성장 동기를 꺾음
- 두 갈래 코드 경로는 버그 표면적과 유지보수 부담을 두 배로 만듦
- 대고객 서비스 전환 시 자연스러운 이행을 가능하게 함

큐레이터 유저는 일반 User 한 명일 뿐이며 `bio` 등 일반 필드로 자기를 표현함.

## 핵심 도메인 모델
- User: 사용자. 카카오/구글 OAuth로 로그인.
- Trip: 데이트 코스 하나 (제목, 지역, 태그, 작성자).
- Place: 코스 안의 정류지. `order` 필드로 순서 보장. 카카오맵에서 가져온 정보 + 사용자 메모.
- Like: 좋아요. (userId, tripId) 복합 PK로 중복 방지.

### Trip.slug 규약

모든 Trip은 URL 식별자로 `slug: String @unique`를 가짐.

- 시드 코스: 사람이 수동 명명. 예: `seongsu-cafe-tour-v1`
- 사용자 코스: 제목에서 자동 생성 + 충돌 시 짧은 해시 suffix  
  예: "내 첫 데이트" → `my-first-date` (충돌 시 `my-first-date-a3f`)
- URL 패턴: `/trips/{slug}` (cuid 노출 X). 단, 내부 관계는 여전히 `id` 기준

좋아요와 slug의 관계:
- slug가 같으면 같은 코스. 작은 수정(오타·주소 보정·메모 다듬기·장소 1개 교체)은
  같은 slug 유지 → 좋아요 보존
- 큰 변경(테마 변경, 장소 절반 이상 교체)은 새 slug = 사실상 새 코스로 처리
  → 옛 slug의 좋아요는 옛 코스에 남고, 새 코스는 0부터 시작
- 시드: 큐레이터가 의식적으로 결정 (`-v2` 같은 명시적 버전 suffix)
- 사용자: 11단계 검토 사항 (현재는 수정 시 항상 같은 slug 유지)

참고: 인스타그램은 이미지 자체를 못 바꾸게 해서 이 문제를 우회. 우리는 장소
편집을 핵심 가치로 유지해야 하므로 slug 규약으로 의도성을 부여.

### AI 추천 시스템 규약

#### 입력
- 사용자 선호 태그 (`User.preferences: String[]`, 온보딩에서 수집)
- 사용자 좋아요 이력의 태그 분포
- 후보 코스 30개의 메타데이터 (title, region, tags, likeCount만)
  - 카카오 비용/PII 보호 차원에서 장소 상세는 보내지 않음

#### 후보 풀 구성 (작성자 차별 없음)
- 좋아요/선호 태그 매칭 15개 (인기순 + 태그 일치도 가중)
- 최근 7일 작성 10개 (신선함, 새 사용자 코스 발견 통로)
- 랜덤 5개 (세렌디피티)

#### 출력
- AI는 **기존 코스 ID 중에서만 선택**. 새 코스 생성 금지(환각 차단)
- 응답 JSON 스키마: `{tripIds: string[], reasons: {[tripId]: string}}`
- 서버는 응답의 tripIds가 후보 풀에 속하는지 검증 후 사용

#### 캐싱
- `Recommendation` 테이블에 사용자당 1행 보관 (userId가 PK)
- `generatedAt + 24h` 지나면 다음 접속 시 재계산
- 캐시 미스/AI 실패 시 폴백: 후보 풀 점수 정렬 결과 그대로 사용
  → ANTHROPIC_API_KEY 없어도 추천 섹션 항상 동작

#### 모델
- 1차: claude-haiku-4-5-20251001 (정렬+짧은 이유 생성에 충분)
- 품질 부족 시: claude-sonnet-4-6 (모델 string 한 줄 교체)

### 선호 태그 동기화 정책

`src/lib/preference-tags.ts`의 ALL_PREFERENCE_TAGS는 시드 데이터의 주제
태그 분포와 동기화 유지. 시드에 새 주제 태그가 추가되면 이 리스트도 검토.

태그 ID == 라벨 == DB 저장값 (모두 한글 동일). 별도 lookup 테이블 없이
String[]로 단순 저장. 한국어 외 다국어 도입 시 i18n 레이어 필요.

### 10단계에서 도입될 스키마 변경
완료:
- `User.preferences: String[]` 추가 (온보딩 선호 태그) — 10-A에서 완료

미완료 (별도 작업으로):
- `Trip.slug: String @unique` 추가
- `Recommendation` 신규 모델 (userId PK, tripIds, reasons, generatedAt)

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

### Auth.js v5 + Edge Middleware + JWT 쿠키 재발급의 함정

**현상**: 사용자 상태(닉네임, 권한 등)가 DB에서 변경됐는데, jwt 콜백에서
token을 업데이트해도 미들웨어(proxy.ts)에서는 계속 옛 상태가 보임.
무한 리다이렉트가 발생할 수 있음.

**원인**: NextAuth v5는 명시적인 sign-in/sign-out 이벤트에서만 JWT 쿠키를
새로 발급. jwt 콜백이 token을 수정해도 클라이언트 쿠키에 반영되지 않음.
Edge Runtime 미들웨어는 클라이언트가 보낸 원본 JWT 쿠키만 디코드하므로
미들웨어가 보는 세션은 영원히 로그인 시점 그대로.

**해결 원칙**: 사용자 상태 변경에 따른 라우팅 보호 로직은 미들웨어가 아닌
서버 컴포넌트(layout 또는 page)에서 처리.
- 서버 컴포넌트는 매 요청마다 새로 실행되고 DB 접근이 자유로움
- auth() 호출 시 jwt 콜백이 실행되어 DB fallback이 동작
- layout에서 직접 redirect() 호출

**현재 구현**:
- 인증 보호 (로그인 필요 페이지): `proxy.ts` — authConfig.authorized 처리
- 닉네임 보호 (온보딩 강제): `src/app/(main)/layout.tsx` — auth() + redirect()
- jwt fallback (`src/auth.ts`): `token.nickname == null`이면 매 요청마다 DB 재조회.
  재로그인 시 JWT 쿠키가 새로 발급되면 자동 해소됨.

## 향후 검토 사항 (MVP 후)

### 사용자 정보 정책
- **본명 저장**: 현재 OAuth profile에서 name을 받지 않고 null 저장. 운영 중 분쟁/CS 대응에 본명이 필요해지면 암호화 저장 도입 검토. envelope encryption 패턴 권장.
- **닉네임 변경**: 현재 첫 설정 후 변경 불가. 마이페이지 도입 시 변경 기능 추가 (잦은 변경 방지 정책 함께).

### 인프라 분리
- **DB 분리**: 현재 dev와 production이 같은 Neon DB 사용. 사용자 늘면 production / staging / dev 분리 필요.
- **OAuth 계정 통합**: 같은 사람이 카카오/구글 모두로 로그인하면 별개 User로 생성됨. 이메일 매칭으로 통합하는 Account Linking 검토.

### dev/production DB 분리 (사용자 늘어나면 검토)

현재 dev와 production이 같은 Neon 데이터베이스를 공유.

이점:
- 환경변수 셋업 단순
- 본인이 dev에서 만든 데이터를 곧장 production에서 확인 가능
- 개인 프로젝트 단계에서 운영 부담 최소

미래의 위험:
- 협업자 추가 시 dev 실험이 production에 영향
- 실제 사용자가 늘면 dev 작업이 production 사용자 데이터를 건드릴 가능성

분리 시점 트리거:
- 협업자 1명이라도 합류
- 실제 사용자 좋아요·코스 작성이 의미 있는 양에 도달
- production에서 schema 실수로 사용자 데이터 손상 가능성이 현실화

분리 방법:
- Neon에서 새 프로젝트(예: datetrip-dev) 생성
- Vercel 환경변수에 production용 DATABASE_URL/DIRECT_URL 유지
- 로컬 .env.local은 새 dev DB 가리키도록 변경
- dev DB는 production seed 복제로 초기화

### 컨텐츠/UX
- **마이페이지**: 본인 코스 목록, 좋아요한 코스, 닉네임 변경, 계정 삭제 등.
- **추천 코스 카테고리**: 1단계 컨셉 설계 시 언급된 "그날의 추천 코스" 기능.
- **OG 태그**: 카카오톡/슬랙 등에 코스 URL 공유 시 미리보기 (제목/설명/지도 썸네일).
- **모바일 반응형**: 현재 데스크톱 위주. 좌우 분할 레이아웃이 모바일에서 어떻게 변형될지 별도 설계 필요.

### 길찾기 기능 (10-C로 미뤄둠)

**의도**: 코스 내 장소 간 이동 방법을 사용자가 고르고, 그에 맞는 길 안내를 표시.
데이트립을 "기록 도구"에서 "실행 가능한 데이트 계획서"로 격상시키는 핵심 기능.

**3단계 구현 안**:
- 작은 버전: 각 구간 직선거리 + 예상 도보 시간 표시. 별도 API 불필요.
- 중간 버전: 도보/자동차 이동 방법 토글. 평균 속도 기반 시간 추정.
- 풀 버전: 카카오 모빌리티 API 등으로 실제 경로 + 지도에 폴리라인.

**비용 고려사항**:
- 현재 카카오맵 SDK + 로컬 검색만 사용 (무료). 길찾기는 별도 API.
- 카카오 모빌리티 무료 한도 작음. 사용자 늘면 유료 전환 필요.
- 대안: 네이버 Directions, Tmap (각각 무료 한도 다름).

**우선순위 이유**:
시드 확장 + AI 추천을 먼저 진행. 데이터 풍부함과 큐레이션 가치를 먼저 키운 후
사용자가 실제로 코스를 따라가고 싶어할 때 길찾기 추가.

### Prisma 7 메이저 업그레이드 (시점 미정)

현재 Prisma 6 사용. 빌드 시 7 업그레이드 안내 경고 표시됨.

업그레이드 시 검토할 점:
- schema.prisma 문법 변경 사항 (Breaking changes 문서 확인 필요)
- Prisma Client 타입 변경으로 인한 코드 영향 범위
- 마이그레이션 호환성 (기존 migration 파일 재생성 필요 여부)
- @paralleldrive/cuid2와의 호환성

권장 시점:
- 11단계 이상 큰 작업 들어가기 전 빈 시간
- 또는 보안 패치 필요 시점
- 지금은 동작 영향 없으므로 후순위

### 카카오 지도 컨트롤 (줌·로드뷰) 데스크탑 추가 검토

현재 카카오맵에 컨트롤 미설정 ─ 모바일 우선 의도 (핀치 줌 / 더블 탭 줌 사용).

검토 시점:
- 데스크탑 사용자가 의미 있게 늘었을 때
- "지도가 어떻게 줌하는지 모르겠다" 같은 사용자 피드백

추가 방법:
- ExploreMap 안에서 미디어 쿼리로 조건부 추가
- map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
- 모바일에선 화면 차지하니 추가 X. window.matchMedia로 sm+ 환경만 적용

### 사용자 코스 편집 시 좋아요 정책 (11단계 검토)
현재 사용자가 자기 코스를 편집하면 좋아요는 항상 보존됨. 사용자 수가 늘어
"큰 변경"으로 좋아요가 의미를 잃는 사례가 보고되면 다음을 검토:
- 편집 폼에 "이전 좋아요 유지 / 새 코스로 시작(fork)" 라디오 추가
- 또는 변경 폭 자동 감지하여 fork 제안
- 현재는 인스타그램형 "본질 잠금" 대신 큐레이터 의도 기반으로 운영

### 추천 캐시 이벤트 기반 무효화 (11단계 후보)
현재 24시간 단위 갱신. 다음 시점에 이벤트 기반으로 진화 검토:
- 사용자가 좋아요 누르면 → 본인 추천 캐시 무효화
- 새 코스 작성되면 → 해당 코스 태그와 매칭되는 사용자들 캐시 무효화
- 또는 in-memory 캐시(Vercel KV/Redis)로 이전
