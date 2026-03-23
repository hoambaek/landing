/** ProfessionalsSection — Partnership */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function ProfessionalsSection() {
  return (
    <section
      id="professionals"
      className="s-pro"
      aria-labelledby="pro-headline"
    >
      <div className="s-pro__card">
        {/* 이미지 영역 */}
        <div className="s-pro__visual">
          <Image
            src="/images/p1.webp"
            alt=""
            fill
            className="s-pro__visual-img"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="s-pro__visual-overlay" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="s-pro__content">
          <span className="s-pro__label reveal">B2B</span>

          <h2
            className="s-pro__title reveal reveal-delay-1"
            id="pro-headline"
          >
            Partnership<span className="dot">.</span>
          </h2>

          <p className="s-pro__subtitle reveal reveal-delay-2">
            이 샴페인이 열리는 순간을 함께 만들 공간을 찾습니다.
          </p>

          <ul className="s-pro__venues reveal reveal-delay-3">
            <li className="s-pro__venue">파인다이닝</li>
            <li className="s-pro__venue">럭셔리 호텔 바</li>
            <li className="s-pro__venue">프라이빗 셀러</li>
          </ul>

          <div className="s-pro__links reveal reveal-delay-4">
            <CTALink href="/partnership" variant="dark">파트너 문의</CTALink>
            <CTALink href="/partnership" variant="dark">브랜드 소개서</CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
