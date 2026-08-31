import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { HomeJsonLd } from "@/components/JsonLd";
import { buildAlternates, sharedOg, sharedTwitter } from "@/i18n/metadata";

const title = "Muse de Marée | Undersea-Aged Champagne";
const description =
  "Even now, a bottle of champagne is recording time beneath the sea. Each cuvée is a record, holding in trust the time the sea has made.";

export const metadata: Metadata = {
  title,
  description,
  alternates: buildAlternates("en"),
  openGraph: {
    ...sharedOg,
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    ...sharedTwitter,
    title,
    description,
  },
};

export default function EnHome() {
  return (
    <>
      <HomeJsonLd />
      <LandingPage locale="en" />
    </>
  );
}
