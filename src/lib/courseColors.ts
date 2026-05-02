// 코스마다 자동으로 색을 할당하는 유틸리티.
//
// 정책:
// - 8색 큐레이션된 팔레트 사용. 9색 이상은 사람 뇌가 한눈에 구분하기 어려움.
// - 색 선택은 코스 ID에서 deterministic하게 결정 (같은 코스는 항상 같은 색).
// - 미니멀 톤에 맞춰 채도 낮춘 부드러운 색조 (무지개 X).
//
// 향후 확장: 사용자가 코스마다 색을 직접 고르고 싶다면, Trip 모델에
// `colorIndex` 필드를 추가하고 이 함수의 인자를 colorIndex로 바꾸면 됨.

export const COURSE_COLOR_PALETTE = [
  "#E91E63", // 마젠타
  "#7C3AED", // 바이올렛
  "#FF5252", // 코랄 레드
  "#3D5AFE", // 인디고
  "#F50057", // 핫 핑크
  "#FF6D00", // 다크 오렌지
  "#00897B", // 다크 틸
  "#FBC02D", // 머스타드
] as const

/**
 * 코스 ID로부터 팔레트 색을 deterministic하게 결정.
 * cuid는 시간순으로 정렬되는 ID라 단순 해시로도 분포가 충분히 균일함.
 */
export function getCourseColor(courseId: string): string {
  let hash = 0
  for (let i = 0; i < courseId.length; i++) {
    hash = (hash << 5) - hash + courseId.charCodeAt(i)
    hash |= 0 // 32비트 정수로 변환
  }
  const index = Math.abs(hash) % COURSE_COLOR_PALETTE.length
  return COURSE_COLOR_PALETTE[index]
}
