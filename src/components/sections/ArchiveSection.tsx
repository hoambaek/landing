/** ArchiveSection — Server Component (Masonry Grid) */

const CUVEES = [
  {
    num: "01",
    depth: "cuv\u00e9e 01 \u00b7 core",
    name: "En Lieu S\u00fbr.",
    desc: "Brut. \uB690\uB974\uC544 \uC2DC\uB9AC\uC988\uC758 \uAE30\uB465.",
  },
  {
    num: "02",
    depth: "cuv\u00e9e 02 \u00b7 limited",
    name: "En Lieu S\u00fbr Magnum.",
    desc: "1500ml. \uB354 \uB290\uB9B0 \uC2DC\uAC04.",
  },
  {
    num: "03",
    depth: "cuv\u00e9e 03 \u00b7 limited",
    name: "\u00c9l\u00e9ment de Surprise.",
    desc: "Blanc de Blancs.",
  },
  {
    num: "04",
    depth: "cuv\u00e9e 04 \u00b7 collector\u2019s",
    name: "Atomes Crochus 1yr.",
    desc: "\uD574\uC800 12\uAC1C\uC6D4.",
  },
  {
    num: "05",
    depth: "cuv\u00e9e 05 \u00b7 collector\u2019s",
    name: "Atomes Crochus 3yr.",
    desc: "\uD574\uC800 36\uAC1C\uC6D4. \uAC00\uC7A5 \uAE34 \uC2DC\uAC04. \uAC00\uC7A5 \uAE4A\uC740 \uAE30\uB85D.",
    limited: "40\uBCD1 \uD55C\uC815",
  },
] as const;

export default function ArchiveSection() {
  return (
    <section id="archive" className="s-archive hanji-texture">
      <div className="container">
        <div className="s-archive__header reveal">
          <h2 className="s-archive__title">collection.</h2>
          <p className="s-archive__sub">다섯 개의 큐베. 하나의 바다.</p>
        </div>

        {/* Masonry Grid */}
        <div className="s-archive__masonry reveal reveal-delay-1">
          {CUVEES.map((cuvee) => (
            <div
              key={cuvee.name}
              className={`m-card m-card--${cuvee.num}`}
            >
              <div className="m-card__img" />
              <div className="m-card__info">
                <div className="m-card__label">{cuvee.depth}</div>
                <div className="m-card__name">{cuvee.name}</div>
                <div className="m-card__desc">{cuvee.desc}</div>
                {"limited" in cuvee && (
                  <div className="m-card__limited">{cuvee.limited}</div>
                )}
              </div>
            </div>
          ))}

          {/* 여백 장식 텍스트 */}
          <div className="m-accent m-accent--left">five cuvées, one ocean</div>
          <div className="m-accent m-accent--bottom">
            깊이가 다르면
            <br />
            시간도 다르다.
          </div>
        </div>

        {/* NFC/블록체인 프로비넌스 */}
        <div className="s-archive__provenance reveal">
          <div className="s-archive__provenance-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              <circle cx="14" cy="14" r="12" />
              <path d="M14 6v8l5 3" />
              <path d="M8 20l-2 4M20 20l2 4" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="s-archive__provenance-text">
            모든 병에는 NFC 칩이 부착되어 있다.
            <br />
            프랑스 메종에서 한국의 바다까지,
            <br />
            숙성의 전 과정이 블록체인으로 기록된다.
            <br />
            변조할 수 없는 깊이의 증명.
          </div>
        </div>
      </div>
    </section>
  );
}
