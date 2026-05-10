// 닉네임 유효성 검증.
// 클라이언트(폼)와 서버(액션) 양쪽에서 같은 규칙을 적용하기 위해 분리.
//
// 정책:
// - 2-15자
// - 한글, 영문, 숫자, 언더스코어 허용
// - 공백, 특수문자 불가
// - 중복은 DB unique 제약으로 처리 (이 함수는 형식만 검증)

export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9_]{2,15}$/

export type NicknameValidation =
  | { ok: true }
  | { ok: false; error: string }

export function validateNickname(input: string): NicknameValidation {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { ok: false, error: "닉네임을 입력해주세요" }
  }
  if (trimmed.length < 2) {
    return { ok: false, error: "닉네임은 2자 이상이어야 해요" }
  }
  if (trimmed.length > 15) {
    return { ok: false, error: "닉네임은 15자 이하여야 해요" }
  }
  if (!NICKNAME_REGEX.test(trimmed)) {
    return {
      ok: false,
      error: "한글, 영문, 숫자, 언더스코어(_)만 사용 가능해요",
    }
  }
  return { ok: true }
}
