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
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const last = MAKERS.length - 1;

  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const startT = useRef(0);
  const axis = useRef<null | "x" | "y">(null);
  const activeId = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)));

  // 슬라이드 한 칸 이동 폭(px) = 슬라이드 폭 + gap. CSS와 자동 일치.
  const slideStep = () => {
    const track = trackRef.current;
    if (!track) return window.innerWidth;
    const slide = track.querySelector<HTMLElement>(".s-maker__slide");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return (slide?.offsetWidth ?? window.innerWidth) + gap;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startT.current = e.timeStamp;
    axis.current = null;
    activeId.current = e.pointerId;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    // 첫 이동에서 방향 결정 — 세로가 크면 페이지 스크롤에 양보
    if (axis.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis.current === "x") e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (axis.current !== "x") return;
    // 양끝에서는 고무줄 저항
    const atEdge = (index === 0 && dx > 0) || (index === last && dx < 0);
    setDrag(atEdge ? dx * 0.35 : dx);
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    setDragging(false);
    setDrag(0);
    if (axis.current !== "x") {
      axis.current = null;
      return;
    }
    const dx = e.clientX - startX.current;
    const dt = e.timeStamp - startT.current || 1;
    const velocity = Math.abs(dx / dt); // px/ms
    // 20% 이상 끌었거나 빠르게 튕기면 넘김
    const passed = Math.abs(dx) > slideStep() * 0.2 || velocity > 0.45;
    if (passed) go(index + (dx < 0 ? 1 : -1));
    axis.current = null;
  };

  return (
    <section id="the-maker" className="s-maker" aria-labelledby="maker-title">
      {/* 헤더 */}
      <header className="s-maker__header reveal">
        <h2 id="maker-title" className="s-maker__title" data-word-reveal="letters">{dict.title}</h2>
        <p className="s-maker__subtitle">
          {isKo ? (
            <Image
              src="/text/maker-subtitle.png"
              alt={dict.subtitle}
              width={312}
              height={72}
              unoptimized
              className="s-maker__subtitle-img"
            />
          ) : (
            <span className="s-maker__subtitle-text">{dict.subtitle}</span>
          )}
        </p>
      </header>

      {/* 슬라이더 */}
      <div
        className="s-maker__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          ref={trackRef}
          className={`s-maker__track${dragging ? " s-maker__track--dragging" : ""}`}
          style={{ "--idx": index, "--drag": `${drag}px` } as CSSProperties}
        >
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
                  draggable={false}
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
