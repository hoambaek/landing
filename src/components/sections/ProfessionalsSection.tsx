/** ProfessionalsSection — amber with background image */
import CTALink from "@/components/ui/CTALink";

export default function ProfessionalsSection() {
  return (
    <section
      id="professionals"
      className="s-pro"
      aria-labelledby="pro-headline"
    >
      {/* 배경 이미지 */}
      <div className="s-pro__bg" aria-hidden="true">
        <img
          src="/images/p1.webp"
          alt=""
          className="s-pro__bg-img"
        />
        <div className="s-pro__bg-overlay" />
      </div>

      <div className="container">
        <div className="s-pro__inner">
          <span className="s-pro__label reveal">Become a Partner</span>

          <div className="s-pro__rule reveal reveal-delay-1" aria-hidden="true" />

          <h2
            className="s-pro__title reveal reveal-delay-1"
            id="pro-headline"
          >
            Partnership<span className="dot">.</span>
          </h2>

          <p className="s-pro__subtitle reveal reveal-delay-2">
            도입을 검토 중이신 파트너에게,
            <br />
            맞춤 제안을 드립니다.
          </p>

          <div className="s-pro__tags reveal reveal-delay-3">
            <span className="s-pro__tag">파인다이닝</span>
            <span className="s-pro__tag">호텔 바</span>
            <span className="s-pro__tag">프라이빗 셀러</span>
          </div>

          <div className="s-pro__links reveal reveal-delay-4">
            <CTALink href="/contact" variant="dark">도입 상담 신청</CTALink>
            <CTALink href="/saleskit" variant="dark">브랜드 소개서 받기</CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
