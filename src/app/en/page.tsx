import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { buildAlternates } from "@/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildAlternates("en"),
  openGraph: { locale: "en_US" },
};

export default function EnHome() {
  return <LandingPage locale="en" />;
}
