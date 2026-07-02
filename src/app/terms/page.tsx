import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { termsDoc } from "@/content/legal/terms";

export const metadata: Metadata = {
  title: "이용약관 | Muse de Marée",
  description: "뮤즈드마레 웹사이트 이용약관.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <LegalShell doc={termsDoc} />;
}
