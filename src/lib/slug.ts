// Trip URL slug 생성 유틸리티.
//
// 정책 (CLAUDE.md slug 정책 섹션 준수):
// - 모든 Trip은 생성 시 slug를 한 번만 받음
// - 생성 후 절대 자동 변경 X (URL 안정성 유지)
// - 기존 코스 중 slug=null인 항목은 다음 편집 또는 시드 재실행에서 채워짐
//
// 충돌 처리: TOCTOU 경합은 짧은 random suffix로 사실상 회피.
// 완전한 race-safe는 향후 unique 제약 위반 시 재시도 패턴으로 진화 가능.

import { createId } from "@paralleldrive/cuid2"
import { prisma } from "@/lib/prisma"

const MAX_SLUG_LENGTH = 50

/**
 * 제목을 URL-safe slug로 변환.
 *
 * 한글 처리: 한글은 그대로 유지. 모던 브라우저(Chrome/Safari/Firefox)는
 * URL의 한글을 percent-encoding으로 자동 처리하며, 표시할 때는 한글 그대로 보임.
 * 예: "성수 카페 투어" → "성수-카페-투어"
 *
 * 한글 미지원 환경(일부 분석 도구 등)이 우려되면 향후 transliteration 라이브러리
 * 도입 검토 (예: ko-roman). 지금은 단순함 우선.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // 한글, 영숫자, 공백, 하이픈만 남기고 모두 제거
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    // 공백을 하이픈으로
    .replace(/\s+/g, "-")
    // 연속 하이픈 압축
    .replace(/-+/g, "-")
    // 앞뒤 하이픈 제거
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
}

/**
 * DB와 충돌하지 않는 unique slug 생성.
 *
 * 흐름:
 *   1. baseSlug 생성. 너무 짧으면 (제목이 거의 다 제거됨) 곧바로 ID 기반 slug
 *   2. base 그대로 사용 가능한지 DB 확인
 *   3. 충돌 시 짧은 random suffix 5번까지 시도
 *   4. 최후: timestamp 기반 suffix (사실상 충돌 불가)
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title)

  // 제목이 사실상 비어있는 경우 (특수문자만 있거나 너무 짧음)
  if (base.length < 2) {
    return `trip-${createId().slice(0, 8).toLowerCase()}`
  }

  // 1차: base 그대로 시도
  const baseConflict = await prisma.trip.findUnique({
    where: { slug: base },
    select: { id: true },
  })
  if (!baseConflict) return base

  // 2차~6차: random suffix
  for (let i = 0; i < 5; i++) {
    const suffix = createId().slice(0, 6).toLowerCase()
    const candidate = `${base}-${suffix}`
    const conflict = await prisma.trip.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
    if (!conflict) return candidate
  }

  // 최후 보루: timestamp는 사실상 충돌 안 남
  return `${base}-${Date.now().toString(36)}`
}
