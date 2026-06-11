/** 폼 입력 검증 유틸 (클라이언트·서버 공용 동기 함수) */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
