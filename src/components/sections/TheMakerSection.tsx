/** TheMakerSection — Server Component */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function TheMakerSection() {
  return (
    <section id="the-maker" className="s-maker hanji-texture">
      <div className="container">
        {/* 헤더 */}
        <div className="s-maker__header reveal">
          <h2 className="s-maker__title">the maker<span className="dot">.</span></h2>
          <div className="s-maker__title-kr">이중의 떼루아</div>
          <p className="s-maker__sub">
            7천만 년 전 바다였던 땅에서 태어나,
            <br />
            지금의 바다에서 완성되는 것.
          </p>
        </div>

        {/* 2컬럼 카드 */}
        <div className="s-maker__cards">
          {/* 카드 1 — Muse de Maree */}
          <div className="s-maker__card reveal">
            <div className="s-maker__card-image">
              <Image src="/images/m2.webp" alt="Muse de Marée" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="s-maker__card-label">aging team</div>
            <div className="s-maker__card-name">
              Muse de Mar&eacute;e
            </div>
            <p className="s-maker__card-desc">
              대한민국 남해안, 수심 30–60m.
              <br />
              설계하고, 기록하고, 바다가 완성할 때까지 기다리는 팀.
            </p>
          </div>

          {/* 카드 2 — Champagne Mignon Boulard */}
          <div className="s-maker__card reveal reveal-delay-1">
            <div className="s-maker__card-image">
              <Image src="/images/m1.webp" alt="Champagne Mignon Boulard" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="s-maker__card-label">partner maison</div>
            <div className="s-maker__card-name">
              Champagne Mignon Boulard
            </div>
            <p className="s-maker__card-desc">
              Venteuil, Vallée de la Marne.
              <br />
              49개의 다른 토양, 준비되었을 때만 출시하는 메종.
            </p>
          </div>
        </div>

        <div className="s-maker__cta reveal">
          <CTALink href="/maker" variant="light">메이커 스토리 보기</CTALink>
        </div>
      </div>
    </section>
  );
}
