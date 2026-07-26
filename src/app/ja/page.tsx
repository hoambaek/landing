import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { buildAlternates } from "@/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildAlternates("ja"),
  openGraph: { locale: "ja_JP" },
};

export default function JaHome() {
  return <LandingPage locale="ja" />;
}
