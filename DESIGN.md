---
name: 데이트립 (DateTrip)
description: 데이트 코스를 기록하고 지도로 공유하는 큐레이션 서비스. 둘러보기 화면은 이미지 그리드가, 상세·편집 화면은 지도가 주인공이다.
colors:
  ink: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  canvas: "oklch(1 0 0)"
  surface: "oklch(0.97 0 0)"
  hairline: "oklch(0.922 0 0)"
  quiet-stone: "oklch(0.556 0 0)"
  dusk-rose: "oklch(0.62 0.08 22)"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  chip-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  chip-tag-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card-course:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  input-search:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: 데이트립 (DateTrip)

## 1. Overview

**Creative North Star: "The Curated Map"**

데이트립의 시각 시스템은 큐레이션의 확신 위에서 작동한다. 마치 좋은 지도책처럼—군더더기 없이 핵심만 담고, 여백 자체가 정보다. 색은 절제되어 있고, 타이포그래피가 위계를 잡으며, 한 줄의 코스 제목이 데이트의 기억을 불러일으켜야 한다.

**화면마다 주인공이 다르다 (The Hero Rule).** 이 서비스에는 단일한 "주인공 요소"가 없다. 화면의 목적에 따라 무엇이 가장 큰 면적과 시선을 가져갈지가 달라진다:
- **둘러보기(코스 목록): 이미지가 주인공.** 사용자는 코스 사진을 훑으며 "여기 가보고 싶다"를 느낀다. 큰 이미지 그리드가 화면을 지배한다. 코스 이미지는 필수이며 보조 정보가 아니다.
- **코스 상세·편집: 지도가 주인공.** 경로와 장소 순서를 이해하는 화면이므로 지도가 최대 면적을 차지한다. 사이드 패널·모달·필터는 지도를 가리지 않는 범위에서만 존재한다.
- 공통: 무엇이 주인공이든, 불필요한 색·장식적 그림자·과도한 애니메이션은 시선을 빼앗는 노이즈다.

이 시스템이 명시적으로 거부하는 것: 이벤트 배너와 할인 프로모션(야놀자·여기어때 스타일), 끝없이 흐르는 SNS 무한 피드와 좋아요 경쟁(인스타그램·핀터레스트), 리뷰 점수와 별점 중심의 정보 포털(트립어드바이저). 데이트립은 큐레이터의 판단을 신뢰한다. 색으로 주의를 끌지 않고, 선별된 콘텐츠 자체가 설득한다. (이미지를 크게 쓰는 것과 SNS 피드를 흉내내는 것은 다르다 — 우리는 선별된 코스를 잡지처럼 보여줄 뿐, 무한 스크롤·인기 경쟁을 만들지 않는다.)

**Key Characteristics:**
- 완전 무채색 기반 + 하나의 억제된 감성 엑센트 (Dusk Rose, ≤5% 사용)
- 타이포그래피와 여백으로 위계를 결정 — 색이 아닌
- 경계선(hairline border)이 그림자를 대신하는 플랫 레이어링
- Pretendard Variable 단일 패밀리, 두 웨이트(400·600)만
- 둘러보기는 이미지 그리드, 상세·편집은 지도 — 화면별로 주인공이 다름
- 모바일 우선, 콘텐츠(이미지·지도) 위에서 살아남는 UI 밀도

## 2. Colors: The Neutral Archive

색의 결여가 곧 큐레이션의 확신이다. 무채색 팔레트에서 Dusk Rose가 나타날 때, 그것은 사용자가 무언가를 원한다는 신호다.

