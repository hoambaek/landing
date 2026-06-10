import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import SectionIndicator from "@/components/layout/SectionIndicator";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import TheLivingRecordSection from "@/components/sections/TheLivingRecordSection";
import TheFirstRecordSection from "@/components/sections/TheFirstRecordSection";
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
        <TheLivingRecordSection />
        <TheFirstRecordSection />
        <ArchiveSection />
        <TheMakerSection />
        <OceanCircleSection />
        <ProfessionalsSection />
      </main>
      <Footer />
    </>
  );
}
