/** TheMakerSection — Client Component (Peek Carousel + 가로 캡션) */
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Map } from "lucide-react";
import CTALink from "@/components/ui/CTALink";

const MAKERS = [
  {
    order: "1",
    name: "Champagne Mignon Boulard",
    image: "/images/m1.webp",
    location: "Venteuil, Vallée de la Marne",
    heritage: "1911년부터 4세대",
    desc: "49개의 다른 토양, 준비되었을 때만 출시하는 메종.",
  },
  {
    order: "2",
    name: "To Be Announced",
    image: null,
    location: "",
    heritage: "",
    desc: "두 번째 메종을 준비하고 있습니다.",
    comingSoon: true,
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

    if (velocity > 0.3 || Math.abs(dx) > 30) {
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
            바다가 선택할 수 있는 최선의 샴페인.
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
              transform: `translateX(calc(-${current} * (min(640px, 85vw) + 16px)))`,
            }}
          >
            {MAKERS.map((maker, i) => {
              const pos = i - current;
              const isSoon = "comingSoon" in maker && maker.comingSoon;
              return (
                <div
                  key={maker.name}
                  className="s-maker__peek-slide"
                  onClick={() => pos !== 0 && goTo(i)}
                  style={{ cursor: pos !== 0 ? "pointer" : "default" }}
                >
                  <div className={`s-maker__hcard${pos === 0 ? "" : " s-maker__hcard--inactive"}`}>
                    {/* 이미지 */}
                    <div className={`s-maker__hcard-img${isSoon ? " s-maker__hcard-img--placeholder" : ""}`}>
                      {maker.image ? (
                        <Image src={maker.image} alt={maker.name} fill sizes="(max-width: 767px) 85vw, 220px" />
                      ) : (
                        <span className="s-maker__hcard-soon">coming soon</span>
                      )}
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

                    {/* 텍스트 */}
                    <div className="s-maker__hcard-body">
                      <div className="s-maker__hcard-top">
                        <span className="s-maker__hcard-num">Nº {maker.order}</span>
                        <h3 className={`s-maker__hcard-name${isSoon ? " s-maker__hcard-name--soon" : ""}`}>{maker.name}</h3>
                        {maker.location && (
                          <span className="s-maker__hcard-loc">
                            <Map size={12} strokeWidth={1.2} aria-hidden="true" style={{ flexShrink: 0 }} />
                            {maker.location}
                          </span>
                        )}
                      </div>
                      <div className="s-maker__hcard-bottom">
                        {maker.heritage && <p className="s-maker__hcard-heritage">{maker.heritage}</p>}
                        <p className="s-maker__hcard-desc">{maker.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
          <CTALink href="#the-maker" variant="light">메이커 스토리 보기</CTALink>
        </div>
      </div>
    </section>
  );
}
