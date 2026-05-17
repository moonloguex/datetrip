// 사용자 선호 태그 후보.
//
// tag id == label == DB 저장값 (모두 한글 동일).
// 이유: Trip.tags가 한글 문자열이므로 별도 lookup 없이 직접 매칭 가능.
// 그룹은 UI 표시 목적으로만 사용되며, DB에는 저장하지 않음.
//
// 시드 데이터의 주제 태그 분포와 동기화 유지 필요.

export const PREFERENCE_GROUPS = [
  {
    id: "mood",
    label: "분위기",
    tags: ["조용한", "활기찬"],
  },
  {
    id: "activity",
    label: "활동",
    tags: ["카페", "미식", "디저트", "산책", "자연"],
  },
  {
    id: "aesthetic",
    label: "스타일",
    tags: ["야경", "예술", "트렌디", "전통"],
  },
] as const

export const ALL_PREFERENCE_TAGS: readonly string[] = PREFERENCE_GROUPS.flatMap(
  (g) => g.tags,
)

export const PREFERENCE_TAG_SET = new Set(ALL_PREFERENCE_TAGS)
