"use client";

import { CSSProperties, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * S5 · The Maker `the-maker` — 두 개의 서명 (웜 라이트, Paper 05 1:1)
 * 캐러셀: 슬라이드 01 Mignon Boulard(이미지 좌 + 텍스트 우) + 슬라이드 02 비공개 피크.
 * 카운터 01/02 + 티저 라인 + ‹› 버튼 + 스와이프. makers 배열로 확장 대비(10+).
 * maison·name·since·stat은 브랜드 고유명(프랑스어)이라 전 로케일 공통, desc만 dict 참조.
 */

type Maker = {
  maison: string;
  name: string;
  since: string;
  stat: string;
  image: string;
  revealed: boolean;
};

const MAKERS: Maker[] = [
  {
    maison: "MAISON N° 1 · VALLÉE DE LA MARNE",
    name: "Champagne\nMignon Boulard",
    since: "Venteuil · depuis 1911",
    stat: "4 GÉNÉRATIONS · 49 PARCELLES\nRÉSERVE PERPÉTUELLE",
    image: "/images/m1.webp",
    revealed: true,
  },
  {
    maison: "",
    name: "coming soon",
    since: "",
    stat: "",
    image: "/images/m2.webp",
    revealed: false,
  },
];

export default function TheMakerSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["maker"];
}) {
  const isKo = locale === "ko";
  const [index, setIndex] = useState(0);
  const last = MAKERS.length - 1;
  const touchX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)));

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <section id="the-maker" className="s-maker">
      {/* 헤더 */}
      <header className="s-maker__header reveal">
        <h2 className="s-maker__title">{dict.title}</h2>
        <p className="s-maker__subtitle">
          {isKo ? (
            <Image
              src="/text/maker-subtitle.png"
              alt={dict.subtitle}
              width={302}
              height={72}
              className="s-maker__subtitle-img"
            />
          ) : (
            <span className="s-maker__subtitle-text">{dict.subtitle}</span>
          )}
        </p>
      </header>

      {/* 슬라이더 */}
      <div className="s-maker__viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="s-maker__track" style={{ "--idx": index } as CSSProperties}>
          {MAKERS.map((m, i) => (
            <article
              key={i}
              className="s-maker__slide"
              aria-hidden={i !== index}
            >
              <div className="s-maker__slide-img">
                <Image
                  src={m.image}
                  alt={m.revealed ? dict.imgAlt : ""}
                  fill
                  sizes="(max-width: 768px) 330px, 700px"
                  className="s-maker__img"
                />
              </div>
              {m.revealed ? (
                <div className="s-maker__slide-text">
                  <span className="s-maker__maison">{m.maison}</span>
                  <h3 className="s-maker__name">
                    {m.name.split("\n").map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </h3>
                  <span className="s-maker__since">{m.since}</span>
                  <p className="s-maker__desc">
                    {dict.boulard.desc.split("\n").map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </p>
                  <span className="s-maker__rule" />
                  <span className="s-maker__stat">
                    {m.stat.split("\n").map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </span>
                </div>
              ) : (
                <div className="s-maker__slide-text s-maker__slide-text--soon">
                  <h3 className="s-maker__name s-maker__name--soon">{dict.comingSoon.name}</h3>
                  <p className="s-maker__desc">
                    {dict.comingSoon.desc.split("\n").map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* 내비 — 카운터 + 티저 + ‹› */}
      <div className="s-maker__nav">
        <div className="s-maker__counter">
          <div className="s-maker__counter-num">
            <span className="s-maker__counter-cur">{String(index + 1).padStart(2, "0")}</span>
            <span className="s-maker__counter-total">/ {String(MAKERS.length).padStart(2, "0")}</span>
          </div>
          <span className="s-maker__teaser">{dict.teaser}</span>
        </div>
        <div className="s-maker__arrows">
          <button
            className="s-maker__arrow"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={dict.aria.prev}
          >
            ‹
          </button>
          <button
            className="s-maker__arrow s-maker__arrow--next"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label={dict.aria.next}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
