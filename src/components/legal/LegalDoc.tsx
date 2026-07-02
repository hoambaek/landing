import type { LegalDoc as LegalDocData } from "@/content/legal/types";

/**
 * 법적 문서 렌더러 — 제목 블록 + 섹션(본문·표). 라이트 편집형(MDM 디자인 가이드).
 */
export default function LegalDoc({ doc }: { doc: LegalDocData }) {
  return (
    <article className="s-legal__doc">
      <header className="s-legal__title-block">
        <span className="s-legal__eyebrow">LEGAL</span>
        <h1 className="s-legal__title">{doc.title}</h1>
        <p className="s-legal__meta">
          시행일 {doc.effectiveDate} · 주식회사 오크니
        </p>
        <span className="s-legal__rule" aria-hidden="true" />
      </header>

      {doc.intro && <p className="s-legal__intro">{doc.intro}</p>}

      {doc.sections.map((section) => (
        <section key={section.heading} className="s-legal__section">
          <h2 className="s-legal__heading">{section.heading}</h2>
          {section.body?.map((para, i) => (
            <p key={i} className="s-legal__body">
              {para}
            </p>
          ))}
          {section.table && (
            <div className="s-legal__table">
              {section.table.rows.map((row) => (
                <div key={row.label} className="s-legal__row">
                  <span className="s-legal__row-label">{row.label}</span>
                  <span className="s-legal__row-value">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {doc.footnote && <p className="s-legal__footnote">{doc.footnote}</p>}
    </article>
  );
}
