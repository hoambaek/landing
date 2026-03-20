/** NfcSection — 병의 여정 기록 섹션 */

const JOURNEY = [
  { label: "수확", desc: "포도밭" },
  { label: "메종", desc: "양조" },
  { label: "입수", desc: "남해" },
  { label: "숙성", desc: "해저" },
  { label: "인양", desc: "검수" },
] as const;

export default function NfcSection() {
  return (
    <section id="nfc" className="s-nfc hanji-texture">
      <div className="container">
        <div className="s-nfc__header reveal">
          <h2 className="s-nfc__title">the record<span className="dot">.</span></h2>
          <p className="s-nfc__sub">
            병에 손을 가져가면,
            <br />
            이 병의 여정이 열린다.
          </p>
        </div>

        {/* 이미지 영역 */}
        <div className="s-nfc__image reveal reveal-delay-1">
          <div className="s-nfc__placeholder" aria-label="NFC 체험 이미지 플레이스홀더" />
        </div>

        <div className="s-nfc__timeline reveal reveal-delay-1">
          <div className="s-nfc__timeline-line" aria-hidden="true" />
          {JOURNEY.map((step) => (
            <div key={step.label} className="s-nfc__timeline-step">
              <span className="s-nfc__timeline-dot" aria-hidden="true" />
              <span className="s-nfc__timeline-label">{step.label}</span>
              <span className="s-nfc__timeline-desc">{step.desc}</span>
            </div>
          ))}
        </div>

        <p className="s-nfc__closing reveal reveal-delay-2">
          <em>하나의 병, 하나의 기록.</em>
          <br />
          <span className="s-nfc__closing-sub">위조할 수 없는 깊이의 증명.</span>
        </p>
      </div>
    </section>
  );
}
