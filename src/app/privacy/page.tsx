import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { privacyDoc } from "@/content/legal/privacy";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Muse de Marée",
  description: "뮤즈드마레 개인정보처리방침 — 수집 항목, 이용 목적, 보유기간, 국외이전, 권리 행사 안내.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalShell doc={privacyDoc} />;
}
