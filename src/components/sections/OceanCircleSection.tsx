"use client";
/** OceanCircleSection — Ocean Cellar Privé (멤버십 초대) */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

export default function OceanCircleSection() {
  return (
    <section
      id="ocean-circle"
      className="s-premiere"
      aria-labelledby="premiere-title"
    >
      {/* 우측 배경 이미지 */}
      <div className="s-premiere__image" aria-hidden="true">
        <Image
          src="/images/c1.webp"
          alt="Ocean Cellar 멤버십"
          fill
          className="s-premiere__image-inner"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="s-premiere__image-fade" />
      </div>

      <div className="container">
        <div className="s-premiere__inner">
          <div className="s-premiere__rule reveal" aria-hidden="true" />

          <h2
            className="s-premiere__title reveal reveal-delay-1"
            id="premiere-title"
          >
            ocean cellar<span className="dot">.</span>
            <span className="s-premiere__title-tag">membership</span>
          </h2>

          <p className="s-premiere__sub reveal reveal-delay-2">
            바다 아래, 당신의 셀러.
          </p>

          <div className="s-premiere__tags reveal reveal-delay-3">
            <span className="s-premiere__tag">신규 컬렉션 우선 예약</span>
            <span className="s-premiere__tag">매월 숙성 노트 — 이 달, 바다가 한 일</span>
            <span className="s-premiere__tag">멤버 전용 테이스팅 초대</span>
          </div>

          <div className="s-premiere__links reveal reveal-delay-4">
            <CTALink href="#ocean-circle" variant="dark">Ocean Cellar 초대 신청하기</CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
