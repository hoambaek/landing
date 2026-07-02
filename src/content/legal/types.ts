/**
 * 법적 문서(이용약관·개인정보처리방침·쿠키 정책) 콘텐츠 구조.
 * 한국어 정본만 작성(2026-07-02 결정). 배포 전 변호사 감수 대상 — 특히 국외이전·약관 면책.
 */

export type LegalTable = {
  /** 표 캡션(선택) */
  caption?: string;
  rows: { label: string; value: string }[];
};

export type LegalSection = {
  heading: string;
  /** 문단 배열 — 각 항목이 한 문단 */
  body?: string[];
  table?: LegalTable;
};

export type LegalDoc = {
  slug: "terms" | "privacy" | "cookies";
  title: string;
  /** 예: "2026. 07. 02." */
  effectiveDate: string;
  intro?: string;
  sections: LegalSection[];
  /** 하단 각주(선택) */
  footnote?: string;
};
