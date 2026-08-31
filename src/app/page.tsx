import LandingPage from "@/components/LandingPage";
import { HomeJsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <LandingPage locale="ko" />
    </>
  );
}
