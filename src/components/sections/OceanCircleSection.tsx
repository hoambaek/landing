/** OceanCircleSection — Ocean Cellar Privé */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function OceanCircleSection() {
  return (
    <section
      id="ocean-circle"
      className="s-premiere"
      aria-labelledby="premiere-title"
    >
      <div className="s-premiere__inner">
        <span className="s-premiere__label reveal">membership<span className="dot">.</span></span>

        <div className="s-premiere__rule reveal reveal-delay-1" aria-hidden="true" />

        <h2
          className="s-premiere__title reveal reveal-delay-1"
          id="premiere-title"
        >
          <span className="s-premiere__title-main">Ocean Cellar</span>
          <span className="s-premiere__title-tag">Privé</span>
        </h2>

        <p className="s-premiere__copy reveal reveal-delay-3">
          새로운 컬렉션의 선구매 기회.
          <br />
          자리가 한정되어 있습니다.
        </p>

        <div className="s-premiere__cta reveal reveal-delay-4">
          <CTALink href="/prive" variant="dark">자세히 보기</CTALink>
        </div>
      </div>

      {/* 우측 이미지 */}
      <div className="s-premiere__image" aria-hidden="true">
        <Image
          src="/images/n-400.webp"
          alt=""
          fill
          className="s-premiere__image-inner"
          sizes="45vw"
        />
        <div className="s-premiere__image-fade" />
      </div>
    </section>
  );
}
