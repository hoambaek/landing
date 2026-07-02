import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { buildAlternates } from "@/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildAlternates("fr"),
  openGraph: { locale: "fr_FR" },
};

export default function FrHome() {
  return <LandingPage locale="fr" />;
}
