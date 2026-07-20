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
  return <div className={plexMono.variable}>{children}</div>;
}
