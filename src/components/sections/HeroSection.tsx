import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * S1 · Hero `void` — 수면 (Paper 01 — Hero 1:1)
 * 정적 히어로: h3 배경 + Cool Shadow Grade + Scrim/Top Blur + H1 + 브랜드 라인.
 * ko는 특수 서체(J1950) PNG 타이틀, en/fr은 라틴 웹폰트 텍스트 타이틀.
 */
export default function HeroSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["hero"];
}) {
  const isKo = locale === "ko";

  /** 브랜드 라인 — ko는 로고 이미지, en/fr은 텍스트 */
  const brand = (
    <p className="s-void__brand">
      <span className="s-void__brand-label">{dict.brandLabel}</span>
      {isKo ? (
        <Image
          src="/text/brand-name.png"
          alt={dict.brandName}
          width={107}
          height={28}
          unoptimized
          className="s-void__brand-name-img"
        />
      ) : (
        <span className="s-void__brand-name-text">{dict.brandName}</span>
      )}
    </p>
  );

  /* #void-pin: DescentEffect ScrollTrigger의 pinSpacer로 미리 제공하는 래퍼.
     GSAP이 런타임에 pin-spacer를 만들어 섹션을 감싸면(DOM 재삽입) 진행 중이던
     CSS 인트로 애니메이션(void-settle 등)이 처음부터 재시작해 화면이 튄다. */
  return (
    <div id="void-pin">
    <section id="void" className="s-void" aria-labelledby="void-title">
      {/* 배경 이미지 — 데스크톱 h3 / 모바일 h3_m2 */}
      <picture className="s-void__bg">
        <source media="(max-width: 768px)" srcSet="/images/h3_m2_opt.webp" />
        <Image
          src="/images/h3.webp"
          alt={dict.bgAlt}
          fill
          priority
          sizes="100vw"
          className="s-void__bg-img"
          unoptimized
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwB0t6p5PSsy4vGYnBwKpGRmGSaiaQ1komjkWTcH1oqkXNFXYi5//9k="
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
        style={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
      />

      {/* 카피 — 단일 소스. ko 타이틀은 <picture>로 데스크톱(3행)/모바일(4행) 에셋 아트디렉션 */}
      <div className="s-void__content">
        <h1 id="void-title" className="s-void__h1">
          {isKo ? (
            <picture>
              <source media="(max-width: 768px)" srcSet="/text/hero-h1-m.png" />
              <Image
                src="/text/hero-h1-d.png"
                alt={dict.headline}
                width={563}
                height={182}
                priority
                unoptimized
                className="s-void__h1-img"
              />
            </picture>
          ) : (
            <span className="s-void__h1-text">{dict.headline}</span>
          )}
        </h1>
        {brand}
      </div>

      {/* 모토 서명 — 우하단 (푸터와 수미상관). 고정 모토라 전 로케일 공통 */}
      <span className="s-void__signature" aria-hidden="true">Written by the Sea.</span>

      {/* Descent Veil — 수면→심해 하강 전환 막. 기본 opacity 0,
          데스크톱에서 DescentEffect(GSAP 스크럽)가 제어 */}
      <div className="s-void__veil" aria-hidden="true" />
    </section>
    </div>
  );
}
