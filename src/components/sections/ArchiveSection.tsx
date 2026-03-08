/** ArchiveSection — Server Component (Masonry Grid) */
import Image from "next/image";
import CardSlider from "@/components/ui/CardSlider";

const CUVEES = [
  {
    num: "01",
    depth: "cuvée 01 · core",
    name: "En Lieu Sûr.",
    desc: "Brut. 뮤르아 시리즈의 기둥.",
    img2: "/images/01-1.webp",
  },
  {
    num: "02",
    depth: "cuvée 02 · limited",
    name: "En Lieu Sûr Magnum.",
    desc: "1500ml. 더 느린 시간.",
    img2: "/images/02-1.webp",
  },
  {
    num: "03",
    depth: "cuvée 03 · limited",
    name: "Élément de Surprise.",
    desc: "Blanc de Blancs.",
    img2: "/images/03-1.webp",
  },
  {
    num: "04",
    depth: "cuvée 04 · collector\u2019s",
    name: "Atomes Crochus 1yr.",
    desc: "해저 12개월.",
    img2: "/images/04-1.webp",
  },
  {
    num: "05",
    depth: "cuvée 05 · collector\u2019s",
    name: "Atomes Crochus 3yr.",
    desc: "해저 36개월. 가장 긴 시간. 가장 깊은 기록.",
    limited: "40병 한정",
    img2: "/images/05-1.webp",
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
        <div className="s-archive__hero-fade-top" aria-hidden="true" />
      </div>
      <div className="container">
        <div className="s-archive__header reveal">
          <h2 className="s-archive__title">collection<span className="dot">.</span></h2>
          <p className="s-archive__sub">다섯 개의 큐베. 하나의 바다.</p>
        </div>

        {/* Masonry Grid */}
        <div className="s-archive__masonry reveal reveal-delay-1">
          {CUVEES.map((cuvee) => (
            <div
              key={cuvee.name}
              className={`m-card m-card--${cuvee.num}`}
            >
              <div className="m-card__img">
                <CardSlider
                  images={[`/images/${cuvee.num}.webp`, cuvee.img2]}
                  alt={cuvee.name}
                  className="m-card__img-inner"
                />
              </div>
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
