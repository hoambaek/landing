"use client";
/** OceanCircleSection — Ocean Cellar Privé (멤버십 초대) */
import Image from "next/image";

const BENEFITS = [
  {
    num: "01",
    title: "Priority Access",
    desc: "한정 컬렉션 우선 예약",
  },
  {
    num: "02",
    title: "Cellar Report",
    desc: "바다가 보내는 월간 숙성 노트",
  },
  {
    num: "03",
    title: "Private Tasting",
    desc: "Exclusive 테이스팅 초대",
  },
] as const;

export default function OceanCircleSection() {
  return (
    <section
      id="ocean-circle"
      className="s-premiere"
      aria-labelledby="premiere-title"
    >
      <div className="s-premiere__inner">
        <div className="s-premiere__rule reveal" aria-hidden="true" />

        <h2
          className="s-premiere__title reveal reveal-delay-1"
          id="premiere-title"
        >
          <span className="s-premiere__title-main">Ocean Cellar</span>
          <span className="s-premiere__title-tag">Membership</span>
        </h2>

        <p className="s-premiere__copy reveal reveal-delay-2">
          해저 숙성의 시간을 가장 먼저 만나보세요.
        </p>

        {/* Benefits */}
        <ul className="s-premiere__rewards reveal reveal-delay-2">
          {BENEFITS.map((b) => (
            <li key={b.num} className="s-premiere__reward">
              <span className="s-premiere__reward-num">{b.num}</span>
              <span className="s-premiere__reward-text">{b.desc}</span>
            </li>
          ))}
        </ul>

        {/* Email Form */}
        <form className="s-premiere__form reveal reveal-delay-3" onSubmit={(e) => e.preventDefault()}>
          <div className="s-premiere__form-group">
            <input
              type="email"
              placeholder="your email"
              className="s-premiere__input"
              aria-label="이메일 주소"
              required
            />
            <button type="submit" className="s-premiere__submit">
              초대 신청
              <svg width="5" height="9" viewBox="0 0 7 12" fill="none" aria-hidden="true">
                <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="s-premiere__form-note">
            초대는 순차적으로 발송됩니다.
          </p>
        </form>
      </div>

      {/* 우측 이미지 */}
      <div className="s-premiere__image" aria-hidden="true">
        <Image
          src="/images/c1.webp"
          alt=""
          fill
          className="s-premiere__image-inner"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="s-premiere__image-fade" />
      </div>
    </section>
  );
}
