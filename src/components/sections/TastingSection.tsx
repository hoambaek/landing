/** TastingSection — Server Component (CSS-only reveals) */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function TastingSection() {
  return (
    <section id="tasting" className="s-tasting" aria-label="The Tasting">
      <div className="s-tasting__inner">
        {/* 상단 타이틀 */}
        <div className="s-tasting__header reveal">
          <h2 className="s-tasting__title">
            the tasting<span className="dot">.</span>
          </h2>
          <p className="s-tasting__headline">첫 모금에서 다릅니다.</p>
        </div>

        {/* 중앙 이미지 */}
        <div className="s-tasting__image reveal reveal-delay-1">
          <Image
            src="/images/tasting.webp"
            alt="샴페인 기포 클로즈업"
            width={800}
            height={1067}
            className="s-tasting__image-inner"
            sizes="(max-width: 768px) 90vw, 60vw"
          />
        </div>

        {/* 하단 텍스트 + CTA */}
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
