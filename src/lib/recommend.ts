// AI 추천 엔진.
//
// 핵심 정책 (CLAUDE.md 기준):
//   - AI는 기존 코스를 정렬만. 새 코스 생성 X (환각 차단)
//   - 후보 풀: 작성자 차별 없음
//       태그/좋아요 매칭 최대 15 + 최근 7일 최대 10 + 랜덤 최대 5 = 최대 30
//   - 응답 검증: AI가 반환한 tripId는 반드시 후보 풀에 있어야 함
//   - 폴백: AI 실패 시 자체 점수 알고리즘. 항상 결과 보장
//   - 캐시: Recommendation 테이블, 24시간 TTL

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getAnthropicClient, hasApiKey } from "@/lib/anthropic"

// ───── 설정값 ─────

const TARGET_RECOMMENDATIONS = 5
const MIN_RECOMMENDATIONS = 3
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const TAG_MATCH_POOL = 15
const RECENT_POOL = 10
const RANDOM_POOL = 5
const RECENT_DAYS = 7
const CLAUDE_MODEL = "claude-haiku-4-5-20251001"
const MAX_OUTPUT_TOKENS = 1024

// ───── 타입 ─────

type TripWithMetadata = Prisma.TripGetPayload<{
  include: {
    places: { orderBy: { order: "asc" } }
    _count: { select: { likes: true } }
  }
}>

export interface RecommendationItem {
  trip: TripWithMetadata
  reason: string
}

export interface RecommendationResult {
  recommendations: RecommendationItem[]
  /** "ai" | "fallback" (캐시 적중 시 원래 생성 출처) */
  source: "ai" | "fallback"
  /** 이번 호출에서 캐시 히트였는지 */
  cached: boolean
  generatedAt: Date
}

// ───── 공개 API ─────

export async function getRecommendations(
  userId: string,
): Promise<RecommendationResult> {
  const cached = await getCachedRecommendation(userId)
  if (cached) return cached
  return generateAndCacheRecommendation(userId)
}

/** 사용자 선호 변경 등 캐시 무효화가 필요할 때 호출 */
export async function invalidateRecommendationCache(userId: string) {
  await prisma.recommendation.delete({ where: { userId } }).catch(() => {})
}

/** 지정된 태그 중 하나라도 preferences에 포함된 사용자들의 추천 캐시를 삭제 */
export async function invalidateRecommendationCacheForTags(tags: string[]) {
  if (tags.length === 0) return
  await prisma.recommendation
    .deleteMany({
      where: { user: { preferences: { hasSome: tags } } },
    })
    .catch(() => {})
}

// ───── 캐시 ─────

async function getCachedRecommendation(
  userId: string,
): Promise<RecommendationResult | null> {
  const cache = await prisma.recommendation.findUnique({
    where: { userId },
  })
  if (!cache) return null

  const age = Date.now() - cache.generatedAt.getTime()
  if (age > CACHE_TTL_MS) return null

  const trips = await prisma.trip.findMany({
    where: { id: { in: cache.tripIds } },
    include: {
      places: { orderBy: { order: "asc" } },
      _count: { select: { likes: true } },
    },
  })

  // Prisma findMany는 in 순서 보장 X. tripIds 순서대로 정렬
  const tripMap = new Map(trips.map((t) => [t.id, t]))
  const ordered: TripWithMetadata[] = []
  for (const id of cache.tripIds) {
    const t = tripMap.get(id)
    if (t) ordered.push(t)
  }

  if (ordered.length < MIN_RECOMMENDATIONS) {
    await prisma.recommendation.delete({ where: { userId } }).catch(() => {})
    return null
  }

  const reasons = (cache.reasons as Record<string, unknown>) ?? {}
  const meta = (reasons._meta as { source?: string } | undefined) ?? {}
  const source: "ai" | "fallback" = meta.source === "ai" ? "ai" : "fallback"

  return {
    recommendations: ordered.map((trip) => ({
      trip,
      reason:
        typeof reasons[trip.id] === "string"
          ? (reasons[trip.id] as string)
          : "추천드려요",
    })),
    source,
    cached: true,
    generatedAt: cache.generatedAt,
  }
}

async function saveToCache(
  userId: string,
  recommendations: RecommendationItem[],
  source: "ai" | "fallback",
) {
  const tripIds = recommendations.map((r) => r.trip.id)
  const reasons: Record<string, string> = {}
  for (const r of recommendations) {
    reasons[r.trip.id] = r.reason
  }
  // source를 같이 묻어둠 (스키마 변경 없이 메타 정보 보존)
  const reasonsWithMeta = { ...reasons, _meta: { source } }

  await prisma.recommendation.upsert({
    where: { userId },
    create: {
      userId,
      tripIds,
      reasons: reasonsWithMeta as Prisma.InputJsonValue,
      generatedAt: new Date(),
    },
    update: {
      tripIds,
      reasons: reasonsWithMeta as Prisma.InputJsonValue,
      generatedAt: new Date(),
    },
  })
}

// ───── 후보 풀 빌더 ─────

