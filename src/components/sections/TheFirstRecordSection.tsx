import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * S3 · The First Record — 인양 (다크→라이트 클라이맥스, Paper 03 1:1)
 * 연속 그라데이션 배경 + Entry + 플레이트 4컷(데스크톱) / 3컷(모바일) + 타임코드 캡션 + Closing.
 * 이미지: rec01~04 (AI 시안 — 인양 실사 확보 시 교체).
 */
export default function TheFirstRecordSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["first"];
}) {
  const isKo = locale === "ko";
  return (
    <section id="the-first-record" className="s-first" aria-label="The First Record">
      {/* Entry */}
      <header className="s-first__entry reveal">
        <span className="s-first__eyebrow">{dict.eyebrow}</span>
        <p className="s-first__headline">
          {isKo ? (
            <picture>
              <source media="(max-width: 768px)" srcSet="/text/first-headline-m.png" />
              <Image
                src="/text/first-headline.png"
                alt={dict.headline}
                width={679}
                height={54}
                unoptimized
                className="s-first__headline-img"
              />
            </picture>
          ) : (
            <span className="s-first__headline-text">{dict.headline}</span>
          )}
        </p>
      </header>

      {/* 인양 기록 2컷 — 단일 소스, 반응형 (데스크톱 센터 / 모바일 블리드) */}
      <div className="s-first__rows">
        <figure className="s-first__row s-first__row--center s-first__row--bleed">
          <div className="s-first__plate s-first__plate--03 s-first__plate--m2">
            <Image src="/images/ai/rec03.webp" alt={dict.plateAlt.light} fill sizes="(max-width: 768px) 100vw, 920px" className="s-first__img" />
          </div>
        </figure>

        <span className="s-first__connector s-first__connector--dim" aria-hidden="true" />

        <figure className="s-first__row s-first__row--center">
          <div className="s-first__plate s-first__plate--04 s-first__plate--m3">
            <Image src="/images/ai/rec04.webp" alt={dict.plateAlt.manuscript} fill sizes="(max-width: 768px) 300px, 920px" className="s-first__img" />
          </div>
        </figure>
      </div>

      {/* Closing */}
      <footer className="s-first__closing reveal">
        <p className="s-first__closing-line">
          {isKo ? (
            <Image
              src="/text/first-closing.png"
              alt={dict.closing}
              width={350}
              height={104}
              unoptimized
              className="s-first__closing-img"
            />
          ) : (
            <span className="s-first__closing-text">{dict.closing}</span>
          )}
        </p>
      </footer>
    </section>
  );
}
