import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { HomeJsonLd } from "@/components/JsonLd";
import { buildAlternates, sharedOg, sharedTwitter } from "@/i18n/metadata";

const title = "Muse de Marée | Champagne vieilli en mer";
const description =
  "En ce moment même, une bouteille de champagne inscrit le temps au fond de la mer. Chaque cuvée est un relevé, veiller sur le temps que la mer a façonné.";

export const metadata: Metadata = {
  title,
  description,
  alternates: buildAlternates("fr"),
  openGraph: {
    ...sharedOg,
    locale: "fr_FR",
    title,
    description,
  },
  twitter: {
    ...sharedTwitter,
    title,
    description,
  },
};

export default function FrHome() {
  return (
    <>
      <HomeJsonLd />
      <LandingPage locale="fr" />
    </>
  );
}
