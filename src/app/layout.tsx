import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Noto_Sans_KR,
  Noto_Serif_KR,
  Diphylleia,
  DM_Mono,
  Gowun_Batang,
} from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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

const jjFont = localFont({
  src: "../../public/jj.ttf",
  variable: "--font-jj",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muse de Marée — 바다의 시간을 담은 샴페인",
  description:
    "한국 심해에서 숙성한 샴페인. 바다의 시간을 기록하는 디지털 아카이브.",
  openGraph: {
    title: "Muse de Marée",
    description: "바다의 시간을 담은 샴페인",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${cormorant.variable} ${notoSansKR.variable} ${notoSerifKR.variable} ${diphylleia.variable} ${dmMono.variable} ${gowunBatang.variable} ${jjFont.variable} antialiased`}
      >
        {children}
        <Script
          id="pretendard-css"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var l = document.createElement('link');
              l.rel = 'stylesheet';
              l.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
              l.crossOrigin = 'anonymous';
              document.head.appendChild(l);
            `,
          }}
        />
      </body>
    </html>
  );
}