### Primary
- **Deep Ink** (oklch(0.145 0 0) ≈ #1c1c1c): 최상위 텍스트, 브랜드 로고. 순수 검정보다 한 톤 올려 인쇄물 느낌을 낸다.
- **Editorial Ink** (oklch(0.205 0 0) ≈ #2d2d2d): 버튼 배경, CTA, 강조 텍스트. 클릭 가능한 모든 Primary 액션.

### Secondary
- **Dusk Rose** (oklch(0.62 0.08 22)): 좋아요 하트, 선택된 지도 마커, 온보딩 핵심 CTA. **전체 화면의 ≤5%**. 이 색이 등장할 때는 사용자가 감정을 투자한 순간이다. 아직 globals.css에 없는 추천 신규 토큰 — `--dusk-rose: oklch(0.62 0.08 22)` 추가 필요.

### Neutral
- **Pure Canvas** (oklch(1 0 0) = #ffffff): 배경, 카드 표면, 모달 배경. 가장 넓은 면적.
- **Cool Surface** (oklch(0.97 0 0) ≈ #f7f7f7): 뮤트 배경, 태그 칩 배경, 버튼 hover 상태.
- **Hairline** (oklch(0.922 0 0) ≈ #eaeaea): 카드 테두리, 구분선, 입력 필드 테두리. 그림자 대신 공간을 나누는 선.
- **Quiet Stone** (oklch(0.556 0 0) ≈ #747474): 보조 텍스트, 지역·장소 수·좋아요 수 등 메타데이터. Canvas 위에서 4.5:1 대비율 충족.
- **Danger Red** (oklch(0.577 0.245 27.325) ≈ #d13f26): 삭제, 오류, 경고 전용. 장식 목적으로 절대 금지.

### Named Rules

**The One Accent Rule.** Dusk Rose는 화면의 ≤5%에만 쓴다. 좋아요, 선택 마커, 온보딩의 한 CTA. 더 많이 쓰는 순간 화려한 관광 앱과 다를 게 없어진다.

**The No-Color-As-Decoration Rule.** 색은 상태(선택됨, 좋아요)와 경고(삭제, 오류)에만 쓴다. 구분선, 배지, 섹션 구분에 색을 쓰지 않는다. 큐레이션의 신뢰는 절제에서 나온다.

## 3. Typography

**Single Font:** Pretendard Variable (fallback: -apple-system, BlinkMacSystemFont, system-ui, sans-serif)
**Mono Font:** Geist Mono (코드·기술적 표시 전용, UI에는 미사용)

**Character:** 단일 패밀리, 두 웨이트(400 · 600)만으로 전체 위계를 처리한다. Pretendard Variable은 한국어 자형의 수직 리듬을 가장 자연스럽게 처리하는 가변 폰트로, 13px 이하 레이블에서도 글자가 뭉개지지 않는다. 세리프 없이 단정하고, 여백과 크기로만 말한다.

### Hierarchy

- **Display** (700, clamp(1.75rem, 4vw, 2.5rem), line-height 1.1, letter-spacing -0.02em): 코스 상세 타이틀, 온보딩 헤더. 화면당 단 하나. `text-wrap: balance` 필수.
- **Headline** (600, 1.25rem / 20px, line-height 1.25, letter-spacing -0.01em): 모달 제목, 주요 섹션 헤더. `text-wrap: balance` 적용.
- **Title** (600, 1rem / 16px, line-height 1.35): 코스 카드 제목, 리스트 아이템 타이틀. `line-clamp-2` 적용으로 레이아웃 보호.
- **Body** (400, 0.9375rem / 15px, line-height 1.6): 장소 메모, 설명 텍스트. 최대 65ch. `text-wrap: pretty` 적용.
- **Label** (400, 0.8125rem / 13px, line-height 1.4): 태그 칩, 메타 정보(지역 · 장소 수 · 좋아요 수), 보조 텍스트.

### Named Rules

**The Single Voice Rule.** 하나의 폰트 패밀리, 두 가지 웨이트(400 · 600)로 모든 위계를 만든다. 이탤릭, 언더라인, 다른 폰트 도입은 금지. 계층은 크기와 굵기로만.

**The Max-Width Rule.** 본문 텍스트(Body)는 최대 65ch. 지도 사이드 패널(420px 고정폭)에서는 자동으로 지켜지지만, 모달 내 긴 텍스트에는 명시적으로 적용한다.

## 4. Elevation

데이트립은 **기본적으로 평평하다.** 레이어는 그림자가 아닌 `hairline` 테두리와 배경색 차이(`canvas` → `surface`)로 구분된다. 지도 위에 뜨는 사이드 패널도 테두리(`border-r`)만으로 지도와 분리된다.

그림자는 두 상황에서만 허용된다: **hover 상태** (카드가 선택 가능함을 알림)와 **전면 레이어** (모달, 하단 시트 — 지도 위로 올라오는 구조적 레이어). 두 경우 모두 확산적이고 컬러리스한 ambient shadow.

### Shadow Vocabulary

- **Hover Lift** (`0 2px 12px rgba(0,0,0,0.06)`): 코스 카드 hover 시. 카드가 살짝 떠오르는 미세한 감각.
- **Sheet Rise** (`0 -4px 24px rgba(0,0,0,0.08)`): 모바일 하단 시트, 코스 상세 모달. 지도 위 전면 레이어의 구조적 그림자. `shadow-2xl` 클래스로 구현 중.

### Named Rules

**The Flat-By-Default Rule.** 모든 컨테이너는 정지 상태에서 flat — 테두리만, 그림자 없음. 그림자는 상태 변화(hover)나 레이어 진입(모달 등장)에만 반응으로 등장한다. 정적 그림자는 화면을 무겁게 만들고 지도 위 UI와 충돌한다.

## 5. Components

### Buttons

두 가지만: Primary (검정 솔리드) / Ghost (투명). shadcn/ui Button 기반, Vega 스타일 패턴 사용.

- **Shape:** 6px 살짝 둥근 모서리 (`rounded-sm`, 0.375rem). 과도하게 둥글면 장난스럽고, 각지면 차갑다.
- **Primary:** `primary` (near-black) 배경, `primary-foreground` (near-white) 텍스트, `8px 16px` 패딩.
- **Primary Hover:** `ink` (#1c1c1c)로 진해짐, 150ms ease-out.
- **Ghost:** 투명 배경, `foreground` 텍스트. hover 시 `surface` 배경 등장.
- **Focus-visible:** `quiet-stone` 2px outline, 2px offset. 글로우 없음.
- **금지:** 그라디언트 버튼, Dusk Rose 버튼, 굵은 컬러 테두리 버튼.

### Chips / Tags

코스 태그(`#감성카페`, `#성수`) 표현.

- **기본:** `surface` 배경, `foreground` 텍스트, `rounded-full`, `px-2 py-0.5`, 13px.
- **활성(필터 선택):** `primary` 배경, `primary-foreground` 텍스트 — 완전 반전. Dusk Rose는 쓰지 않는다.
- **hover:** `hairline` border 추가 또는 약간 어두운 배경. subtle하게.

### Cards / Containers

코스 리스트의 기본 단위. **둘러보기 화면에서는 이미지가 카드를 지배한다.**

- **Image (필수):** 카드 상단에 3:2 비율 이미지. `object-fit: cover`, `rounded-2xl`(상단 또는 전체). 코스 이미지는 필수 입력이며, 둘러보기 그리드의 주인공이다.
- **이미지 누락 시 폴백:** 이미지를 필수로 유도하므로 폴백은 예외 상황이다. 부득이한 경우 `surface`(#f7f7f7) 단색 배경 + `quiet-stone` 코스 제목 이니셜/아이콘. **그라데이션·딥그린 등 색면 폴백 금지** — 무채색 폴백만.
- **Corner Style:** `rounded-2xl` (18px = 1.125rem). 풍성하지만 버블리하지 않은 곡률.
- **Background:** `canvas` (#fff).
- **Border:** 이미지가 면을 채우므로 카드 자체 테두리는 생략 가능. 텍스트 영역만 있는 카드는 `hairline` 1px solid. 정지 상태에서 그림자 없음.
- **Hover:** 이미지 미세 확대(scale 1.02, overflow hidden) 또는 `foreground/30` 테두리 + Hover Lift 그림자, 150ms.
- **Internal Padding:** 텍스트 영역 `16px` 또는 이미지 하단 `12px`.
- **Text:** 이미지 아래 캡션처럼 — 메타(지역·장소 수, Label) + 코스 제목(Title, `line-clamp-2`). 최소한으로.
- **금지:** 중첩 카드(카드 안 카드), 좌측 컬러 스트라이프, 이미지 위 텍스트 오버레이를 기본값으로 쓰는 것(가독성 위해 이미지·텍스트 분리).

### Inputs / Fields

검색 필드, 코스 편집 폼.

- **Style:** `hairline` 1px border, `canvas` 배경, `rounded-md` (8px), `10px 12px` 패딩.
- **Focus:** 테두리 → `quiet-stone`. 글로우 없음, 두께 변화 없음.
- **Placeholder:** `quiet-stone` 색. Canvas 위 4.5:1 대비율 확인 필수.
- **Error:** `destructive` 컬러 테두리 + 하단 오류 메시지 (Quiet Stone 글자).
- **Disabled:** opacity 0.5.

### Navigation

상단 고정 헤더 (`h-16` = 64px), `border-b hairline`.

- **Brand:** 18px, weight 700, `ink` 색. 데이트립 로고/워드마크.
- **Nav Links:** 14px, weight 500, `foreground`. hover 시 `surface` 배경 등장, 200ms.
- **CTA ("코스 만들기"):** Primary 버튼 스타일 인라인 배치.
- **모바일:** 동일 헤더 유지. 리스트는 하단 시트 패턴.

### Course Trip Modal (Signature Component)

데이트립의 핵심 독자 컴포넌트 — 코스 선택 시 등장하는 상세 오버레이.

- **데스크탑:** 중앙 모달. `Sheet Rise` 그림자.
- **모바일:** 하단에서 올라오는 시트, `height: 70vh` 확장 가능. 상단에 드래그 핸들 암시.
- **구조:** 이미지 캐러셀 → 장소 순서 리스트(번호 + 이름 + 이동 정보) → 좋아요·공유 액션.
- **좋아요 상태:** 하트 아이콘 → Dusk Rose 색상. 데이트립에서 이 색이 가장 자주 등장하는 지점.

## 6. Do's and Don'ts

### Do:
- **Do** 지도를 최대 면적으로 유지하라. 사이드 패널, 모달, 필터는 필요할 때만 전면에 나온다.
- **Do** Dusk Rose는 사용자가 감정을 투자한 상태(좋아요, 선택된 마커)에만 쓴다.
- **Do** 카드 제목은 `line-clamp-2`로 잘라낸다 — 텍스트가 레이아웃을 깨지 않는다.
- **Do** 모든 터치 타겟을 최소 44×44px로. 좋아요 버튼, 하단 시트 드래그 핸들 포함.
- **Do** `text-wrap: balance`를 h1–h3에 적용해 한글 줄 끊김을 자연스럽게 유지한다.
- **Do** 모든 트랜지션에 `@media (prefers-reduced-motion: reduce)` 대안을 제공한다.
- **Do** `quiet-stone` 텍스트가 `canvas` 배경 위에서 4.5:1 이상 대비율을 충족하는지 배포 전 확인한다.
- **Do** 둘러보기 화면에서 코스 이미지를 크게(3:2 비율) 보여준다. 이미지는 필수 입력이며, 그리드의 주인공이다.
- **Do** 그림자는 hover와 전면 레이어(모달, 시트)에만 사용한다.

### Don't:
- **Don't** 화려한 관광 앱(야놀자·여기어때 스타일)처럼 이벤트 배너, 할인 텍스트, 프로모션 색상을 추가하지 않는다. 데이트립은 상업적 긴박감이 없다.
- **Don't** SNS 무한 피드와 인기 경쟁(인스타그램·핀터레스트 스타일)을 흉내내지 않는다. 무한 스크롤, 좋아요 순 정렬 강조, 끝없는 추천 피드는 만들지 않는다. (단, 둘러보기 화면에서 코스 이미지를 크게 쓰는 것은 권장된다 — 선별된 코스를 잡지처럼 보여주는 것과 SNS 피드는 다르다.)
- **Don't** 리뷰 별점, 점수, 랭킹 배지를 도입하지 않는다. 큐레이터의 판단을 숫자로 대체하지 않는다.
- **Don't** `border-left` 4px 이상의 컬러 스트라이프를 카드나 알림에 쓰지 않는다.
- **Don't** 그라디언트 텍스트(`background-clip: text`)를 쓰지 않는다.
- **Don't** 카드 안에 카드를 중첩하지 않는다.
- **Don't** Dusk Rose를 버튼 배경, 섹션 강조, 배너에 쓰지 않는다. 좋아요·선택 상태 외 금지.
- **Don't** 정적인 그림자를 컨테이너에 추가하지 않는다. 그림자는 반응으로만 등장한다.
- **Don't** 모든 섹션 헤더 위에 소형 대문자 아이브로우 레이블을 붙이지 않는다 ("COURSES", "ABOUT" 등).
- **Don't** 두 개의 비슷한 sans-serif 폰트를 페어링하지 않는다. 폰트는 Pretendard Variable 하나다.

## 7. Decision Log (확정 근거)

이 문서는 Impeccable `init` 인터뷰가 생성한 초안을 베이스로, 프로토타입 비교를 거쳐 확정한 결정을 반영했다.

- **무드 — 에디토리얼 / 큐레이션:** 데이트 코스는 "장면의 연속"이고, 공유받은 사람의 첫인상이 성장의 핵심이라 잡지형 큐레이션 방향으로 확정.
- **폰트 — Pretendard Variable 단일 (세리프 미도입):** 프로토타입에서 본명조 세리프 제목(에디토리얼 강조)과 Pretendard 단일(모던·깔끔)을 직접 비교한 뒤, "깔끔하고 모던한" Pretendard 단일을 의식적으로 선택. 세리프의 감성보다 가독성·스캔 용이성·구현 단순함을 우선.
- **액센트 — Dusk Rose (딥그린 미채택):** 초기에 딥그린/포레스트를 검토했으나, 딥그린의 주 쓰임새가 "이미지 없는 카드의 폴백 배경"이었고 이미지 필수 정책으로 폴백이 거의 등장하지 않게 되면서 채택 이유가 약해짐. Impeccable이 제안한 Dusk Rose(좋아요·선택 상태 ≤5%)로 확정.
- **이미지 — 필수 입력, 둘러보기의 주인공:** 폴백 색면에 의존하지 않고 모든 코스에 사진을 넣는 정책. 이에 따라 노스스타를 "지도가 주인" 단일 원칙에서 "화면별로 주인공이 다름"(둘러보기=이미지, 상세·편집=지도)으로 확장.
- **유지 — Impeccable 원안의 강점:** Curated Map 노스스타, 안티레퍼런스(야놀자·인스타·트립어드바이저), 무채색 베이스 철학, 플랫 레이어링, 컴포넌트 정의, 프로덕션 디테일(OKLCH, line-clamp, text-wrap, 4.5:1 대비, prefers-reduced-motion, 44×44px 터치 타겟)은 그대로 계승.
