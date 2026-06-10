import Image from "next/image";
import Link from "next/link";

/**
 * S7 · Partnership `professionals` — 식탁 (다크, Paper 07 1:1)
 * p1 풀블리드 + 우하단 편지형 + 점 구분 태그 + 헤어라인 언더라인 링크 2종.
 */
export default function ProfessionalsSection() {
  return (
    <section id="professionals" className="s-prive s-prive--right">
      <div className="s-prive__media">
        <Image src="/images/p1.webp" alt="" fill sizes="100vw" className="s-prive__img" />
        <div className="s-prive__scrim s-prive__scrim--right" aria-hidden="true" />
        <div className="s-prive__content">
          <span className="s-prive__eyebrow">Professional</span>
          <h2 className="s-prive__title">Partnership</h2>
          <p className="s-prive__sub">바다가 기록한 시간을, 당신의 식탁이 잇는다</p>
          <div className="s-prive__tags">
            <span>파인다이닝</span>
            <span className="s-prive__tag-dot" aria-hidden="true" />
            <span>럭셔리 호텔 바</span>
            <span className="s-prive__tag-dot" aria-hidden="true" />
            <span>프라이빗 셀러</span>
          </div>
          <div className="s-prive__links s-prive__links--row">
            <Link href="/partner" className="s-prive__link">
              <span className="s-prive__link-row">
                <span className="s-prive__link-label">파트너 문의</span>
                <span className="s-prive__link-arrow">›</span>
              </span>
              <span className="s-prive__link-rule" />
            </Link>
            <Link href="/brand-book" className="s-prive__link s-prive__link--muted">
              <span className="s-prive__link-row">
                <span className="s-prive__link-label">브랜드 소개서</span>
                <span className="s-prive__link-arrow">›</span>
              </span>
              <span className="s-prive__link-rule" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
