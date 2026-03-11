/** TheMakerSection — Client Component (Peek Carousel) */
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

const MAKERS = [
  {
    order: "Nº 1",
    name: "Champagne Mignon Boulard",
    image: "/images/m1.webp",
    location: "Venteuil, Vallée de la Marne.",
    desc: "49개의 다른 토양, 준비되었을 때만 출시하는 메종.",
  },
  {
    order: "Nº 2",
    name: "Champagne Joseph Desruets",
    image: "/images/m2.webp",
    location: "Hautvillers, Vallée de la Marne.",
    desc: "1888년부터 6세대. 샴페인의 요람에서 가장 오래된 프레스로 빚는 메종.",
  },
] as const;

export default function TheMakerSection() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; time: number } | null>(null);
  const dragOffset = useRef(0);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, MAKERS.length - 1));
    setCurrent(clamped);
  }, []);

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

    if (velocity > 0.3 || Math.abs(dx) > 50) {
      if (dx < 0 && current < MAKERS.length - 1) goTo(current + 1);
      else if (dx > 0 && current > 0) goTo(current - 1);
    }
  }, [current, goTo]);

  return (
    <section id="the-maker" className="s-maker hanji-texture">
      <div className="container">
        <div className="s-maker__header reveal">
          <h2 className="s-maker__title">the maker<span className="dot">.</span></h2>
          <p className="s-maker__sub">
            바다가 선택할 수 있는 가장 좋은 샴페인.
            <br />
            그 기준으로 메종을 찾습니다.
          </p>
        </div>

        <div
          className="s-maker__peek reveal"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="s-maker__peek-track"
            style={{
              transform: `translateX(calc(-${current} * (min(500px, 68vw) + 40px)))`,
            }}
          >
            {MAKERS.map((maker, i) => {
              const pos = i - current; // -1=left, 0=active, 1=right
              return (
                <div
                  key={maker.name}
                  className="s-maker__peek-slide"
                  onClick={() => pos !== 0 && goTo(i)}
                  style={{ cursor: pos !== 0 ? "pointer" : "default" }}
                >
                  <div className={`s-maker__card${pos === 0 ? "" : " s-maker__card--inactive"}`}>
                    {/* Hero image */}
                    <div className="s-maker__card-image">
                      <Image
                        src={maker.image}
                        alt={maker.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                      <div
                        className="s-maker__peek-fade"
                        style={{
                          opacity: pos === 0 ? 0 : 1,
                          background: pos < 0
                            ? "linear-gradient(to left, rgba(232,229,225,0.5) 0%, rgba(232,229,225,1) 70%)"
                            : "linear-gradient(to right, rgba(232,229,225,0.5) 0%, rgba(232,229,225,1) 70%)",
                        }}
                      />
                    </div>

                    {/* Editorial caption */}
                    <div className="s-maker__card-caption">
                      <span className="s-maker__card-label">maison Nº <span className="s-maker__card-label-num">{maker.order.replace('Nº ', '')}</span></span>
                      <div className="s-maker__card-accent" />
                      <h3 className="s-maker__card-name">{maker.name}</h3>
                      <p className="s-maker__card-location">{maker.location}</p>
                      <p className="s-maker__card-desc">
                        {maker.desc.includes('6세대.') ? (
                          <>1888년부터 6세대.<br />샴페인의 요람에서 가장 오래된 프레스로 빚는 메종.</>
                        ) : maker.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 도트 인디케이터 */}
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

        <div className="s-maker__cta reveal">
          <CTALink href="/maker" variant="light">메이커 스토리 보기</CTALink>
        </div>
      </div>
    </section>
  );
}
