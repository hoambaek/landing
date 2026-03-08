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
          <p className="s-maker__sub">
            바다가 선택할 수 있는 가장 좋은 샴페인.
            <br />
            그 기준으로 메종을 찾습니다.
          </p>
        </div>

        {/* 파트너 메종 카드 */}
        <div className="s-maker__cards s-maker__cards--single">
          <div className="s-maker__card reveal">
            <div className="s-maker__card-image">
              <Image src="/images/m1.webp" alt="Champagne Mignon Boulard" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="s-maker__card-label" style={{ alignSelf: 'center', background: 'rgba(49,46,42,0.08)', border: '0.5px solid rgba(49,46,42,0.15)', padding: '3px 10px', borderRadius: '2px' }}>1st partner maison</div>
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
