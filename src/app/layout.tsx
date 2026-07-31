import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import JsonLd from "@/components/JsonLd";
import AgeGate from "@/components/legal/AgeGate";
import {
  Cormorant_Garamond,
  Noto_Sans_KR,
  Noto_Serif_KR,
  Diphylleia,
  DM_Mono,
  Gowun_Batang,
  EB_Garamond,
  Mrs_Saint_Delafield,
  Instrument_Sans,
  Special_Elite,
  New_Tegomin,
  Noto_Sans_JP,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-heading",
  display: "swap",
});

/* 라틴 표제 — 한국어 표제의 J1950에 대응하는 활자. 타자기 활자를 옮긴 얼굴이라
   금속 활자 인쇄의 성격을 공유한다. 이탤릭이 없으므로(굵기도 400 하나) 쓰는 쪽에서
   font-style을 normal로 잡아야 한다 — 두면 브라우저가 억지로 기울인 자형을 만든다.
   프랑스어 악센트는 213자 안에 전부 들어 있다(À à ç è é ê ù É û 확인). */
const specialElite = Special_Elite({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-title-latin",
  display: "swap",
});

/* 일본어 표제 — 한국어 표제의 J1950(1950년대 활자)에 대응하는 옛 활자체.
   dassai.com 구성(Noto Serif JP)으로 교체했다가 대표 지시(2026-07-30)로 원복 —
   표제는 New Tegomin, 본문만 Noto Sans JP로 바꾼다.
   구글 폰트가 글자 조각(unicode-range) 단위로 내보내므로 쓰인 글자만 내려받는다.
   굵기는 400 하나뿐이다. */
const newTegomin = New_Tegomin({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ja-title",
  display: "swap",
  /* preload을 켜두면 일본어 조각 전부를 모든 페이지에서 미리 받는다(한국어 페이지 포함).
     끄면 브라우저가 unicode-range를 보고 실제 쓰인 글자의 조각만 가져온다. */
  preload: false,
});

/* 일본어 본문 — dassai.com과 같은 구성으로 Noto Sans JP(고딕)로 교체
   (대표 지시 2026-07-30). 가변 폰트라 축이 100~900이다 — weight 미지정. */
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-ja-body",
  display: "swap",
  preload: false, // 위와 같은 이유
});

/* weight를 적지 않는다 — Noto Sans KR은 가변 폰트라 축(100~900) 하나로 받는다.
   고정 굵기 3개를 적으면 굵기마다 유니코드 조각을 통째로 따로 받는다.
   실측(2026-07-27): 300;400;500 → @font-face 372개, 가변축 → 124개.
   빌드가 fonts.gstatic.com에서 받아오는 파일이 그만큼 줄고, 화면은 그대로다
   (300·400·500이 축 위의 값으로 그대로 나온다). */
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* 이쪽도 가변 폰트다(축 200~900). 300;400 고정 → 248개, 가변축 → 124개.
   ⚠️ 축이 100이 아니라 200에서 시작한다 — wght@100..900으로 물어보면 구글이 빈 응답을 준다.
   가변 지원 여부를 확인할 때 100부터 잡고 없다고 판단하지 말 것. */
const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif-kr",
  display: "swap",
});

const diphylleia = Diphylleia({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hero",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
  display: "swap",
});

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-batang",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const mrsSaintDelafield = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-delafield",
  display: "swap",
});

/* 라틴 본문(en·fr) — 정본 02는 "폰트를 스크립트별로 분리한다"를 원칙으로 둔다.
   Noto Sans KR의 라틴은 한글용 폰트에 딸려온 것이라 영·불 본문에는 자간·자형이 헐겁다.
   표제의 EB Garamond(획 대비가 큰 고전 세리프)와 대비를 이루는 현대 그로테스크를 쓴다.

   Instrument Sans에는 굵기 300이 없다(400~700). 사이트가 300으로 지정한 자리는
   가장 가까운 400으로 떨어진다 — 브라우저는 가는 쪽으로 합성하지 않으므로
   자형이 뭉개지지는 않고, 본문이 지금보다 조금 단단해질 뿐이다. */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-latin",
  display: "swap",
});

// 입장 페이지 에디션 넘버(블루 스톤 플레이트) 전용 — 얇은 지오메트릭
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0908",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.musedemaree.com"),
  title: "Muse de Marée | 바다의 시간을 담은 샴페인",
  description:
    "샴페인 하우스가 아니라, 바다의 시간을 기록하는 브랜드. 프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m에서 숙성하고, 입수부터 인양까지의 기록과 함께 병을 건넵니다. 2026년 런칭.",
  alternates: {
    canonical: "/",
    languages: {
      ko: "/",
      en: "/en",
      fr: "/fr",
      ja: "/ja",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": "https://blog.musedemaree.com/feed.xml",
    },
  },
  keywords: [
    "해저 숙성 샴페인",
    "underwater aged champagne",
    "바다의 시간을 기록하는 브랜드",
    "Muse de Marée",
    "뮤즈드마레",
    "한국 남해 해저 숙성",
    "기록과 함께 오는 샴페인",
    "ocean aged champagne",
    "해저 와인 숙성",
    "Champagne Mignon Boulard",
  ],
  openGraph: {
    title: "Muse de Marée | 바다의 시간을 담은 샴페인",
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m에서 숙성합니다. 입수부터 인양까지, 바다의 시간을 기록해 병과 함께 건넵니다.",
    locale: "ko_KR",
    type: "website",
    siteName: "Muse de Marée",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Muse de Marée | 바다의 시간을 담은 샴페인",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muse de Marée | 바다의 시간을 담은 샴페인",
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 30m에서 숙성합니다. 입수부터 인양까지, 바다의 시간을 기록해 병과 함께 건넵니다.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "G-YVXMD6VF59";
  // 프로덕션 배포에서만 GA 작동 (preview·로컬 개발 트래픽 제외)
  const gaEnabled = process.env.VERCEL_ENV === "production" && !!gaId;
  return (
    /* lang은 HtmlLang이 로케일별로 덮어쓴다(정적 라우트라 서버가 locale을 모른다).
       하이드레이션 전에 바뀌므로 React가 불일치로 보고 — 이 속성만 검사에서 뺀다. */
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${cormorant.variable} ${notoSansKR.variable} ${notoSerifKR.variable} ${diphylleia.variable} ${dmMono.variable} ${gowunBatang.variable} ${ebGaramond.variable} ${mrsSaintDelafield.variable} ${instrumentSans.variable} ${specialElite.variable} ${newTegomin.variable} ${notoSansJP.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
        <JsonLd />
        {/* 일반 문서 스크롤. 안전영역 틴트는 html 배경색(모바일 아이보리)이 담당 —
            단 전면 fixed+이미지 요소(그레인)가 있으면 샘플링이 깨지므로 모바일에서 그레인 제거 */}
        <div id="scroll-root">{children}</div>
        <AgeGate />
        <Analytics />
        {gaEnabled && <GoogleAnalytics gaId={gaId} />}
        <AnalyticsEvents />
      </body>
    </html>
  );
}
