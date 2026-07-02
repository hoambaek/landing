import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/JsonLd";
import AgeGate from "@/components/legal/AgeGate";
import {
  Cormorant_Garamond,
  Cormorant_Infant,
  Noto_Sans_KR,
  Noto_Serif_KR,
  Diphylleia,
  DM_Mono,
  Gowun_Batang,
  EB_Garamond,
  Mrs_Saint_Delafield,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-heading",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-body",
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400"],
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

const cormorantInfant = Cormorant_Infant({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant-infant",
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
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${cormorant.variable} ${cormorantInfant.variable} ${notoSansKR.variable} ${notoSerifKR.variable} ${diphylleia.variable} ${dmMono.variable} ${gowunBatang.variable} ${ebGaramond.variable} ${mrsSaintDelafield.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
        <JsonLd />
        {children}
        <AgeGate />
      </body>
    </html>
  );
}
