import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { HomeJsonLd } from "@/components/JsonLd";
import { buildAlternates, sharedOg, sharedTwitter } from "@/i18n/metadata";

const title = "Muse de Marée | 海底熟成シャンパーニュ";
const description =
  "今この瞬間も、一本のシャンパーニュが海の底で時を重ねる。それぞれのキュヴェに、ひとつの海。その時間を、手のなかに。";

export const metadata: Metadata = {
  title,
  description,
  alternates: buildAlternates("ja"),
  openGraph: {
    ...sharedOg,
    locale: "ja_JP",
    title,
    description,
  },
  twitter: {
    ...sharedTwitter,
    title,
    description,
  },
};

export default function JaHome() {
  return (
    <>
      <HomeJsonLd />
      <LandingPage locale="ja" />
    </>
  );
}
