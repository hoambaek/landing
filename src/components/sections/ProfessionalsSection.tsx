/** ProfessionalsSection — amber with background image */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function ProfessionalsSection() {
  return (
    <section
      id="professionals"
      className="s-pro"
      aria-labelledby="pro-headline"
    >
      {/* 배경 이미지 — 장식용이므로 aria-hidden, alt="" */}
      <div className="s-pro__bg" aria-hidden="true">
        <Image
          src="/images/p1.webp"
          alt=""
          fill
          className="s-pro__bg-img"
          sizes="100vw"
        />
        <div className="s-pro__bg-overlay" />
      </div>

      <div className="container">
        <div className="s-pro__inner">
          <div className="s-pro__rule reveal" aria-hidden="true" />

          <h2
            className="s-pro__title reveal reveal-delay-1"
            id="pro-headline"
          >
            Partnership<span className="dot">.</span>
          </h2>

          <p className="s-pro__subtitle reveal reveal-delay-2">
            이 샴페인이 열리는 순간을 함께 만들 공간을 찾습니다.
          </p>

          <p className="s-pro__desc reveal reveal-delay-2">
            뮤즈드마레는 유통하지 않습니다. 경험을 설계할 수 있는 공간과만 함께합니다.
          </p>

          <div className="s-pro__tags reveal reveal-delay-3">
            <span className="s-pro__tag">파인다이닝</span>
            <span className="s-pro__tag">럭셔리 호텔 바</span>
            <span className="s-pro__tag">프라이빗 셀러</span>
          </div>

          <div className="s-pro__links reveal reveal-delay-4">
            <CTALink href="/partnership" variant="dark">파트너 문의</CTALink>
            <CTALink href="/partnership" variant="dark">브랜드 소개서 다운로드</CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
