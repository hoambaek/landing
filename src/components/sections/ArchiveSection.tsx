/** ArchiveSection — Server Component (Masonry Grid) */
import Image from "next/image";

const CUVEES = [
  // Upper: 01(large left) → 02(top right) → 03(right offset)
  {
    num: "01",
    label: "archive nº 002",
    name: "En Lieu Sûr",
    desc: "Brut, 모든 큐베의 기준",
  },
  {
    num: "02",
    label: "archive nº 003",
    name: "En Lieu Sûr Magnum",
    desc: "Magnum 1500ml · 24병 한정",
  },
  {
    num: "03",
    label: "archive nº 004",
    name: "Élément de Surprise",
    desc: "Blanc de Blancs · Non-dosé",
  },
  // Lower: 06(left) → 04(center offset) → 05(right climax)
  {
    num: "06",
    label: "archive nº 001",
    name: "Édition Zéro",
    desc: "2025 · 50병 한정",
    soldOut: true,
  },
  {
    num: "04",
    label: "archive nº 005",
    name: "Atomes Crochus 1 Year Aged",
    desc: "Ultra-Brut · 희귀 품종 Petit Meslier 블렌드",
  },
  {
    num: "05",
    label: "archive nº 006",
    name: "Atomes Crochus 3 Years Aged",
    desc: "Ultra-Brut · 희귀 품종 Petit Meslier 블렌드 · 40병 한정",
  },
] as const;

export default function ArchiveSection() {
  return (
    <section id="archive" className="s-archive hanji-texture">
      <div className="s-archive__hero reveal">
        <Image
          src="/images/f2.webp"
          alt="다섯 개의 큐베"
          fill
          className="s-archive__hero-img"
          sizes="100vw"
        />

      </div>
      <div className="container">
        <div className="s-archive__header reveal">
          <h2 className="s-archive__title">collection<span className="dot">.</span></h2>
          <p className="s-archive__sub">바다가 기록한 여섯 개의 시간.</p>
        </div>

        {/* Masonry Grid */}
        <div className="s-archive__masonry reveal reveal-delay-1">
          {CUVEES.map((cuvee) => (
            <div
              key={cuvee.name}
              className={`m-card m-card--${cuvee.num}`}
            >
              <div className="m-card__img">
                <img
                  src={`/images/${cuvee.num}.webp`}
                  alt={cuvee.name}
                  className="m-card__img-inner"
                />
              </div>
              <div className="m-card__info">
                <div className="m-card__label" style={{ background: 'rgba(206, 199, 187, 0.3)', border: '0.5px solid rgba(160, 140, 110, 0.35)' }}>
                  <span style={{ opacity: 0.5 }}>archive nº </span>
                  <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{cuvee.label.replace('archive nº ', '')}</span>
                </div>
                <div className="m-card__name">{cuvee.name}</div>
                <div className="m-card__desc">{cuvee.desc}</div>
                {"soldOut" in cuvee && (
                  <div className="m-card__sold-out">sold out</div>
                )}
              </div>
            </div>
          ))}

          {/* 여백 장식 텍스트 */}
          <div className="m-accent m-accent--left">six cuvées, one ocean</div>
          <div className="m-accent m-accent--bottom">
            깊이가 다르면
            <br />
            시간도 다르다.
          </div>
        </div>

        {/* NFC/블록체인 프로비넌스 — Editorial Horizontal */}
        <div className="s-archive__provenance reveal">
          {/* 좌측: 타이포그래피 심볼 */}
          <div className="s-archive__prov-mark">
            <span className="s-archive__prov-mark-text">Provenance</span>
            <span className="s-archive__prov-mark-sub">NFC · Blockchain</span>
          </div>

          {/* 우측: 본문 */}
          <div className="s-archive__prov-content">
            <p className="s-archive__prov-lead">
              모든 병에는 NFC 칩이 부착되어 있다.
            </p>
            <p className="s-archive__prov-text">
              프랑스 메종에서 한국의 바다까지,
              숙성의 전 과정이 블록체인으로 기록된다.
            </p>
            <p className="s-archive__prov-closing">
              <em>변조할 수 없는 깊이의 증명.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
