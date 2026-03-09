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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'center',
              gap: '12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              fontStyle: 'normal',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#312E2A',
              background: 'radial-gradient(ellipse at 30% 20%, rgba(204,173,123,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(180,160,120,0.04) 0%, transparent 50%), linear-gradient(175deg, #d6cfc4 0%, #cec7bb 30%, #c8c0b4 60%, #d0c9be 100%)',
              border: '0.5px solid rgba(160,140,110,0.25)',
              boxShadow: 'inset 0 0 20px rgba(160,140,100,0.08)',
              padding: '6px 16px',
              marginBottom: '12px',
            }}>
              <span style={{
                display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(180,165,140,0.6), rgba(120,105,80,0.4))',
                border: '0.5px solid rgba(120,105,80,0.3)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 0.5px 1px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }} />
              <span>1st partner maison</span>
              <span style={{
                display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(180,165,140,0.6), rgba(120,105,80,0.4))',
                border: '0.5px solid rgba(120,105,80,0.3)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 0.5px 1px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }} />
            </div>
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
