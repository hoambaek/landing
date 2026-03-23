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
      <div className="s-premiere__card">
        {/* 이미지 영역 */}
        <div className="s-premiere__visual">
          <Image
            src="/images/c1.webp"
            alt=""
            fill
            className="s-premiere__visual-img"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="s-premiere__visual-overlay" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="s-premiere__content">
          <span className="s-premiere__label reveal">membership</span>

          <h2
            className="s-premiere__title reveal reveal-delay-1"
            id="premiere-title"
          >
            Ocean Cellar<span className="dot">.</span>
          </h2>

          <p className="s-premiere__sub reveal reveal-delay-2">
            바다 아래, 당신의 셀러.
          </p>

          <ul className="s-premiere__perks reveal reveal-delay-3">
            <li className="s-premiere__perk">신규 컬렉션 우선 예약</li>
            <li className="s-premiere__perk">멤버 전용 테이스팅 초대</li>
          </ul>

          <div className="s-premiere__links reveal reveal-delay-4">
            <CTALink href="/membership" variant="light">초대 신청하기</CTALink>
          </div>
        </div>
      </div>
    </section>
  );
}