async function buildCandidatePool(
  userId: string,
  userTags: Set<string>,
): Promise<TripWithMetadata[]> {
  // 풀 1: 태그 매칭 + 인기 우선
  let tagMatchPool: TripWithMetadata[] = []
  if (userTags.size > 0) {
    const candidates = await prisma.trip.findMany({
      where: { tags: { hasSome: Array.from(userTags) } },
      include: {
        places: { orderBy: { order: "asc" } },
        _count: { select: { likes: true } },
      },
      orderBy: { likes: { _count: "desc" } },
      take: TAG_MATCH_POOL * 2,
    })
    const scored = candidates.map((c) => {
      const matches = c.tags.filter((t) => userTags.has(t)).length
      const score = matches * 3 + Math.log(1 + c._count.likes)
      return { trip: c, score }
    })
    scored.sort((a, b) => b.score - a.score)
    tagMatchPool = scored.slice(0, TAG_MATCH_POOL).map((s) => s.trip)
  } else {
    // 신규 사용자: 인기순으로 풀 채움
    tagMatchPool = await prisma.trip.findMany({
      include: {
        places: { orderBy: { order: "asc" } },
        _count: { select: { likes: true } },
      },
      orderBy: { likes: { _count: "desc" } },
      take: TAG_MATCH_POOL,
    })
  }

  // 풀 2: 최근 N일 작성 (풀 1과 중복 제외)
  const sinceDate = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000)
  const recentPool = await prisma.trip.findMany({
    where: {
      createdAt: { gte: sinceDate },
      id: { notIn: tagMatchPool.map((t) => t.id) },
    },
    include: {
      places: { orderBy: { order: "asc" } },
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: RECENT_POOL,
  })

  // 풀 3: 랜덤 (위 풀들과 중복 제외)
  const excludeIds = new Set([
    ...tagMatchPool.map((t) => t.id),
    ...recentPool.map((t) => t.id),
  ])
  const remaining = await prisma.trip.findMany({
    where: { id: { notIn: Array.from(excludeIds) } },
    include: {
      places: { orderBy: { order: "asc" } },
      _count: { select: { likes: true } },
    },
  })
  const randomPool = remaining
    .sort(() => Math.random() - 0.5)
    .slice(0, RANDOM_POOL)

  return [...tagMatchPool, ...recentPool, ...randomPool]
}

// ───── 폴백 점수 알고리즘 ─────

function fallbackScore(
  trip: TripWithMetadata,
  userTags: Set<string>,
  likedTagCounts: Map<string, number>,
): number {
  const tagMatches = trip.tags.filter((t) => userTags.has(t)).length
  const tagScore = tagMatches * 3
  const likedScore = trip.tags.reduce(
    (sum, t) => sum + (likedTagCounts.get(t) || 0) * 2,
    0,
  )
  const popularityScore = Math.log(1 + trip._count.likes)
  const sevenDaysAgo = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000
  const recencyScore = trip.createdAt.getTime() > sevenDaysAgo ? 0.5 : 0
  return tagScore + likedScore + popularityScore + recencyScore
}

function fallbackReason(
  trip: TripWithMetadata,
  userTags: Set<string>,
): string {
  const matchedTags = trip.tags.filter((t) => userTags.has(t))
  if (matchedTags.length > 0) {
    return `${matchedTags[0]} 좋아하시는 분께 잘 어울려요`
  }
  if (trip._count.likes >= 5) {
    return `많은 분들이 좋아한 코스예요`
  }
  return `한 번 둘러보세요`
}

