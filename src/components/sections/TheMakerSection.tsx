"use client";

import { CSSProperties, useRef, useState } from "react";
import Image from "next/image";

/**
 * S5 · The Maker `the-maker` — 두 개의 서명 (웜 라이트, Paper 05 1:1)
 * 캐러셀: 슬라이드 01 Mignon Boulard(이미지 좌 + 텍스트 우) + 슬라이드 02 비공개 피크.
 * 카운터 01/02 + 티저 라인 + ‹› 버튼 + 스와이프. makers 배열로 확장 대비(10+).
 */

type Maker = {
  maison: string;
  name: string;
  since: string;
  desc: string;
  stat: string;
  image: string;
  revealed: boolean;
};

const MAKERS: Maker[] = [
  {
    maison: "MAISON N° 1 · VALLÉE DE LA MARNE",
    name: "Champagne\nMignon Boulard",
    since: "Venteuil · depuis 1911",
    desc: "1911년부터 4세대, 49개의 서로 다른 토양.\n균일화할 복잡함을 고스란히 살리는 메종.",
    stat: "4 GÉNÉRATIONS · 49 PARCELLES\nRÉSERVE PERPÉTUELLE",
    image: "/images/m1.webp",
    revealed: true,
  },
  {
    maison: "",
    name: "coming soon",
    since: "",
    desc: "앞으로 해저 숙성에 어울리는\n새로운 생산자를 차례로 소개합니다.",
    stat: "",
    image: "/images/m2.webp",
    revealed: false,
  },
];

const TEASER = "두 번째 서명 — 2027, 다음 입수와 함께 공개";

export default function TheMakerSection() {
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
        <h2 className="s-maker__title">the maker.</h2>
        <p className="s-maker__subtitle">
          <span>샴페인은 샹파뉴가 만들었습니다</span>
          <span>기록은 남해에서 시작됩니다</span>
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
                  alt={m.revealed ? "Champagne Mignon Boulard — 샹파뉴 메종" : ""}
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
                    {m.desc.split("\n").map((l, j) => (
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
                  <h3 className="s-maker__name s-maker__name--soon">{m.name}</h3>
                  <p className="s-maker__desc">
                    {m.desc.split("\n").map((l, j) => (
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
          <span className="s-maker__teaser">{TEASER}</span>
        </div>
        <div className="s-maker__arrows">
          <button
            className="s-maker__arrow"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="이전 메이커"
          >
            ‹
          </button>
          <button
            className="s-maker__arrow s-maker__arrow--next"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label="다음 메이커"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
