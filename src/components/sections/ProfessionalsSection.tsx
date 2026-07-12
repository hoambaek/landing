import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/types";

/**
 * S7 · Partnership `professionals` — 테이블 (다크, Paper 07 1:1)
 * p1 풀블리드 + 우하단 편지형 + 점 구분 태그 + 헤어라인 언더라인 링크 2종.
 */
export default function ProfessionalsSection({
  dict,
}: {
  dict: Dictionary["partnership"];
}) {
  return (
    <section id="professionals" className="s-prive s-prive--right" aria-labelledby="professionals-title">
      <div className="s-prive__media">
        <Image src="/images/p1.webp" alt="" fill sizes="100vw" className="s-prive__img" />
        <div className="s-prive__scrim s-prive__scrim--right" aria-hidden="true" />
        <div className="s-prive__content">
          <span className="s-prive__eyebrow">{dict.eyebrow}</span>
          <h2 id="professionals-title" className="s-prive__title" data-word-reveal="letters">{dict.title}</h2>
          <p className="s-prive__sub">{dict.sub}</p>
          <ul className="s-prive__tags">
            <li><span>{dict.tags.fineDining}</span></li>
            <li><span>{dict.tags.hotelBar}</span></li>
            <li><span>{dict.tags.cellar}</span></li>
          </ul>
          <div className="s-prive__links s-prive__links--row">
            <Link href="/partner" className="s-prive__link">
              <span className="s-prive__link-row">
                <span className="s-prive__link-label">{dict.links.partner}</span>
                <span className="s-prive__link-arrow">›</span>
              </span>
              <span className="s-prive__link-rule" />
            </Link>
            <Link href="/brand-book" className="s-prive__link s-prive__link--muted">
              <span className="s-prive__link-row">
                <span className="s-prive__link-label">{dict.links.brandBook}</span>
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
