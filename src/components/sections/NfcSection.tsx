/** NfcSection — de key / 프로버넌스 섹션 (Server Component) */

const RECORDS = [
  { num: "01", label: "생산 메종" },
  { num: "02", label: "숙성 해역" },
  { num: "03", label: "투하일" },
  { num: "04", label: "인양일" },
  { num: "05", label: "평균 수온 · 해류 · 수압" },
  { num: "06", label: "고유 번호" },
] as const;

export default function NfcSection() {
  return (
    <section id="provenance" className="s-nfc" aria-label="De Key">
      <div className="container">
        <div className="s-nfc__header reveal">
          <h2 className="s-nfc__title">
            de key<span className="dot">.</span>
          </h2>
          <p className="s-nfc__sub">
            모든 병에는 바다의 기록이 담겨 있습니다.
          </p>
        </div>

        <div className="s-nfc__image reveal reveal-delay-1">
          <div
            className="s-nfc__placeholder"
            role="img"
            aria-label="NFC 프로버넌스 이미지 플레이스홀더"
          />
        </div>

        {/* 프로비넌스 레코드 — 넘버링 수직 리스트 */}
        <div className="s-nfc__records reveal reveal-delay-2">
          {RECORDS.map((record) => (
            <div key={record.num} className="s-nfc__record">
              <span className="s-nfc__record-num">{record.num}</span>
              <span className="s-nfc__record-label">{record.label}</span>
            </div>
          ))}
        </div>

        <div className="s-nfc__closing reveal reveal-delay-3">
          <p>
            병목의 NFC 태그에 스마트폰을 가까이 대세요.
          </p>
          <p>
            이 한 병이 어디에서 태어났는지, 어느 바다에서, 얼마나 오래
            잠들었는지, 언제 다시 빛을 보았는지…
          </p>
          <p>
            <em>변조 불가능한 기록으로 확인할 수 있습니다.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
