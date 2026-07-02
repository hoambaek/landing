import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { cookiesDoc } from "@/content/legal/cookies";

export const metadata: Metadata = {
  title: "쿠키 정책 | Muse de Marée",
  description: "뮤즈드마레 쿠키 정책 — 필수 쿠키만 사용, 분석·광고 쿠키 미사용.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return <LegalShell doc={cookiesDoc} />;
}
