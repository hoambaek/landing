/** TheMakerSection — Client Component (Compact Editorial Card Carousel) */
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

const MAKERS = [
  {
    order: "1",
    name: "Champagne Mignon Boulard",
    image: "/images/m1.webp",
    location: "Venteuil, Vallée de la Marne",
    heritage: "1911년 — 4세대",
    desc: "1911년, 이 가문이 처음 포도를 심었을 때부터 4세대가 지켜온 원칙이 있습니다. '준비되었을 때만 출시한다.'\n\n49개의 서로 다른 구획, 각기 다른 토양. 대형 메종이라면 블렌딩으로 균일화할 이 복잡함을 Mignon Boulard는 고스란히 살립니다.",
  },
] as const;

export default function TheMakerSection() {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef<{ x: number; time: number } | null>(null);
  const dragOffset = useRef(0);

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, MAKERS.length - 1)));
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

  const maker = MAKERS[current];

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
            바다는 결점을 숨기지 않습니다.
            <br />
            기준은 하나 — 지상에서 이미 완전한 것.
          </p>
        </div>

        {/* 컴팩트 카드 캐러셀 */}
        <div
          className="s-maker__carousel reveal reveal-delay-1"
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
              <div key={m.name} className="s-maker__slide">
                <div className="s-maker__card">
                  {/* 이미지 */}
                  <div className="s-maker__card-image">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 360px"
                      className="s-maker__card-img"
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="s-maker__card-body">
                    <span className="s-maker__card-num" lang="fr">
                      Maison Nº {m.order}
                    </span>
                    <h3 className="s-maker__card-name" lang="fr">
                      {m.name}
                    </h3>
                    <span className="s-maker__card-loc">{m.location}</span>
                    <span className="s-maker__card-heritage">
                      {m.heritage}
                    </span>
                    <p className="s-maker__card-desc">{m.desc}</p>
                    <div className="s-maker__card-cta">
                      <CTALink href="/makers" variant="amber">
                        메이커 스토리 보기
                      </CTALink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 도트 (2개 이상일 때) */}
          {MAKERS.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
}
