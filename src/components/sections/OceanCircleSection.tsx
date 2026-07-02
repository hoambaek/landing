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
    <section id="ocean-circle" className="s-prive s-prive--left">
      <div className="s-prive__media">
        <Image src="/images/c1.webp" alt="" fill sizes="100vw" className="s-prive__img" />
        <div className="s-prive__scrim s-prive__scrim--left" aria-hidden="true" />
        <div className="s-prive__content">
          <span className="s-prive__eyebrow">{dict.eyebrow}</span>
          <h2 className="s-prive__title">{dict.title}</h2>
          <p className="s-prive__sub">{dict.sub}</p>
          <div className="s-prive__tags">
            <span>{dict.tags.schedule}</span>
            <span className="s-prive__tag-dot" aria-hidden="true" />
            <span>{dict.tags.attend}</span>
            <span className="s-prive__tag-dot" aria-hidden="true" />
            <span>{dict.tags.archive}</span>
          </div>
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
