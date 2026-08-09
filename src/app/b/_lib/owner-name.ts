/**
 * 인증서에 세우는 로마자 표기를 만든다 — "이름 성" 순서(서양 증서 어법).
 *
 * 표기는 **첫 글자만 대문자, 나머지는 소문자**로 고른다(2026-08-08 대표 확정).
 * 등록자가 `hoam baek`으로 적든 `HOAM BAEK`으로 적든 인증서에는 `Hoam Baek`으로 선다.
 * 성만 전부 대문자로 세우는 여권식 표기를 먼저 시도했으나(같은 날 초안),
 * 브랜드 서명체(Mrs Saint Delafield) 위에서 대문자 덩어리가 이질적이라 물렸다.
 *
 * 하이픈·아포스트로피 뒤도 단어의 시작으로 본다 — `jean-pierre` → `Jean-Pierre`,
 * `o'brien` → `O'Brien`. 이 경계를 안 보면 남의 이름이 소문자로 깎인다.
 * (`McDonald`류 중간 대문자는 이 규칙으로 복원되지 않는다 — 표기 정본은 등록자의
 *  입력값이고, 여기서 하는 일은 표시용 정규화다.)
 *
 * ⚠️ 저장값은 건드리지 않는다. 대문자화·소문자화를 저장 시 굳히면 되돌릴 수 없다.
 */
function titleCase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/(^|[\s\-'’])(\p{L})/gu, (_, boundary: string, ch: string) => boundary + ch.toUpperCase());
}

export function formatOwnerLatin(
  given: string | null | undefined,
  family: string | null | undefined
): string | null {
  const g = typeof given === "string" ? given.trim() : "";
  const f = typeof family === "string" ? family.trim() : "";
  return [g, f].filter(Boolean).map(titleCase).join(" ") || null;
}
