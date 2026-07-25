import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
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
  return <div className={`b-root ${plexMono.variable}`}>{children}</div>;
}
