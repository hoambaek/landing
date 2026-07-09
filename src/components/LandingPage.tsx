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
import { getOceanObservations } from "@/lib/ocean-observations";
import type { Locale } from "@/i18n/config";

/**
 * 언어별 랜딩 페이지 본체. `/`(ko)·`/en`·`/fr` 라우트가 각각 locale을 넘겨 재사용한다.
 * 딕셔너리를 서버에서 로드해 섹션에 조각으로 전달한다.
 */
export default async function LandingPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  /* Living Record 측정값 — method 페이지와 동일 소스(KHOA+Open-Meteo 실측).
     수온·해류만 라이브, 수심은 케이지 고정값(30m). API 실패 시 dict 고정값 폴백. */
  const ocean = await getOceanObservations().catch(() => null);
  const l = dict.living.log;
  /* method 페이지·plan data-log와 동일 소스(KHOA+Open-Meteo 실측).
     해류: Open-Meteo oceanCurrent가 자주 null이라, plan data-log처럼 KHOA 조류(tidalCurrent)
     실측을 다음 우선순위로 사용(외해 조류가 숙성 환경 대표값). 둘 다 없을 때만 폴백. */
  const currentMs = ocean?.oceanCurrent?.latest ?? ocean?.tidalCurrent?.latest ?? 1.2;
  const setNum = (s: string, re: RegExp, v: string) => s.replace(re, v);
  const liveLog = {
    temp: setNum(l.temp, /[\d.]+°C/, `${(ocean?.seaTemp?.latest ?? 14.8).toFixed(1)}°C`),
    current: setNum(l.current, /[\d.]+ m\/s/, `${currentMs.toFixed(1)} m/s`),
    depth: l.depth,
  };

  return (
    <>
      <HtmlLang locale={locale} />
      <Header locale={locale} dict={dict.header} />
      {/* <SectionIndicator /> */}
      <ScrollReveal />
      <main id="main-content">
        <HeroSection locale={locale} dict={dict.hero} />
        <TheLivingRecordSection locale={locale} dict={dict.living} liveLog={liveLog} />
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
