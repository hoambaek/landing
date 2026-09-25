import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * S4 · Collection `archive` — 기록의 소유 (라이트, Paper 04 1:1)
 * f2 히어로 + 인트로 + 퀴베 6카드 + 클로징(선물 카피·기록 목록 + NFC 폰 화면).
 * 퀴베 이미지는 object-fit: contain (crop 금지 — 확정 선호).
 */

type CuveeDict = Dictionary["collection"]["cuvees"];

type Cuvee = {
  n: string;
  name: string;
  nameTagKey?: keyof CuveeDict;
  descKey: keyof CuveeDict;
  img?: string;
  /** 해가 지나 판매가 끝난 에디션 — 보관된 해(인양 연도). "ARCHIVED 2026"으로 표기 */
  archived?: string;
  outline?: boolean;
};

/* 그리드 순서: 데스크톱 3열(001 002 003 / 000 004 005), 모바일 2열 동일 흐름.
   name은 브랜드 고유명이라 전 로케일 공통, desc/nameTag/archived 라벨만 dict 참조. */
const CUVEES: Cuvee[] = [
  { n: "ARCHIVE N° 001", name: "En Lieu Sûr", descKey: "enLieuSur", img: "/images/01.webp" },
  { n: "ARCHIVE N° 002", name: "En Lieu Sûr Magnum", descKey: "enLieuSurMagnum", img: "/images/02.webp" },
  { n: "ARCHIVE N° 003", name: "Élément de Surprise", descKey: "elementDeSurprise", img: "/images/03.webp" },
  { n: "ARCHIVE N° 000", name: "Édition Zéro", descKey: "editionZero", img: "/images/06.webp", archived: "2026" },
  { n: "ARCHIVE N° 004", name: "Atomes Crochus", descKey: "atomesCrochus1yr", img: "/images/05.webp" },
  { n: "ARCHIVE N° 005", name: "Atomes Crochus", nameTagKey: "tag2yr", descKey: "atomesCrochus2yr", outline: true },
];

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
        <h2 id="archive-title" className="s-col__title" data-word-reveal="letters">{dict.title}</h2>
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

      {/* 퀴베 그리드 — 박스 없는 진열, contain */}
      <ul className="s-col__grid">
        {CUVEES.map((c) => (
          <li key={c.n} className="s-col__card">
            <div className={`s-col__card-img${c.outline ? " s-col__card-img--outline" : ""}${c.archived ? " s-col__card-img--sold" : ""}`}>
              {c.outline ? (
                <Image src="/images/bottle-outline-2yr.png" alt="" width={184} height={308} className="s-col__outline-img" />
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
              {c.archived && <span className="s-col__card-sold">{dict.cuvees.archived} {c.archived}</span>}
            </div>
          </li>
        ))}
      </ul>

      {/* 기록 카드 쇼케이스는 걷어 두었다(2026-09-25 대표) — 합성 이미지 대신 실물 촬영본이
          오면 되살린다. 스타일(.s-col__showcase*)과 dict.cert.showcaseAlt는 그대로 남겨 둔다. */}

      {/* 클로징 — 선물 카피 + 기록 목록 + NFC 기록 첫 화면 (Paper "Closing — Gift & Record + NFC").
          데스크톱은 문구 왼쪽·폰 오른쪽, 모바일은 문구 → 폰 → 목록 순으로 쌓는다(order). */}
      <div className="s-col__closing reveal">
        <div className="s-col__closing-copy">
          <h3 className="s-col__gift-head">{dict.gift.head}</h3>
          <p className="s-col__gift-body">{dict.gift.body}</p>
        </div>
        <div className="s-col__phone">
          <Image
            src="/images/record-phone.webp"
            alt=""
            width={646}
            height={1228}
            sizes="(max-width: 768px) 222px, 278px"
            className="s-col__phone-img"
          />
        </div>
        <dl className="s-col__spec">
          <div className="s-col__spec-row">
            <dt>N°</dt>
            <dd>{dict.note.numbering}</dd>
          </div>
          <div className="s-col__spec-row">
            <dt>CARD</dt>
            <dd>{dict.note.card}</dd>
          </div>
          <div className="s-col__spec-row">
            <dt>NFC</dt>
            <dd>{dict.note.nfc}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
