import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Serif_JP, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/* 일본어·중국어 세리프 (2026-08-08 신설).
   그전까지 이 사이트에 실린 CJK 세리프는 Noto Serif KR 하나뿐이었다. 실측하면:
   ja 지면의 CJK 257자 중 Noto Serif KR이 못 덮는 것은 歴·証·録·戻 넷인데(전부 일본
   신자체) 하필 표제 「熟成履歴証明書」에 둘이 들어 있어 한 줄이 두 서체로 갈렸고,
   zh 지면은 한자 66자 중 30자(陈·酿·证·书·查…)가 어느 로드 폰트에도 없어 절반이
   시스템 폴백으로 돌고 있었다. 중국어 폰트는 아예 없었다.
   자형도 문제다 — 같은 한자라도 KR·JP·SC 자형이 다르다. 한국 폰트로 일본어를 그리면
   일본 독자에게 먼저 보이는 것이 그 어긋남이다.

   ⚠️ 루트 layout이 아니라 여기에 둔다. next/font의 CSS는 그 폰트를 선언한 레이아웃의
      CSS 청크에 들어가고 그 청크는 하위 전 페이지가 받는다 — preload를 꺼도 CSS는 받는다.
      루트에 두면 한국어 랜딩·블로그까지 쓰지도 않을 CJK @font-face 227개를 받는다.
      실측(2026-08-08 빌드 대조): 루트에 두면 전 페이지 CSS +189,213B(brotli +37,482B),
      /b에 두면 마케팅 지면 부담 0. 이 레이아웃이 이미 Plex Mono를 같은 방식으로 잡고 있다.

   축은 200~900 가변이라 weight를 적지 않는다(고정 굵기를 적으면 굵기마다 유니코드
   조각을 통째로 따로 받는다 — 루트 layout의 Noto Sans KR 주석 참조).
   preload는 끈다. 브라우저가 unicode-range를 보고 실제 쓰인 글자의 조각만 가져온다 —
   ko 세션은 JP·SC 조각을 한 개도 받지 않는다. */
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-serif-jp",
  display: "swap",
  preload: false,
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-serif-sc",
  display: "swap",
  preload: false,
});

/* 중국어 산세리프 (2026-08-09). 일본어 산세리프는 루트 layout이 이미 물고 있어
   (--font-ja-body, 랜딩 ja 본문이 쓰는 그 폰트) /b에서 추가로 받을 것이 없다.
   중국어만 이 사이트에 한 벌도 없어 여기서 새로 잡는다 — 세리프 두 벌과 같은 자리다.
   ⚠️ 루트가 아니라 여기다. 루트에 두면 한국어 랜딩·블로그가 쓰지도 않을 @font-face를
      떠안는다(위 세리프 주석의 실측 참조). 축은 100~900 가변이라 weight를 적지 않고,
      preload는 끈다 — 브라우저가 unicode-range를 보고 실제 쓰인 글자만 가져온다. */
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans-sc",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Muse de Marée · Record",
  description: "바다가 새긴 일 년 — 병 단위 해저 숙성 기록",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0908",
};

export default function BottleLayout({ children }: { children: React.ReactNode }) {
  /* b-root — globals.css가 이 마커로 루트 배경을 void로 돌린다(안전영역 틴트).
     themeColor 메타는 iOS 26이 무시하므로 html 배경이 유일한 수단이다. */
  return (
    <div
      className={`b-root ${plexMono.variable} ${notoSerifJP.variable} ${notoSerifSC.variable} ${notoSansSC.variable}`}
    >
      {children}
    </div>
  );
}
