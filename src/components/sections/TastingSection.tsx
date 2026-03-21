/** TastingSection — Server Component (CSS-only reveals) */
import CTALink from "@/components/ui/CTALink";

export default function TastingSection() {
  return (
    <section id="tasting" className="s-tasting" aria-label="The Tasting">
      <div className="container">
        <div className="reveal">
          <h2 className="s-tasting__title">
            the tasting<span className="dot">.</span>
          </h2>
        </div>

        <div className="reveal reveal-delay-1">
          <p className="s-tasting__headline">첫 모금에서 다릅니다.</p>
        </div>

        <div className="s-tasting__body reveal reveal-delay-2">
          <p>수압이 빚어낸 기포는 더 섬세하고, 더 조밀합니다.</p>
          <p>해류가 지켜낸 온도는 산미를 더 선명하게, 여운을 더 길게 만듭니다.</p>
          <p>
            바다의 고요가 남긴 질감은 — 말로 설명하기보다 직접 확인하시길
            권합니다.
          </p>
        </div>

        <div className="reveal reveal-delay-3">
          <CTALink href="#ocean-circle" variant="dark">
            테이스팅 예약하기
          </CTALink>
        </div>
      </div>

      {/* placeholder 이미지 영역 */}
      <div className="s-tasting__image reveal reveal-delay-2">
        <div
          className="s-tasting__placeholder"
          aria-label="테이스팅 이미지 플레이스홀더"
        >
          <span>TASTING IMAGE</span>
        </div>
      </div>
    </section>
  );
}
