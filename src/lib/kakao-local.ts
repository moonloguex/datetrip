// 카카오 로컬 API 호출 헬퍼. 서버 전용.
//
// 용도:
//   - 시드 스크립트: 장소명 → 좌표/주소 자동 채움
//   - 향후 활용 가능: 사용자 코스 데이터 보강, 좌표 검증 등
//
// API 문서: https://developers.kakao.com/docs/latest/ko/local/dev-guide
//
// 비용: 키워드 검색 API는 무료. 일일 호출 한도 존재 (개발자 콘솔에서 확인)
// Rate limit: 초당 약 30회. 시드 같은 일괄 호출은 짧은 sleep으로 여유 확보

const KAKAO_API_BASE = "https://dapi.kakao.com/v2/local"

export interface KakaoPlace {
  /** 카카오 고유 장소 ID */
  id: string
  place_name: string
  /** 슬래시 구분 카테고리 ("음식점 > 카페 > 커피전문점") */
  category_name: string
  category_group_code: string
  category_group_name: string
  phone: string
  address_name: string
  road_address_name: string
  /** 경도 (longitude). 문자열로 옴 */
  x: string
  /** 위도 (latitude). 문자열로 옴 */
  y: string
  place_url: string
}

interface KakaoSearchResponse {
  documents: KakaoPlace[]
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
}

/**
 * 카카오 로컬 키워드 검색. 첫 번째 결과 반환 (없으면 null).
 *
 * region 힌트가 있으면 검색어 앞에 붙여 정확도 향상.
 * 예: query="블루보틀" + region="성수" → "성수 블루보틀" 검색
 *
 * 실패 시 (네트워크 에러, 401, 500 등) null 반환 + 콘솔 경고.
 * 호출자가 null 처리 책임짐 (시드 스크립트는 스킵+경고 패턴 사용).
 */
export async function searchKakaoPlace(
  query: string,
  options?: { region?: string; size?: number },
): Promise<KakaoPlace | null> {
  const apiKey = process.env.KAKAO_REST_API_KEY
  if (!apiKey) {
    console.error("[kakao-local] KAKAO_REST_API_KEY 환경변수가 없습니다")
    return null
  }

  const finalQuery = options?.region ? `${options.region} ${query}` : query
  const url = new URL(`${KAKAO_API_BASE}/search/keyword.json`)
  url.searchParams.set("query", finalQuery)
  url.searchParams.set("size", String(options?.size ?? 1))

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.error(
        `[kakao-local] HTTP ${response.status} for "${finalQuery}"`,
      )
      return null
    }

    const data = (await response.json()) as KakaoSearchResponse
    return data.documents[0] ?? null
  } catch (error) {
    console.error(`[kakao-local] fetch failed for "${finalQuery}":`, error)
    return null
  }
}

/**
 * 카카오 카테고리("음식점 > 카페 > 커피전문점") 중 가장 구체적인 마지막 단어 추출.
 * Trip 화면에 짧게 표시하기 좋은 형태.
 *
 * 예: "음식점 > 카페 > 커피전문점" → "커피전문점"
 *     "관광,명소 > 공원" → "공원"
 *     "" → null
 */
export function parseKakaoCategory(categoryName: string): string | null {
  if (!categoryName) return null
  const parts = categoryName.split(">").map((p) => p.trim())
  return parts[parts.length - 1] || null
}

/**
 * 간단한 sleep. 시드 스크립트의 rate limit 회피용.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
