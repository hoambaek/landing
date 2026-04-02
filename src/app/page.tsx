import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import SectionIndicator from "@/components/layout/SectionIndicator";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import ObservationSection from "@/components/sections/ObservationSection";
import DataArchiveSection from "@/components/sections/DataArchiveSection";
import TastingSection from "@/components/sections/TastingSection";
import ArchiveSection from "@/components/sections/ArchiveSection";
import TheMakerSection from "@/components/sections/TheMakerSection";

import OceanCircleSection from "@/components/sections/OceanCircleSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";

export default function Home() {
  return (
    <>
      <Header />
      {/* <SectionIndicator /> */}
      <ScrollReveal />
      <main id="main-content">
        <HeroSection />
        <div className="s-bridge" aria-hidden="true">
          <span className="s-bridge__rule" />
          <p className="s-bridge__text">
            <span className="s-bridge__line">샹파뉴의 떼루아에서 태어난 샴페인이</span>
            <span className="s-bridge__line">대한민국 남해의 바다에서</span>
            <span className="s-bridge__line s-bridge__line--accent">두 번째 시간을 보냅니다.</span>
          </p>
          <span className="s-bridge__rule" />
        </div>
        <ObservationSection />
        <Suspense
          fallback={
            <section id="data-archive" className="s-data" style={{ minHeight: "100vh" }} />
          }
        >
          <DataArchiveSection />
        </Suspense>
        <TastingSection />
        <ArchiveSection />
        <TheMakerSection />
        <div className="s-diptych">
          <OceanCircleSection />
          <ProfessionalsSection />
        </div>
      </main>
      <Footer hideSubscribe />
    </>
  );
}
