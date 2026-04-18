/** ArchiveSection — Server Component (Masonry Grid) */
import Image from "next/image";
import CTALink from "@/components/ui/CTALink";

const CUVEES = [
  // Upper: 01(large left) → 02(top right) → 03(right offset)
  {
    num: "01",
    label: "archive nº 001",
    name: "En Lieu Sûr",
    nameKr: "엉리우쉬르",
    desc: "2대에 걸친 솔레라 리저브 70%, Brut\n뮤즈드마레를 처음 만난다면, 여기서 시작하세요",
  },
  {
    num: "02",
    label: "archive nº 002",
    name: "En Lieu Sûr Magnum",
    nameKr: "엉리우쉬르 매그넘",
    desc: "해저의 느린 숙성, Magnum 1500ml\n큰 용량이 만드는 더 균일한 숙성",
    edition: "24병 한정",
  },
  {
    num: "03",
    label: "archive nº 003",
    name: "Élément de Surprise",
    nameKr: "엘레멍드쉬르프리즈",
    desc: "BDB, Non-dosé, 솔레라 블렌딩\n해저숙성이 가장 직접적으로 드러나는 큐베",
  },
  // Lower: 06(left) → 04(center offset) → 05(right climax)
  {
    num: "06",
    label: "archive nº 000",
    name: "Édition Zéro",
    nameKr: "에디션 제로",
    desc: "뮤즈드마레의 시작을 기록한\n첫 번째 아카이브",
    edition: "50병 한정",
    soldOut: true,
  },
  {
    num: "04",
    label: "archive nº 004",
    name: "Atomes Crochus 1 Year Aged",
    nameKr: "아톰크로슈 1년 숙성",
    desc: "희귀 품종 Petit Meslier 30%,\n오크 배럴 숙성, Ultra-Brut",
  },
  {
    num: "05",
    label: "archive nº 005",
    name: "Atomes Crochus 3 Years Aged",
    nameKr: "아톰크로슈 3년 숙성",
    desc: "3년의 해저 숙성 - 희귀 품종 Petit Meslier 30%,\n오크 배럴 숙성, Ultra-Brut",
    edition: "40병 한정",
  },
] as const;

export default function ArchiveSection() {
  return (
    <section id="archive" className="s-archive hanji-texture">
      <div className="s-archive__hero reveal-scale">
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
          <p className="s-archive__sub">여섯 개의 큐베, 하나의 바다.</p>
        </div>
      </div>

      <div className="container">

        {/* Masonry Grid */}
        <div className="s-archive__masonry reveal reveal-delay-1">
          {CUVEES.map((cuvee) => (
            <div
              key={cuvee.name}
              className={`m-card m-card--${cuvee.num}`}
            >
              <div className="m-card__img">
                <Image
                  src={`/images/${cuvee.num}.webp`}
                  alt={cuvee.name}
                  fill
                  sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, 300px"
                  className="m-card__img-inner"
                />
              </div>
              <div className="m-card__info">
                <div className="m-card__label">
                  <span className="m-card__label-prefix">archive nº </span>
                  <span className="m-card__label-num">{cuvee.label.replace('archive nº ', '')}</span>
                </div>
                <div className="m-card__name">{cuvee.name}</div>
                <div className="m-card__name-kr">{cuvee.nameKr}</div>
                <div className="m-card__desc">{cuvee.desc}</div>
                {"edition" in cuvee && (
                  <span className="m-card__edition">{cuvee.edition}</span>
                )}
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

        {/* Marée Signature — 이름 미정으로 주석 처리
        <div className="s-archive__muselog reveal">
          <div className="s-archive__muselog-header">
            <div className="s-archive__muselog-rule" aria-hidden="true" />
            <span className="s-archive__muselog-title">Marée Signature</span>
            <div className="s-archive__muselog-rule" aria-hidden="true" />
          </div>

          <span className="s-archive__muselog-sub">NFC · Blockchain</span>

          <p className="s-archive__muselog-lead">
            병에 손을 가져가면, 이 병의 여정이 열린다.
          </p>

          <div className="s-archive__timeline">
            <div className="s-archive__timeline-line" aria-hidden="true" />
            <div className="s-archive__timeline-item">
              <div className="s-archive__timeline-dot" aria-hidden="true" />
              <span className="s-archive__timeline-label">수확</span>
              <span className="s-archive__timeline-desc">포도밭 · 수확일</span>
            </div>
            <div className="s-archive__timeline-item">
              <div className="s-archive__timeline-dot" aria-hidden="true" />
              <span className="s-archive__timeline-label">메종</span>
              <span className="s-archive__timeline-desc">양조 · 블렌딩</span>
            </div>
            <div className="s-archive__timeline-item">
              <div className="s-archive__timeline-dot" aria-hidden="true" />
              <span className="s-archive__timeline-label">입수</span>
              <span className="s-archive__timeline-desc">남해 · 수심 50m</span>
            </div>
            <div className="s-archive__timeline-item s-archive__timeline-item--wide">
              <div className="s-archive__timeline-dot" aria-hidden="true" />
              <span className="s-archive__timeline-label">숙성</span>
              <span className="s-archive__timeline-desc">수온 · 해류 · 수압</span>
            </div>
            <div className="s-archive__timeline-item">
              <div className="s-archive__timeline-dot" aria-hidden="true" />
              <span className="s-archive__timeline-label">인양</span>
              <span className="s-archive__timeline-desc">인양일 · 검수</span>
            </div>
          </div>

          <p className="s-archive__muselog-footer">
            블록체인에 기록되어, 변조되지 않는다.
          </p>

          <p className="s-archive__muselog-closing">
            <em>위조할 수 없는 깊이의 기록.</em>
          </p>
        </div>
        */}

        <div className="s-archive__cta reveal">
          <CTALink href="#ocean-circle" variant="light">컬렉션 문의하기</CTALink>
          <CTALink href="#ocean-circle" variant="light">Ocean Cellar 멤버십으로 우선 예약</CTALink>
        </div>
      </div>
    </section>
  );
}
