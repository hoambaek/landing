/** TheMakerSection — Client Component (Editorial Cinematic Carousel) */
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

type Maker = {
  order: string;
  name: string;
  image?: string;
  location: string;
  detail: string;
  desc: string;
  cta?: string;
  teaser?: boolean;
  placeholder?: boolean;
  placeholderText?: string;
};

const MAKERS: Maker[] = [
  {
    order: "1",
    name: "Champagne Mignon Boulard",
    image: "/images/m1.webp",
    location: "Venteuil, Vallée de la Marne · depuis 1911",
    detail: "4 Générations · 49 Parcelles · Réserve Perpétuelle",
    desc: "1911년부터 4세대, 49개의 서로 다른 토양.\n대형 메종이라면 균일화할 복잡함을 고스란히 살리는 메종.",
    cta: "메이커 스토리 보기",
  },
  {
    order: "2",
    name: "Second Maison",
    image: "/images/m2.webp",
    location: "Hautvillers",
    detail: "",
    desc: "다른 떼루아, 다른 철학.\n바다가 선택할 다음 샴페인을 준비하고 있습니다.",
    teaser: true,
  },
];

export default function TheMakerSection() {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef<{ x: number; time: number } | null>(null);
  const dragOffset = useRef(0);
  const total = MAKERS.length;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(Math.max(0, Math.min(idx, total - 1)));
    },
    [total]
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, time: Date.now() };
    dragOffset.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    dragOffset.current = e.clientX - dragStart.current.x;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragStart.current) return;
    const dx = dragOffset.current;
    const elapsed = Date.now() - dragStart.current.time;
    const velocity = Math.abs(dx) / elapsed;
    dragStart.current = null;
    if (velocity > 0.3 || Math.abs(dx) > 30) {
      if (dx < 0 && current < total - 1) goTo(current + 1);
      else if (dx > 0 && current > 0) goTo(current - 1);
    }
  }, [current, goTo, total]);

  return (
    <section id="the-maker" className="s-maker">
      <div className="s-maker__container">
        {/* 헤더 */}
        <div className="s-maker__header reveal">
          <h2 className="s-maker__title">
            the maker<span className="dot">.</span>
          </h2>
          <p className="s-maker__manifesto">
            바다에 맡길 수 있는 샴페인은 많지 않습니다.
            <br />
            기준은 하나 — 지상에서 이미 완전한 것.
          </p>
        </div>

        {/* 캐러셀 + 좌우 화살표 */}
        <div className="s-maker__carousel-wrapper reveal reveal-delay-1">
          {/* 좌측 화살표 */}
          <button
            className={`s-maker__arrow s-maker__arrow--prev${current === 0 ? " s-maker__arrow--disabled" : ""}`}
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="이전"
          >
            ‹
          </button>

          {/* 캐러셀 */}
          <div
            className="s-maker__carousel"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="s-maker__track"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {MAKERS.map((m) => (
                <div key={m.order} className="s-maker__slide">
                  <div
                    className={`s-maker__editorial${m.teaser ? " s-maker__editorial--teaser" : ""}${m.placeholder ? " s-maker__editorial--placeholder" : ""}`}
                  >
                    {/* 텍스트 */}
                    <div className="s-maker__text">
                      <span className="s-maker__num" lang="fr">
                        {m.placeholder ? `Nº ${m.order}` : `Maison Nº ${m.order}`}
                      </span>
                      {m.placeholder ? (
                        <p className="s-maker__placeholder-text">
                          {m.placeholderText}
                        </p>
                      ) : (
                        <>
                          <h3
                            className={`s-maker__name${m.teaser ? " s-maker__name--muted" : ""}`}
                            lang={m.teaser ? "ko" : "fr"}
                          >
                            {m.name}
                          </h3>
                          {m.location && (
                            <span className="s-maker__loc">{m.location}</span>
                          )}
                          {m.detail && (
                            <span className="s-maker__detail" lang="fr">
                              {m.detail}
                            </span>
                          )}
                          {m.desc && (
                            <p
                              className={`s-maker__desc${m.teaser ? " s-maker__desc--muted" : ""}`}
                            >
                              {m.desc}
                            </p>
                          )}
                          {m.cta && (
                            <div className="s-maker__cta">
                              <CTALink href="/makers" variant="light">
                                {m.cta}
                              </CTALink>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 이미지 (플레이스홀더가 아닐 때) */}
                    {!m.placeholder && (
                      <div
                        className={`s-maker__visual${m.teaser ? " s-maker__visual--teaser" : ""}`}
                      >
                        {m.image ? (
                          <Image
                            src={m.image}
                            alt={m.name}
                            fill
                            sizes="(max-width: 767px) 100vw, 400px"
                            className="s-maker__visual-img"
                          />
                        ) : (
                          <div className="s-maker__visual-empty">
                            <span>?</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 화살표 */}
          <button
            className={`s-maker__arrow s-maker__arrow--next${current === total - 1 ? " s-maker__arrow--disabled" : ""}`}
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            aria-label="다음"
          >
            ›
          </button>
        </div>

        {/* 도트 내비게이션 */}
        <div className="s-maker__dots">
          {MAKERS.map((_, i) => (
            <button
              key={i}
              className={`s-maker__dot${i === current ? " s-maker__dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`메이커 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
