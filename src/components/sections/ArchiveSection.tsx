import Image from "next/image";

/**
 * S4 · Collection `archive` — 기록의 소유 (라이트, Paper 04 1:1)
 * f2 히어로 + 인트로 + 시간 띠(3단계) + 큐베 6카드 + 기록 카드(증서+NFC) + 하단 노트.
 * 큐베 이미지는 object-fit: contain (crop 금지 — 확정 선호).
 */

type Cuvee = {
  n: string;
  name: string;
  nameTag?: string;
  desc: string;
  img?: string;
  soldOut?: boolean;
  outline?: boolean;
};

/* 그리드 순서: 데스크톱 3열(001 002 003 / 000 004 005), 모바일 2열 동일 흐름 */
const CUVEES: Cuvee[] = [
  { n: "ARCHIVE N° 001", name: "En Lieu Sûr", desc: "엉리우쉬르 — 첫 만남을 위한 시작", img: "/images/01.webp" },
  { n: "ARCHIVE N° 002", name: "En Lieu Sûr Magnum", desc: "매그넘 1500ml — 더 느린 숙성", img: "/images/02.webp" },
  { n: "ARCHIVE N° 003", name: "Élément de Surprise", desc: "BDB Non-dosé\n해저 숙성의 직설", img: "/images/03.webp" },
  { n: "ARCHIVE N° 000", name: "Édition Zéro", desc: "시작을 기록한 첫 번째 아카이브", img: "/images/06.webp", soldOut: true },
  { n: "ARCHIVE N° 004", name: "Atomes Crochus", desc: "희귀 품종 Petit Meslier\n1년의 기록", img: "/images/05.webp" },
  { n: "ARCHIVE N° 005", name: "Atomes Crochus", nameTag: "3년", desc: "아직 바다 아래에 있습니다\n천 일의 기록이 되는 중", outline: true },
];

/* NFC 심볼 — 동심 아크 (QR 아님) */
function NfcMark() {
  return (
    <div className="s-col__nfc-mark">
      <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="22" r="2" fill="#312E2A" />
        <path d="M19 13 C24 18 24 26 19 31" fill="none" stroke="#312E2A" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M25 9 C32 16 32 28 25 35" fill="none" stroke="#312E2A" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <path d="M31 5 C40 14 40 30 31 39" fill="none" stroke="#312E2A" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
      </svg>
      <span className="s-col__nfc-label">NFC</span>
    </div>
  );
}

function Certificate() {
  return (
    <div className="s-col__cert">
      <div className="s-col__cert-head">
        <span className="s-col__cert-title">RECORD CARD</span>
        <span className="s-col__cert-no">N° 0147</span>
      </div>
      <span className="s-col__cert-rule" />
      <div className="s-col__cert-data">
        <div className="s-col__cert-row"><span>입수</span><span>2025.11.21</span></div>
        <div className="s-col__cert-row"><span>좌표</span><span>34.1434°N · 126.5792°E</span></div>
        <div className="s-col__cert-row"><span>해저 숙성</span><span>365일</span></div>
        <div className="s-col__cert-row"><span>인양</span><span>2026.11.20</span></div>
      </div>
      <span className="s-col__cert-rule" />
      <div className="s-col__cert-nfc">
        <p className="s-col__cert-nfc-text">병에 가까이 대면,<br />이 병이 살아낸 365일의 기록</p>
        <NfcMark />
      </div>
    </div>
  );
}

export default function ArchiveSection() {
  return (
    <section id="archive" className="s-col">
      {/* 히어로 — f2 풀블리드 + 하단 sand 그라데이션 */}
      <div className="s-col__hero">
        <Image src="/images/f2.webp" alt="남해에서 인양된 큐베 라인업" fill sizes="100vw" className="s-col__hero-img" />
        <div className="s-col__hero-fade" aria-hidden="true" />
      </div>

      {/* 인트로 */}
      <div className="s-col__intro reveal">
        <h2 className="s-col__title">collection.</h2>
        <p className="s-col__sub">
          <span>각 큐베는 하나의 기록</span>{" "}
          <span>바다가 만든 시간을, 맡아두는 일</span>
        </p>
      </div>

      {/* 큐베 그리드 — 박스 없는 진열, contain */}
      <div className="s-col__grid">
        {CUVEES.map((c) => (
          <figure key={c.n} className="s-col__card">
            <div className={`s-col__card-img${c.outline ? " s-col__card-img--outline" : ""}${c.soldOut ? " s-col__card-img--sold" : ""}`}>
              {c.outline ? (
                <Image src="/images/bottle-outline-3yr.png" alt="" width={184} height={308} className="s-col__outline-img" />
              ) : (
                <Image src={c.img!} alt={c.name} fill sizes="(max-width: 768px) 50vw, 330px" className="s-col__bottle-img" />
              )}
            </div>
            <figcaption className="s-col__card-info">
              <span className="s-col__card-n">{c.n}</span>
              <span className="s-col__card-name">
                {c.name}
                {c.nameTag && <span className="s-col__card-name-tag"> {c.nameTag}</span>}
              </span>
              <span className="s-col__card-desc">{c.desc}</span>
              {c.soldOut && <span className="s-col__card-sold">· SOLD OUT</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* 기록 카드 쇼케이스 */}
      <div className="s-col__showcase">
        <div className="s-col__showcase-bottle">
          <Image src="/images/01.webp" alt="En Lieu Sûr — 기록 카드와 함께" fill sizes="260px" className="s-col__showcase-img" />
        </div>
        <Certificate />
      </div>

      {/* 하단 노트 */}
      <div className="s-col__note">
        <span>전 병 개별 넘버링</span>
        <span className="s-col__note-dot" aria-hidden="true" />
        <span>기록 카드 동봉</span>
        <span className="s-col__note-dot" aria-hidden="true" />
        <span>NFC 기록 열람</span>
      </div>
    </section>
  );
}
