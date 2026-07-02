import type { Locale } from "@/i18n/config";

/**
 * 연령확인(19세) 게이트 · 미성년 안내(exit) 카피 — 로케일별.
 *
 * 법적 배경: 뮤즈드마레는 주류(샴페인) 브랜드 광고 표면 → 국민건강증진법 제8조의2.
 * 오크니는 주류수출입업면허(나, 면허번호 409-2-00256) 보유로 주류광고 자격 확보.
 * 미성년자 접근 제한(연령 게이트) + 경고문구 표기가 권고 사항.
 *
 * 경고문구(warning)는 보건복지부 고시 문구를 그대로 사용하며, 법적 문구이므로
 * en/fr 로케일에서도 한국어 원문을 유지한다(푸터 정책과 동일 기준).
 */

export type AgeGateCopy = {
  eyebrow: string;
  title: string;
  body: string; // \n 으로 줄 구분
  confirm: string;
  deny: string;
  warningLabel: string; // "경고" — 사각형 박스 안에 "경고 :" 로 표기
  warning: string;
};

export type ExitCopy = {
  eyebrow: string;
  title: string;
  body: string; // \n 으로 줄 구분
  back: string;
  metaTitle: string;
  metaDesc: string;
};

// 보건복지부 고시 경고문구 — 푸터 정본과 동일 문구. \n으로 문장 단위 줄바꿈(Paper 디자인 일치)
const WARNING_KO =
  "알코올은 발암물질로 지나친 음주는 간암, 위암 등을 일으킵니다.\n임신 중 음주는 기형아 출생 위험을 높입니다.";

export const ageGateCopy: Record<Locale, AgeGateCopy> = {
  ko: {
    eyebrow: "muse de marée",
    title: "만 19세 이상이신가요?",
    body: "뮤즈드마레는 바다의 시간을 기록하는 주류 브랜드입니다.\n대한민국 법률에 따라 만 19세 미만은 입장하실 수 없습니다.",
    confirm: "네, 만 19세 이상입니다",
    deny: "아니요, 19세 미만입니다",
    warningLabel: "경고",
    warning: WARNING_KO,
  },
  en: {
    eyebrow: "muse de marée",
    title: "Are you 19 or older?",
    body: "Muse de Marée is an alcohol brand that records the time of the sea.\nUnder Korean law, visitors under the age of 19 may not enter.",
    confirm: "Yes, I am 19 or older",
    deny: "No, I am under 19",
    warningLabel: "경고",
    warning: WARNING_KO,
  },
  fr: {
    eyebrow: "muse de marée",
    title: "Avez-vous 19 ans ou plus ?",
    body: "Muse de Marée est une marque de spiritueux qui consigne le temps de la mer.\nConformément à la loi coréenne, l'accès est interdit aux personnes de moins de 19 ans.",
    confirm: "Oui, j'ai 19 ans ou plus",
    deny: "Non, j'ai moins de 19 ans",
    warningLabel: "경고",
    warning: WARNING_KO,
  },
};

export const exitCopy: Record<Locale, ExitCopy> = {
  ko: {
    eyebrow: "à bientôt",
    title: "다음에 다시 만나요",
    body: "뮤즈드마레는 만 19세 이상을 위한 공간입니다.\n성인이 되어 다시 찾아주세요.",
    back: "돌아가기",
    metaTitle: "Muse de Marée",
    metaDesc: "만 19세 이상을 위한 공간입니다.",
  },
  en: {
    eyebrow: "à bientôt",
    title: "See you soon",
    body: "Muse de Marée is intended for those aged 19 and over.\nPlease come back once you are of age.",
    back: "Go back",
    metaTitle: "Muse de Marée",
    metaDesc: "This site is intended for visitors aged 19 and over.",
  },
  fr: {
    eyebrow: "à bientôt",
    title: "À bientôt",
    body: "Muse de Marée est réservé aux personnes âgées de 19 ans et plus.\nRevenez nous voir une fois majeur.",
    back: "Retour",
    metaTitle: "Muse de Marée",
    metaDesc: "Ce site est réservé aux personnes âgées de 19 ans et plus.",
  },
};
