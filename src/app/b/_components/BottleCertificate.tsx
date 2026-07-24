"use client";

/**
 * /b 디지털 인증서 (Paper "04 — 디지털 인증서").
 * NFC 원본 태그와 등록 기록이 일치하는 병의 공식 소유 인증서.
 * 소유자 이름·이메일은 서버에서 마스킹된 값만 받는다(공개 URL 프라이버시). 전체 노출은 소유자 인증 도입 후.
 * 저장: 인증서 카드를 html-to-image로 고해상 PNG 렌더 → 다운로드. 공유: Web Share(파일) → 실패 시 다운로드 폴백.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toPng } from "html-to-image";
import styles from "./certificate.module.css";
import {
  BOTTLE_COPY,
  BOTTLE_LOCALES,
  MAISON_NAME,
  PRODUCT_META,
  RECORD_EXTRA,
  PROVENANCE,
  type BottleLocale,
} from "../_lib/copy";
import type { BottleRecordData, BottleOwner } from "../_lib/data";

type SeasonKey = "winter" | "spring" | "summer" | "autumn";

function seasonOf(m: number): SeasonKey {
  if (m === 11 || m <= 1) return "winter";
  if (m <= 4) return "spring";
  if (m <= 7) return "summer";
  return "autumn";
}
function monthIdxOf(date: string | null, fallback: number): number {
  if (!date) return fallback;
  const m = Number(date.slice(5, 7)) - 1;
  return m >= 0 && m < 12 ? m : fallback;
}

export default function BottleCertificate({
  code,
  data,
  owner,
  ownerNameFull,
  certId,
  signature,
}: {
  code: string;
  data: BottleRecordData;
  owner: BottleOwner | null;
  ownerNameFull?: string | null;
  certId: string;
  signature: string;
}) {
  const [locale, setLocale] = useState<BottleLocale>("ko");
  const [langOpen, setLangOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const cardRef = useRef<HTMLDivElement>(null);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const prov = PROVENANCE[data.bottle.productId];

  const serial = data.bottle.serial;
  const serialTotal = meta.quantity;
  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const retMonth = monthIdxOf(data.aging.retrieval, 11);
  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());

  const ownerName = ownerNameFull ?? owner?.nameMasked ?? extra.certOwnerFallback;

  const seaWhen = (date: string | null, fallback: number) => {
    const m = monthIdxOf(date, fallback);
    const y = date ? date.slice(0, 4) : year;
    const mo = copy.months[m];
    const se = copy.seasons[seasonOf(m)];
    if (locale === "ko") return `${y}년 ${mo} · ${se}`;
    if (locale === "ja" || locale === "zh") return `${y}年 ${mo} · ${se}`;
    return `${mo} ${y} · ${se}`;
  };

  const durationYears = (() => {
    const i = data.aging.immersion;
    const r = data.aging.retrieval;
    if (i && r) return Math.max(1, Number(r.slice(0, 4)) - Number(i.slice(0, 4)));
    return 1;
  })();
  const months = durationYears * 12;
  const fmtMonths = (m: number) => {
    if (locale === "en") return `${m} months`;
    if (locale === "fr") return `${m} mois`;
    if (locale === "ja") return `${m}か月`;
    if (locale === "zh") return `${m}个月`;
    return `${m}개월`;
  };

  const provRows: { label: string; value: string }[] = prov
    ? [
        { label: extra.provLabels.maison, value: prov.maison },
        { label: extra.provLabels.region, value: prov.region },
        { label: extra.provLabels.cepage, value: prov.cepage },
        { label: extra.provLabels.style, value: prov.style },
        { label: extra.provLabels.elevage, value: prov.elevage[locale] },
      ]
    : [
        { label: extra.provLabels.maison, value: `Champagne ${MAISON_NAME}` },
        ...(meta.cepage ? [{ label: extra.provLabels.cepage, value: meta.cepage }] : []),
        ...(meta.style ? [{ label: extra.provLabels.style, value: meta.style }] : []),
      ];

  const seaRows: { label: string; value: string }[] = [
    { label: extra.seaLabels.immersion, value: seaWhen(data.aging.immersion, immMonth) },
    {
      label: extra.seaLabels.retrieval,
      value: seaWhen(data.aging.retrieval, retMonth) + (data.aging.retrieved ? "" : ` (${copy.planned})`),
    },
    { label: extra.seaLabels.duration, value: fmtMonths(months) },
    { label: extra.seaLabels.depth, value: `${data.aging.depth} m` },
    { label: extra.seaLabels.location, value: `${extra.wando} · 34°N 126°E` },
  ];

  async function renderPng(): Promise<string | null> {
    const node = cardRef.current;
    if (!node) return null;
    return toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#0a0908" });
  }

  async function onSave() {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      const url = await renderPng();
      if (!url) throw new Error("no-node");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certId}.png`;
      a.click();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  async function onShare() {
    try {
      const url = await renderPng();
      if (!url) throw new Error("no-node");
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `${certId}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: extra.certShareText, text: extra.certShareText });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${certId}.png`;
        a.click();
      }
    } catch {
      /* 사용자 취소·미지원 — 무시 */
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        {/* ── 헤더: 로고 + 인증서 태그 ── */}
        <header className={styles.header}>
          <div className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.headerSymbol} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.headerWordmark} />
          </div>
          <span className={styles.certTag}>{extra.certTag}</span>
        </header>

        {/* ── 정체성: N° · 병 · 헌정 · 소유자 ── */}
        <section className={styles.identity}>
          {serial !== null && (
            <div className={styles.edition}>
              <span className={styles.edNo}>N°</span>
              <span className={styles.edNum}>{serial}</span>
              <span className={styles.edTotal}>/ {serialTotal}</span>
            </div>
          )}
          <span className={styles.verifiedShort}>{extra.certVerifiedShort}</span>
          <div className={styles.bottleWrap}>
            <Image src={meta.image} alt={meta.name} width={138} height={256} className={styles.bottleImg} />
          </div>
          <p className={styles.dedication}>{extra.certDedication}</p>
          <p className={styles.ownerName}>{ownerName}</p>
          <span className={styles.ownerRule} aria-hidden />
        </section>

        {/* ── 진위 씰 ── */}
        <section className={styles.seal}>
          <span className={styles.sealMark} aria-hidden>✓</span>
          <p className={styles.sealText}>{extra.certSeal}</p>
        </section>

        {/* ── 인증 정보 ── */}
        <section className={styles.block}>
          <h2 className={styles.blockHeadAmber}>{extra.certAuthHead}</h2>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{extra.certIdLabel}</span>
              <span className={styles.rowValueMono}>{certId}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{extra.certStatusLabel}</span>
              <span className={styles.rowValueAmber}>{extra.certVerifiedShort}</span>
            </div>
          </div>
        </section>

        {/* ── 원산지 ── */}
        <section className={`${styles.block} ${styles.blockElev}`}>
          <h2 className={styles.blockHead}>{extra.provHead}</h2>
          <div className={styles.rows}>
            {provRows.map((r, i) => (
              <div key={`p-${i}`} className={styles.row}>
                <span className={styles.rowLabel}>{r.label}</span>
                <span className={styles.rowValue}>{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 해저 숙성 ── */}
        <section className={`${styles.block} ${styles.blockElev}`}>
          <h2 className={styles.blockHead}>{extra.seaHead}</h2>
          <div className={styles.rows}>
            {seaRows.map((r, i) => (
              <div key={`s-${i}`} className={styles.row}>
                <span className={styles.rowLabel}>{r.label}</span>
                <span className={styles.rowValue}>{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 디지털 서명 ── */}
        <section className={styles.signature}>
          <span className={styles.blockHeadAmber}>{extra.certSignHead}</span>
          <div className={styles.signBox}>
            <span>SHA-256 · {signature}</span>
            <span className={styles.signIssuer}>ISSUED BY MUSE DE MARÉE OCEAN CELLAR</span>
          </div>
        </section>

        {/* ── 액션 ── */}
        <section className={styles.actions}>
          <button type="button" className={styles.saveBtn} onClick={onSave} disabled={saveState === "saving"}>
            {saveState === "saving" ? extra.certSaving : extra.certSave}
          </button>
          <button type="button" className={styles.shareBtn} onClick={onShare}>
            {extra.certShare}
          </button>
          {saveState === "saved" && <p className={styles.saveNote}>{extra.certSaved}</p>}
          <Link href={`/b/${code}/record`} className={styles.backLink}>
            {extra.certBack} →
          </Link>
        </section>

        {/* ── 푸터 ── */}
        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.footerLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.footerSymbol} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.footerWordmark} />
            </div>
            <div className={styles.langSelect}>
              <button
                type="button"
                className={styles.langChip}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-label="Language"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeLocale.flag} alt="" className={styles.langFlag} />
                <span>{activeLocale.short}</span>
                <svg width="7" height="5" viewBox="0 0 7 5" aria-hidden>
                  <polyline points="1,1 3.5,4 6,1" fill="none" stroke="rgba(241,239,235,0.55)" strokeWidth="1" />
                </svg>
              </button>
              {langOpen && (
                <div className={styles.langPanel} role="listbox">
                  {BOTTLE_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      role="option"
                      aria-selected={l.code === locale}
                      className={`${styles.langOpt} ${l.code === locale ? styles.langOptActive : ""}`}
                      onClick={() => {
                        setLocale(l.code);
                        setLangOpen(false);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.flag} alt="" className={styles.langFlag} />
                      <span className={styles.langOptCode}>{l.short}</span>
                      <span className={styles.langOptNative}>{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className={styles.footerTagline}>{copy.footerTagline}</p>
          <div className={styles.footerCols}>
            <a href="https://musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>BRAND</span>
              <span className={styles.footerColRow}>
                <span>{extra.brandPage}</span>
                <span className={styles.footerArrow}>→</span>
              </span>
              <span className={styles.footerColUrl}>musedemaree.com</span>
            </a>
            <a href="https://blog.musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>JOURNAL</span>
              <span className={styles.footerColRow}>
                <span>{extra.blogPage}</span>
                <span className={styles.footerArrow}>→</span>
              </span>
              <span className={styles.footerColUrl}>blog.musedemaree.com</span>
            </a>
          </div>
          <div className={styles.footerBase}>
            <span>© {year} MUSE DE MARÉE</span>
            <span>ORKNEY CORP. · KOREA</span>
          </div>
        </footer>
      </div>

      {/* ── 저장용 인증서 카드 (오프스크린, 고해상 PNG 렌더 대상) ── */}
      <div className={styles.printArea} aria-hidden>
        <div className={styles.printCard} ref={cardRef}>
          <div className={styles.printLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.printSymbol} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_text_trans_W.png" alt="" className={styles.printWordmark} />
          </div>
          <span className={styles.printTag}>{extra.certTag}</span>
          <div className={styles.printBottle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.image} alt="" className={styles.printBottleImg} />
          </div>
          <p className={styles.printDedication}>{extra.certDedication}</p>
          <p className={styles.printOwner}>{ownerName}</p>
          <span className={styles.printRule} aria-hidden />
          <div className={styles.printEdition}>
            <span className={styles.printEdNo}>N°</span>
            <span className={styles.printEdNum}>{serial ?? "—"}</span>
            <span className={styles.printEdTotal}>/ {serialTotal}</span>
          </div>
          <span className={styles.printCertId}>{certId}</span>
        </div>
      </div>
    </main>
  );
}
