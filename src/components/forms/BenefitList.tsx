/** 혜택 블록 — 신청하면 받는 것을 헤어라인 구분 리스트로 보여준다. numbered면 모노 번호 슬롯 표시 */
export default function BenefitList({
  items,
  numbered = false,
  footnote,
}: {
  items: { title: string; desc: string }[];
  numbered?: boolean;
  footnote?: string;
}) {
  return (
    <div className="s-benefits">
      {items.map((b, i) => (
        <div className="s-benefits__row" key={b.title}>
          {numbered && (
            <span className="s-benefits__idx">{String(i + 1).padStart(2, "0")}</span>
          )}
          <div className="s-benefits__text">
            <span className="s-benefits__title">{b.title}</span>
            <span className="s-benefits__desc">{b.desc}</span>
          </div>
        </div>
      ))}
      {footnote && <p className="s-benefits__foot">{footnote}</p>}
    </div>
  );
}
