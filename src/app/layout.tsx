import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  Cormorant_Garamond,
  Cormorant_Infant,
  Noto_Sans_KR,
  Noto_Serif_KR,
  Diphylleia,
  DM_Mono,
  Gowun_Batang,
  EB_Garamond,
} from "next/font/google";
import localFont from "next/font/local";
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
  variable: "--font-eb-garamond",
  display: "swap",
});

const jjFont = localFont({
  src: "../../public/jj.ttf",
  variable: "--font-jj",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.musedemaree.com"),
  title: "Muse de Marée — 바다의 시간을 담은 샴페인",
  description:
    "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 숙성합니다. 바다의 온도, 해류, 수압이 만드는 시간의 기록. 2026년 런칭.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://blog.musedemaree.com/feed.xml",
    },
  },
  keywords: [
    "해저 숙성 샴페인",
    "underwater aged champagne",
    "럭셔리 샴페인",
    "Muse de Marée",
    "뮤즈드마레",
    "한국 심해 숙성",
    "프리미엄 샴페인",
    "ocean aged champagne",
    "해저 와인 숙성",
    "Champagne Mignon Boulard",
  ],
  openGraph: {
    title: "Muse de Marée — 바다의 시간을 담은 샴페인",
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 숙성합니다. 바다의 온도, 해류, 수압이 만드는 시간의 기록.",
    locale: "ko_KR",
    type: "website",
    siteName: "Muse de Marée",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Muse de Marée — 바다의 시간을 담은 샴페인",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muse de Marée — 바다의 시간을 담은 샴페인",
    description:
      "프랑스 샹파뉴에서 태어난 샴페인을 한국 남해 수심 50미터에서 숙성합니다. 바다의 온도, 해류, 수압이 만드는 시간의 기록.",
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
        className={`${cormorant.variable} ${cormorantInfant.variable} ${notoSansKR.variable} ${notoSerifKR.variable} ${diphylleia.variable} ${dmMono.variable} ${gowunBatang.variable} ${ebGaramond.variable} ${jjFont.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
