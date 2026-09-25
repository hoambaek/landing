import type { BottleLocale } from "./copy";

/**
 * 인증서 카드(Paper 04)의 문장 조립 — 증명문 · 등록일.
 *
 * 증명문은 로케일마다 어순과 수 표기가 달라 템플릿 한 줄로 치환하지 않는다
 * (한국어 조사 「가/이」, 고유어 수사 「열두 달」, 일본어 한자 수사 「十二か月」).
 * 그래서 로케일별 함수로 둔다. 문장은 병에 관한 사실만 적고 소유자를 꾸미지 않는다
 * (Paper SPEC A 데이터 주석).
 *
 * 인양은 배치의 인양일로 적는다. 이 페이지는 인양 후에 열리므로 모든 문장을 인양 후 시점으로
 * 쓴다(2026-09-25 대표 결정). 오늘 날짜로 인양 여부를 가르지 않는다. 배치에 인양일이 아예
 * 없을 때만 바다에 있다는 문장으로 물러선다(없는 날짜로 문장을 짓지 않는다).
 * 날짜는 Date를 만들지 않고 YYYY-MM-DD 문자열을 잘라 쓴다 — SSR과 하이드레이션이
 * 같은 문자열을 내야 하고, 서버가 이미 달력 날짜로 확정해 넘긴 값이다(data.ts).
 */

export interface AttestInput {
  serial: number | null;
  immersion: string | null; // YYYY-MM-DD
  retrieval: string | null;
  depth: number;
  months: number; // 숙성 개월 수 (duration.ts agingMonths)
}

function ym(iso: string | null): { y: string; m: number } | null {
  if (!iso) return null;
  const y = iso.slice(0, 4);
  const m = Number(iso.slice(5, 7));
  if (!/^\d{4}$/.test(y) || !(m >= 1 && m <= 12)) return null;
  return { y, m };
}

/* 한국어 숫자 끝소리 — 끝자리 2·4·5·9(이·사·오·구)만 모음으로 끝난다.
   0(십·백)·1(일)·3(삼)·6(육)·7(칠)·8(팔)은 받침이 있다. 입장 화면 「을/를」과 같은 규칙. */
function koVowelEnd(n: number): boolean {
  return [2, 4, 5, 9].includes(n % 10);
}

/* 개월 수를 말로 — 인증서 문장은 숫자보다 말이 맞다(「열두 달」). 36까지만 말로 쓰고
   그 너머는 숫자로 둔다(해저 숙성 라인은 12·24개월뿐이다). */
const KO_ONES = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];
const KO_TENS = ["", "열", "스물", "서른"];
function koMonths(n: number): string {
  if (n < 1 || n > 39) return `${n}개월`;
  const t = Math.floor(n / 10);
  const o = n % 10;
  /* 스물은 단위 명사 앞에서 「스무」가 된다(스무 달) */
  const head = o === 0 && t === 2 ? "스무" : KO_TENS[t];
  return `${head}${KO_ONES[o]} 달`;
}

const EN_WORDS = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
function enMonths(n: number): string {
  if (n < 1 || n > 39) return `${n} months`;
  let w: string;
  if (n < 20) w = EN_WORDS[n];
  else {
    const t = n < 30 ? "twenty" : "thirty";
    w = n % 10 ? `${t}-${EN_WORDS[n % 10]}` : t;
  }
  return `${w} ${n === 1 ? "month" : "months"}`;
}

const FR_WORDS = [
  "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf",
];
function frMonths(n: number): string {
  if (n < 1 || n > 39) return `${n} mois`;
  let w: string;
  if (n < 20) w = FR_WORDS[n];
  else {
    const t = n < 30 ? "vingt" : "trente";
    const o = n % 10;
    w = o === 0 ? t : o === 1 ? `${t} et un` : `${t}-${FR_WORDS[o]}`;
  }
  return `${w} mois`;
}

