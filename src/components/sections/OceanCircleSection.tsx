import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/types";

/**
 * S6 · Ocean Cellar Privé `ocean-circle` — 다시 바다로 (다크, Paper 06 1:1)
 * c1 풀블리드 + 좌하단 편지형 + 점 구분 태그 + 헤어라인 언더라인 링크.
 */
export default function OceanCircleSection({
  dict,
}: {
  dict: Dictionary["oceanCellar"];
}) {
  return (
    <section id="ocean-circle" className="s-prive s-prive--left" aria-labelledby="ocean-circle-title">
      <div className="s-prive__media">
        <Image src="/images/c1.webp" alt="" fill sizes="100vw" className="s-prive__img" />
        <div className="s-prive__scrim s-prive__scrim--left" aria-hidden="true" />
        <div className="s-prive__content">
          <span className="s-prive__eyebrow">{dict.eyebrow}</span>
          <h2 id="ocean-circle-title" className="s-prive__title" data-word-reveal="letters">{dict.title}</h2>
          <p className="s-prive__sub">{dict.sub}</p>
          <ul className="s-prive__tags">
            <li><span>{dict.tags.schedule}</span></li>
            <li><span>{dict.tags.attend}</span></li>
            <li><span>{dict.tags.archive}</span></li>
          </ul>
          <div className="s-prive__links">
            <Link href="/invite" className="s-prive__link">
              <span className="s-prive__link-row">
                <span className="s-prive__link-label">{dict.link}</span>
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
