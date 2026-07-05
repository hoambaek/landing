import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * S4 · Collection `archive` — 기록의 소유 (라이트, Paper 04 1:1)
 * f2 히어로 + 인트로 + 시간 띠(3단계) + 큐베 6카드 + 기록 카드(증서+NFC) + 하단 노트.
 * 큐베 이미지는 object-fit: contain (crop 금지 — 확정 선호).
 */

type CuveeDict = Dictionary["collection"]["cuvees"];

type Cuvee = {
  n: string;
  name: string;
  nameTagKey?: keyof CuveeDict;
  descKey: keyof CuveeDict;
  img?: string;
  soldOut?: boolean;
  outline?: boolean;
};

/* 그리드 순서: 데스크톱 3열(001 002 003 / 000 004 005), 모바일 2열 동일 흐름.
   name은 브랜드 고유명이라 전 로케일 공통, desc/nameTag/soldOut만 dict 참조. */
const CUVEES: Cuvee[] = [
  { n: "ARCHIVE N° 001", name: "En Lieu Sûr", descKey: "enLieuSur", img: "/images/01.webp" },
  { n: "ARCHIVE N° 002", name: "En Lieu Sûr Magnum", descKey: "enLieuSurMagnum", img: "/images/02.webp" },
  { n: "ARCHIVE N° 003", name: "Élément de Surprise", descKey: "elementDeSurprise", img: "/images/03.webp" },
  { n: "ARCHIVE N° 000", name: "Édition Zéro", descKey: "editionZero", img: "/images/06.webp", soldOut: true },
  { n: "ARCHIVE N° 004", name: "Atomes Crochus", descKey: "atomesCrochus1yr", img: "/images/05.webp" },
  { n: "ARCHIVE N° 005", name: "Atomes Crochus", nameTagKey: "tag3yr", descKey: "atomesCrochus3yr", outline: true },
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

function Certificate({ dict }: { dict: Dictionary["collection"]["cert"] }) {
  return (
    <div className="s-col__cert">
      <div className="s-col__cert-head">
        <span className="s-col__cert-title">RECORD CARD</span>
        <span className="s-col__cert-no">N° 0147</span>
      </div>
      <span className="s-col__cert-rule" />
      <div className="s-col__cert-data">
        <div className="s-col__cert-row"><span>{dict.entry}</span><span>2025.11.21</span></div>
        <div className="s-col__cert-row"><span>{dict.coordinates}</span><span>34.1434°N · 126.5792°E</span></div>
        <div className="s-col__cert-row"><span>{dict.aging}</span><span>{dict.agingValue}</span></div>
        <div className="s-col__cert-row"><span>{dict.recovery}</span><span>2026.11.20</span></div>
      </div>
      <span className="s-col__cert-rule" />
      <div className="s-col__cert-nfc">
        <p className="s-col__cert-nfc-text">
          {dict.nfcText.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
        <NfcMark />
      </div>
    </div>
  );
}

export default function ArchiveSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["collection"];
}) {
  const isKo = locale === "ko";
  return (
    <section id="archive" className="s-col" aria-labelledby="archive-title">
      {/* 히어로 — f2 풀블리드 */}
      <div className="s-col__hero">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/f2_m.webp" />
          <Image src="/images/f2.webp" alt={dict.heroAlt} fill sizes="100vw" className="s-col__hero-img" />
        </picture>
      </div>

      {/* 인트로 */}
      <div className="s-col__intro reveal">
        <h2 id="archive-title" className="s-col__title">{dict.title}</h2>
        <p className="s-col__sub">
          {isKo ? (
            <Image
              src="/text/col-sub.png"
              alt={dict.sub}
              width={311}
              height={64}
              unoptimized
              className="s-col__sub-img"
            />
          ) : (
            <span className="s-col__sub-text">{dict.sub}</span>
          )}
        </p>
      </div>

      {/* 큐베 그리드 — 박스 없는 진열, contain */}
      <ul className="s-col__grid">
        {CUVEES.map((c) => (
          <li key={c.n} className="s-col__card">
            <div className={`s-col__card-img${c.outline ? " s-col__card-img--outline" : ""}${c.soldOut ? " s-col__card-img--sold" : ""}`}>
              {c.outline ? (
                <Image src="/images/bottle-outline-3yr.png" alt="" width={184} height={308} className="s-col__outline-img" />
              ) : (
                <Image src={c.img!} alt={c.name} fill sizes="(max-width: 768px) 50vw, 330px" className="s-col__bottle-img" />
              )}
            </div>
            <div className="s-col__card-info">
              <span className="s-col__card-n">{c.n}</span>
              <span className="s-col__card-name">
                {c.name}
                {c.nameTagKey && <span className="s-col__card-name-tag"> {dict.cuvees[c.nameTagKey]}</span>}
              </span>
              <span className="s-col__card-desc">{dict.cuvees[c.descKey]}</span>
              {c.soldOut && <span className="s-col__card-sold">{dict.cuvees.soldOut}</span>}
            </div>
          </li>
        ))}
      </ul>

      {/* 기록 카드 쇼케이스 */}
      <div className="s-col__showcase">
        <div className="s-col__showcase-bottle">
          <Image src="/images/01.webp" alt={dict.cert.showcaseAlt} fill sizes="260px" className="s-col__showcase-img" />
        </div>
        <Certificate dict={dict.cert} />
      </div>

      {/* 기프트 브릿지 — 증서가 있는 선물 (북극성 §6 · 1순위 고객) */}
      <div className="s-col__gift reveal">
        <h3 className="s-col__gift-head">{dict.gift.head}</h3>
        <p className="s-col__gift-body">{dict.gift.body}</p>
      </div>

      {/* 하단 노트 */}
      <div className="s-col__note">
        <span>{dict.note.numbering}</span>
        <span>{dict.note.card}</span>
        <span>{dict.note.nfc}</span>
      </div>
    </section>
  );
}
