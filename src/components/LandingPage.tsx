import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HtmlLang from "@/components/HtmlLang";
// import SectionIndicator from "@/components/layout/SectionIndicator";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import TheLivingRecordSection from "@/components/sections/TheLivingRecordSection";
import TheFirstRecordSection from "@/components/sections/TheFirstRecordSection";
import ArchiveSection from "@/components/sections/ArchiveSection";
import TheMakerSection from "@/components/sections/TheMakerSection";
import OceanCircleSection from "@/components/sections/OceanCircleSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/**
 * 언어별 랜딩 페이지 본체. `/`(ko)·`/en`·`/fr` 라우트가 각각 locale을 넘겨 재사용한다.
 * 딕셔너리를 서버에서 로드해 섹션에 조각으로 전달한다.
 */
export default async function LandingPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <>
      <HtmlLang locale={locale} />
      <Header locale={locale} dict={dict.header} />
      {/* <SectionIndicator /> */}
      <ScrollReveal />
      <main id="main-content">
        <HeroSection locale={locale} dict={dict.hero} />
        <TheLivingRecordSection locale={locale} dict={dict.living} />
        <TheFirstRecordSection locale={locale} dict={dict.first} />
        <ArchiveSection locale={locale} dict={dict.collection} />
        <TheMakerSection locale={locale} dict={dict.maker} />
        <OceanCircleSection dict={dict.oceanCellar} />
        <ProfessionalsSection dict={dict.partnership} />
      </main>
      <Footer locale={locale} dict={dict.footer} />
    </>
  );
}
