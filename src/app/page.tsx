import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/layout/SectionIndicator";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import ObservationSection from "@/components/sections/ObservationSection";
import DataArchiveSection from "@/components/sections/DataArchiveSection";
import TheMakerSection from "@/components/sections/TheMakerSection";
import ArchiveSection from "@/components/sections/ArchiveSection";
import OceanCircleSection from "@/components/sections/OceanCircleSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";

export default function Home() {
  return (
    <>
      <Header />
      <SectionIndicator />
      <ScrollReveal />
      <main>
        <HeroSection />
        <ObservationSection />
        <DataArchiveSection />
        <ArchiveSection />
        <TheMakerSection />
        <OceanCircleSection />
        <ProfessionalsSection />
      </main>
      <Footer />
    </>
  );
}