/* 한자 수사 — 일본어 「十二か月」, 중국어 「十二个月」 */
const CJK_DIGITS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function cjkNumber(n: number): string {
  if (n < 1 || n > 99) return String(n);
  const t = Math.floor(n / 10);
  const o = n % 10;
  const tens = t === 0 ? "" : t === 1 ? "十" : `${CJK_DIGITS[t]}十`;
  return `${tens}${CJK_DIGITS[o]}`;
}

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
/* 프랑스어 월 이름은 소문자가 정서법이다(문장 안) */
const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/**
 * 증명문. 입수일이 없는 병(배치 미등록)은 null — 없는 날짜로 문장을 짓지 않는다.
 * ko·ja·zh는 줄바꿈(\n)을 손으로 잡는다(CLAUDE.md 줄바꿈 통제).
 * en·fr은 띄어쓰기가 있어 폭에 맞춰 흐르게 두고 CSS가 줄 길이를 고른다.
 */
export function attestation(locale: BottleLocale, a: AttestInput): string | null {
  const imm = ym(a.immersion);
  if (!imm) return null;
  const ret = ym(a.retrieval);
  const n = a.serial;
  const d = a.depth;

  switch (locale) {
    case "ko": {
      const subj = n !== null ? `N° ${n}${koVowelEnd(n) ? "가" : "이"} ` : "";
      const head = `이 증서는 ${subj}${imm.y}년 ${imm.m}월 남해 수심 ${d}m에`;
      return ret
        ? `${head}\n입수되어 ${koMonths(a.months)}을 보낸 뒤,\n${ret.y}년 ${ret.m}월 인양되었음을 증명합니다.`
        : `${head}\n입수되어 지금도 바다에서\n숙성 중임을 증명합니다.`;
    }
    case "en": {
      const subj = n !== null ? `N° ${n}` : "this bottle";
      const head = `This certifies that ${subj} was immersed ${d} m deep in the Namhae sea in ${EN_MONTHS[imm.m - 1]} ${imm.y}`;
      return ret
        ? `${head}, spent ${enMonths(a.months)} there, and was raised in ${EN_MONTHS[ret.m - 1]} ${ret.y}.`
        : `${head}, where it is still aging.`;
    }
    case "fr": {
      const subj = n !== null ? `le N° ${n}` : "cette bouteille";
      const agree = n !== null ? "" : "e";
      const head = `Ce certificat atteste que ${subj} a été immergé${agree} à ${d} m de profondeur dans la mer de Namhae en ${FR_MONTHS[imm.m - 1]} ${imm.y}`;
      return ret
        ? `${head}, y a passé ${frMonths(a.months)}, puis a été remonté${agree} en ${FR_MONTHS[ret.m - 1]} ${ret.y}.`
        : `${head}, où ${n !== null ? "il" : "elle"} vieillit encore.`;
    }
    case "ja": {
      const subj = n !== null ? `N° ${n} が` : "";
      const head = `この証書は、${subj}${imm.y}年${imm.m}月に\n南海（ナムヘ）水深${d}mへ投入され、`;
      return ret
        ? `${head}\n${cjkNumber(a.months)}か月を過ごしたのち、${ret.y}年${ret.m}月に\n引き揚げられたことを証明します。`
        : `${head}\nいまも海中で熟成が続いていることを\n証明します。`;
    }
    case "zh": {
      const subj = n !== null ? ` N° ${n} ` : "";
      const head = `本证书证明${subj}于${imm.y}年${imm.m}月\n在南海水深${d}m处入水，`;
      return ret
        ? `${head}历经${cjkNumber(a.months)}个月，\n于${ret.y}年${ret.m}月打捞出水。`
        : `${head}\n至今仍在海中熟成。`;
    }
  }
}

/**
 * 등록일 — 읽는 사람의 나라 표기. Intl을 쓰지 않는다(런타임 로케일 데이터에 따라
 * 쉼표·마침표가 갈린다 — 인증서는 표기가 고정이어야 한다). 월·일에 0을 채우지 않는다.
 * 날짜가 아닌 값이 오면 null — 「NaN일」을 찍느니 비운다.
 */
export function registeredDate(iso: string | null | undefined, locale: BottleLocale): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  const mi = Number(m) - 1;
  const day = Number(d);
  if (!y || !(mi >= 0 && mi <= 11) || !Number.isFinite(day)) return null;
  if (locale === "ko") return `${y}년 ${mi + 1}월 ${day}일`;
  if (locale === "ja" || locale === "zh") return `${y}年${mi + 1}月${day}日`;
  if (locale === "fr") return `${day} ${FR_MONTHS[mi]} ${y}`;
  return `${day} ${EN_MONTHS[mi]} ${y}`;
}