function buildFallback(
  pool: TripWithMetadata[],
  userTags: Set<string>,
  likedTagCounts: Map<string, number>,
): RecommendationItem[] {
  const scored = pool.map((t) => ({
    trip: t,
    score: fallbackScore(t, userTags, likedTagCounts),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TARGET_RECOMMENDATIONS).map((s) => ({
    trip: s.trip,
    reason: fallbackReason(s.trip, userTags),
  }))
}

// ───── 프롬프트 빌더 ─────

interface UserInfoForPrompt {
  preferences: string[]
  likedTitles: string[]
  likedTags: string[][]
}

function buildPrompt(
  user: UserInfoForPrompt,
  pool: TripWithMetadata[],
): string {
  const userTagsText =
    user.preferences.length > 0
      ? user.preferences.join(", ")
      : "(아직 설정 안 함)"

  const likedText =
    user.likedTitles.length > 0
      ? user.likedTitles
          .slice(0, 5)
          .map(
            (title, i) =>
              `  ${i + 1}. "${title}" (태그: ${user.likedTags[i]?.join("·") || "-"})`,
          )
          .join("\n")
      : "  (아직 없음)"

  const poolText = pool
    .map((trip, i) => {
      const region = trip.region || "지역 미지정"
      const tags = trip.tags.join("·") || "-"
      return `  ${i + 1}. [${trip.id}] "${trip.title}" - ${region} - ${tags} - 좋아요 ${trip._count.likes}`
    })
    .join("\n")

  return `당신은 데이트립이라는 데이트 코스 큐레이션 앱의 큐레이터입니다.
사용자에게 가장 잘 맞는 코스를 추천 순서대로 정렬해주세요.

# 사용자 정보
- 관심 태그: ${userTagsText}
- 최근 좋아요한 코스:
${likedText}

# 후보 코스 (${pool.length}개 중에서만 골라주세요)
${poolText}

# 응답 형식
다음 JSON 형식으로만 답변하세요. 다른 텍스트나 설명 포함 금지.

{
  "recommendations": [
    {"tripId": "후보 목록의 ID", "reason": "한 문장 추천 이유"}
  ]
}

# 규칙
- tripId는 반드시 위 후보 목록의 ID 중 하나여야 함 (새 ID 만들지 말 것)
- reason은 자연스러운 한국어 한 문장. 20-30자 정도
- 사용자 관심사를 자연스럽게 언급
- 최대 ${TARGET_RECOMMENDATIONS}개. 적절한 후보 부족하면 ${MIN_RECOMMENDATIONS}개까지 OK
- 같은 tripId 중복 금지`
}

// ───── Claude API 호출 ─────

async function callClaude(
  prompt: string,
): Promise<Array<{ tripId: string; reason: string }>> {
  const client = getAnthropicClient()

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    messages: [{ role: "user", content: prompt }],
  })

  const textBlock = response.content.find((c) => c.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude 응답에서 text 블록을 찾을 수 없음")
  }

  // JSON 추출. 코드 펜스 안일 수도 바깥일 수도 있음
  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Claude 응답에서 JSON을 파싱할 수 없음")
  }

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed || !Array.isArray(parsed.recommendations)) {
    throw new Error("Claude 응답에 recommendations 배열이 없음")
  }

  return parsed.recommendations.map(
    (r: { tripId?: unknown; reason?: unknown }) => ({
      tripId: String(r.tripId ?? ""),
      reason: String(r.reason ?? "추천드려요"),
    }),
  )
}

// ───── 메인 생성 함수 ─────

async function generateAndCacheRecommendation(
  userId: string,
): Promise<RecommendationResult> {
  // 1. 사용자 정보 수집
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      preferences: true,
      likes: {
        select: { trip: { select: { title: true, tags: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!user) {
    throw new Error(`사용자를 찾을 수 없습니다: ${userId}`)
  }

  const userTags = new Set<string>(user.preferences)
  const likedTagCounts = new Map<string, number>()
  const likedTitles: string[] = []
  const likedTags: string[][] = []

  for (const like of user.likes) {
    likedTitles.push(like.trip.title)
    likedTags.push(like.trip.tags)
    for (const t of like.trip.tags) {
      likedTagCounts.set(t, (likedTagCounts.get(t) ?? 0) + 1)
      userTags.add(t)
    }
  }

  // 2. 후보 풀 빌드
  const pool = await buildCandidatePool(userId, userTags)

  if (pool.length < MIN_RECOMMENDATIONS) {
    const fallback = buildFallback(pool, userTags, likedTagCounts)
    if (fallback.length > 0) {
      await saveToCache(userId, fallback, "fallback")
    }
    return {
      recommendations: fallback,
      source: "fallback",
      cached: false,
      generatedAt: new Date(),
    }
  }

  // 3. AI 호출 (키 있을 때만)
  let aiRecommendations: RecommendationItem[] | null = null
  if (hasApiKey) {
    try {
      const prompt = buildPrompt(
        { preferences: user.preferences, likedTitles, likedTags },
        pool,
      )
      const claudeResponse = await callClaude(prompt)

      // 응답 검증: 후보 풀에 있는 ID만, 중복 제거
      const validIds = new Set(pool.map((t) => t.id))
      const tripMap = new Map(pool.map((t) => [t.id, t]))
      const seenIds = new Set<string>()
      const validated: RecommendationItem[] = []

      for (const r of claudeResponse) {
        if (!validIds.has(r.tripId)) continue
        if (seenIds.has(r.tripId)) continue
        const trip = tripMap.get(r.tripId)
        if (!trip) continue
        validated.push({ trip, reason: r.reason })
        seenIds.add(r.tripId)
        if (validated.length >= TARGET_RECOMMENDATIONS) break
      }

      if (validated.length >= MIN_RECOMMENDATIONS) {
        aiRecommendations = validated
      } else {
        console.warn(
          `[recommend] Claude 응답이 검증 후 ${validated.length}개. 폴백 사용.`,
        )
      }
    } catch (error) {
      console.error("[recommend] Claude API 호출 실패:", error)
    }
  }

  // 4. 최종 결정
  const finalRecommendations =
    aiRecommendations ?? buildFallback(pool, userTags, likedTagCounts)
  const source: "ai" | "fallback" = aiRecommendations ? "ai" : "fallback"

  // 5. 캐시 저장
  await saveToCache(userId, finalRecommendations, source)

  return {
    recommendations: finalRecommendations,
    source,
    cached: false,
    generatedAt: new Date(),
  }
}
