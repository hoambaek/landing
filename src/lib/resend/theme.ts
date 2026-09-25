/**
 * 발송 메일 공통 토큰 — Paper "Email — …" 아트보드(라이트 v3, 2026-09) 기준.
 *
 * 신청 확인 메일(ApplicantEmail, react-email)과 소유자 인증 메일(owner-actions의 HTML 문자열)이
 * 같은 종이·같은 활자를 쓰도록 값을 여기 한 곳에 둔다. 같은 브랜드가 보내는 메일이
 * 서로 다른 색으로 오면 다른 곳에서 온 것으로 읽힌다.
 */

/** 발송 메일의 이미지(로고)용 절대 URL */
export const MAIL_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://musedemaree.com";

export const MAIL_COLOR = {
  /** 메일 바깥 바탕 */
  canvas: "#E8E5E1",
  /** 카드(종이) */
  paper: "#F3EFE7",
  /** 푸터 띠 */
  paperDeep: "#EDE8E0",
  /** 코드 판 안쪽 */
  paperLight: "#FBF8F2",
  /** 카드 외곽선·구분선 */
  line: "#D9D1C3",
  /** 금색 헤어라인·명판 테 */
  gold: "#A8834A",
  /** 명판 안쪽 테 — 시안은 #A8834A 55% 알파다. Outlook이 테두리 rgba를 못 읽어
      종이색(#F3EFE7) 위에 미리 섞은 불투명값을 쓴다 */
  goldSoft: "#CAB491",
  /** 아이브로·작은 대문자 라벨 */
  goldText: "#8A6A38",
  ink: "#1C1A17",
  body: "#3A352E",
  muted: "#7C7264",
  faint: "#8C8273",
} as const;

/* ── 서체 스택 ── 한글 세리프 스택을 왜 이 순서로 두는지는 ApplicantEmail.tsx 스타일 블록 주석에 있다.
   스택 안의 따옴표는 홑따옴표다 — HTML 문자열 메일(shell.ts)이 style="…" 속성 안에 그대로 끼워 넣는다 */
export const MAIL_FONT = {
  /** 한글 제목·인증 메일 본문(세리프) */
  serifKo: "'Noto Serif KR', 'Noto Serif CJK KR', Georgia, serif",
  /** 라틴 세리프 — 아이브로·영문 제목·모토·카피라이트. 시안 서체는 Cormorant Garamond, 없으면 Georgia */
  latin: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  /** 숫자 전용 — Georgia는 기본 숫자가 올드스타일(키 작은 숫자)이라 번호·코드 자리에서 뺀다.
      Cormorant Garamond는 font-feature-settings 'lnum'으로 라이닝 숫자를 켜고(쓰는 자리에서 같이 건다),
      Times New Roman은 기본이 라이닝이다 */
  numeral: "'Cormorant Garamond', 'Times New Roman', Times, serif",
  /** 명판의 소유자 서명체 — 없는 기기에서는 맥·iOS 필기체(Snell Roundhand)로 받는다 */
  script: "'Mrs Saint Delafield', 'Snell Roundhand', 'Apple Chancery', cursive",
  sans: "'Noto Sans KR', -apple-system, 'Apple SD Gothic Neo', sans-serif",
} as const;

/** 웹폰트를 읽는 클라이언트(Apple Mail·iOS 메일)용. Gmail·Outlook은 이 링크를 버리고 위 스택으로 간다 */
export const MAIL_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Mrs+Saint+Delafield&display=swap";

export type MailLocale = "ko" | "en";

/** 푸터 회사정보 — 모토·카피라이트 줄을 뺀 세 줄. 언어를 따른다 */
export const MAIL_FOOTER_INFO: Record<MailLocale, string[]> = {
  ko: [
    "주식회사 오크니 · 대표 정설화 · 사업자등록번호 859-85-03139",
    "서울특별시 강남구 압구정로 306, B1 #6-J14",
    "고객 문의 info@musedemaree.com",
  ],
  en: [
    "Orkney Corp. · CEO Seolhwa Jeong · Reg. No. 859-85-03139",
    "306 Apgujeong-ro, Gangnam-gu, Seoul, Korea · B1 #6-J14",
    "Enquiries info@musedemaree.com",
  ],
};

/** 모토(고정)와 카피라이트 — 언어를 타지 않는다 */
export const MAIL_MOTTO = "Written by the Sea.";
export const MAIL_COPYRIGHT = "© 2026 MUSE DE MARÉE";
