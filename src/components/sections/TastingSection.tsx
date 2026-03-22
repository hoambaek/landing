/** TastingSection — Server Component (CSS-only reveals) */
import CTALink from "@/components/ui/CTALink";

export default function TastingSection() {
  return (
    <section id="tasting" className="s-tasting" aria-label="The Tasting">
      {/* 다크→라이트 그라데이션 전환 영역 */}
      <div className="s-tasting__bridge">
        <div className="s-tasting__bridge-text reveal">
          <p className="s-tasting__headline">첫 모금에서 다릅니다.</p>
        </div>
      </div>

      {/* 시네마틱 영상 */}
      <div className="s-tasting__image reveal reveal-delay-1">
        <video
          className="s-tasting__video"
          src="/images/tasting.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* 하단 텍스트 + CTA */}
      <div className="s-tasting__inner">
        <div className="s-tasting__footer reveal reveal-delay-2">
          <div className="s-tasting__body">
            <p>수압이 빚어낸 기포는 더 섬세하고, 더 조밀합니다.</p>
            <p>해류가 지켜낸 온도는 산미를 더 선명하게, 여운을 더 길게 만듭니다.</p>
            <p>
              바다의 고요가 남긴 질감은 — 말로 설명하기보다 직접 확인하시길
              권합니다.
            </p>
          </div>

          <CTALink href="#ocean-circle" variant="dark">
            테이스팅 예약하기
          </CTALink>
        </div>
      </div>
    </section>
  );
}
