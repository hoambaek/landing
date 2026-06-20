import Image from "next/image";

/**
 * S1 · Hero `void` — 수면 (Paper 01 — Hero 1:1)
 * 정적 히어로: h3 배경 + Cool Shadow Grade + Scrim/Top Blur + H1 + 브랜드 라인.
 * 데스크톱 3행("시간을 기록하고 있습니다") / 모바일 5행("1년의 시간을 보내고 있습니다") 아트디렉션.
 */
export default function HeroSection() {
  return (
    <section id="void" className="s-void">
      {/* 배경 이미지 — 데스크톱 h3 / 모바일 h3_m2 */}
      <picture className="s-void__bg">
        <source media="(max-width: 768px)" srcSet="/images/h3_m2.webp" />
        <Image
          src="/images/h3.webp"
          alt="남해 수심 30m, 케이지에 든 한 병의 샴페인 · Muse de Marée"
          fill
          priority
          sizes="100vw"
          className="s-void__bg-img"
          unoptimized
        />
      </picture>

      {/* Cool Shadow Grade — 그림자 쿨 토닝 (데스크톱) */}
      <div className="s-void__grade" aria-hidden="true" />

      {/* Hero Scrim — 좌하단 텍스트 가독 스크림 (데스크톱) */}
      <div className="s-void__scrim" aria-hidden="true" />

      {/* Top Blur — 프로스티드 블러 (모바일). Lightning CSS가 raw backdrop-filter를
          제거하므로 인라인으로 적용 (Header와 동일 우회) */}
      <div
        className="s-void__topblur"
        aria-hidden="true"
        style={{ backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(15px)" }}
      />

      {/* 카피 — 데스크톱 (좌측 정렬, 3행) */}
      <div className="s-void__content s-void__content--desktop">
        <h1 className="s-void__h1">
          <Image
            src="/text/hero-h1-d.png"
            alt="지금 이 순간에도, 한 병의 샴페인이 바다 아래에서 시간을 기록하고 있습니다"
            width={563}
            height={182}
            priority
            className="s-void__h1-img"
          />
        </h1>
        <p className="s-void__brand">
          <span className="s-void__brand-label">해저숙성 샴페인</span>
          <Image
            src="/text/brand-name.png"
            alt="뮤즈드마레"
            width={107}
            height={28}
            className="s-void__brand-name-img"
          />
        </p>
      </div>

      {/* 카피 — 모바일 (중앙 정렬, 지정 줄바꿈 4행) */}
      <div className="s-void__content s-void__content--mobile">
        <h1 className="s-void__h1">
          <Image
            src="/text/hero-h1-m.png"
            alt="지금 이 순간에도 한 병의 샴페인이 바다 아래에서 시간을 기록하고 있습니다"
            width={255}
            height={150}
            priority
            className="s-void__h1-img"
          />
        </h1>
        <p className="s-void__brand">
          <span className="s-void__brand-label">해저숙성 샴페인</span>
          <Image
            src="/text/brand-name.png"
            alt="뮤즈드마레"
            width={107}
            height={28}
            className="s-void__brand-name-img"
          />
        </p>
      </div>

      {/* 스크롤 힌트 */}
      <div className="s-void__scroll" aria-hidden="true">↓</div>
    </section>
  );
}
