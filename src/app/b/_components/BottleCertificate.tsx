"use client";

/**
 * /b 디지털 인증서 (Paper "04 — 디지털 인증서" · "04A — 인증서 저장").
 *
 * 어두운 바탕 위 아이보리 증서 한 장(CertificateCard) → 인증서 저장 → 원산지·해저 숙성 기록 →
 * 바다 기록으로 돌아가는 링크. 공유 버튼은 두지 않는다(저장 시트가 OS 공유 시트를 연다).
 *
 * 저장 PNG는 화면의 카드와 같은 컴포넌트를 한 번 더 세워 굽는다 — 저장본을 따로 조판하면
 * 보여준 것과 저장된 것이 갈린다(예전 .printCard가 그랬다). 굽는 틀은 폰 화면 비율
 * 1170×2532(390×844 @3x)의 종이(#F2EFE8)이고, 카드는 위 54 · 아래 26 여백 안에 앉는다 —
 * 폰의 둥근 모서리·상태바가 금빛 테를 자르지 않는 자리다.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import styles from "./certificate.module.css";
import ui from "./ui.module.css";
import CertificateCard from "./CertificateCard";
import {
  BOTTLE_COPY,
  MAISON_NAME,
  PRODUCT_META,
  RECORD_EXTRA,
  PROVENANCE,
  type BottleLocale,
} from "../_lib/copy";
import type { BottleRecordData } from "../_lib/data";
import type { CertCardData } from "../_lib/cert-card";
import { useSafeAreaTint } from "../_lib/use-safe-area-tint";

/* 저장 틀 — 폰 화면 한 장(390×844 CSS px → @3x 1170×2532) */
const EXPORT_W = 390;
const EXPORT_H = 844;
const EXPORT_RATIO = 3;
const EXPORT_PAPER = "#F2EFE8";
/* 카드가 앉을 수 있는 최대 높이 — 위 54 · 아래 26을 뺀 자리 */
const EXPORT_CARD_MAX_H = EXPORT_H - 54 - 26;

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

interface Row {
  label: string;
  value: string;
  /** 값이 라틴(고유명사·수치)이면 브랜드 라틴 활자로 — 시안이 행마다 갈라 쓴다 */
  latin?: boolean;
}

export default function BottleCertificate({
  code,
  data,
  card,
  initialLocale = "ko",
}: {
  code: string;
  data: BottleRecordData;
  card: CertCardData;
  initialLocale?: BottleLocale;
}) {
  /* 언어 선택기는 이 화면에 없다(시안 04). /b 공통 쿠키로 앞 화면의 선택을 따른다 */
  const locale = initialLocale;
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">("idle");
  /* 저장 시트(04A). 굽은 PNG를 그대로 미리보기로 쓴다 — 보여준 것과 저장된 것이 같은 파일이다 */
  const [saveOpen, setSaveOpen] = useState(false);
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const saveDialogRef = useRef<HTMLDialogElement>(null);

  /* top layer·포커스 트랩·Esc·배경 inert는 showModal()로만 켜진다.
     open 속성을 React가 그리게 두면 그냥 블록 요소가 되고 그 넷이 전부 빠진다. */
  useEffect(() => {
    const dlg = saveDialogRef.current;
    if (!dlg) return;
    if (saveOpen && !dlg.open) dlg.showModal();
    else if (!saveOpen && dlg.open) dlg.close();
  }, [saveOpen]);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
  /* 위아래가 전부 검정인 화면 — 안전영역도 void로 잇는다 */
  useSafeAreaTint(false);

  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const prov = PROVENANCE[data.bottle.productId];
  const scriptClass = locale === "ja" ? styles.pageJa : locale === "zh" ? styles.pageZh : "";
  const serial = data.bottle.serial;

  const seaWhen = (date: string | null, fallback: number) => {
    const m = monthIdxOf(date, fallback);
    const y = date ? date.slice(0, 4) : card.year ?? "";
    const mo = copy.months[m];
    const se = copy.seasons[seasonOf(m)];
    if (locale === "ko") return `${y}년 ${mo} · ${se}`;
    if (locale === "ja" || locale === "zh") return `${y}年 ${mo} · ${se}`;
    return `${mo} ${y} · ${se}`;
  };

  /* 원산지 — 시안 04 순서(메종 · 지역 · 품종 · 숙성 · 스타일) */
  const provRows: Row[] = prov
    ? [
        { label: extra.provLabels.maison, value: prov.maison, latin: true },
        { label: extra.provLabels.region, value: prov.region, latin: true },
        { label: extra.provLabels.cepage, value: prov.cepage, latin: true },
        { label: extra.provLabels.elevage, value: prov.elevage[locale], latin: locale === "en" || locale === "fr" },
        { label: extra.provLabels.style, value: prov.style, latin: true },
      ]
    : [
        { label: extra.provLabels.maison, value: `Champagne ${MAISON_NAME}`, latin: true },
        ...(meta.cepage ? [{ label: extra.provLabels.cepage, value: meta.cepage, latin: true }] : []),
        ...(meta.style ? [{ label: extra.provLabels.style, value: meta.style, latin: true }] : []),
      ];

  /* 해저 숙성 — 시안 04 순서(입수 · 인양 · 수심 · 위치). 기간은 증명문이 말한다. */
  const seaRows: Row[] = [
    { label: extra.seaLabels.immersion, value: seaWhen(data.aging.immersion, 0) },
    {
      label: extra.seaLabels.retrieval,
      /* (예정)을 붙이지 않는다 — 기존 결정(인증서는 인양이 끝나 고객 손에 있는 병에서 열린다).
         다만 카드의 증명문은 인양이 실제로 끝났을 때만 「인양되었음」을 쓴다(cert-text.ts). */
      value: seaWhen(data.aging.retrieval, 11),
    },
    { label: extra.seaLabels.depth, value: `${data.aging.depth} m`, latin: true },
    { label: extra.seaLabels.location, value: `${extra.wando} · 34°N 126°E` },
  ];

  /**
   * 틀 안 이미지를 미리 data URL로 구워 박아둔다.
   * WebKit은 foreignObject 안에서 외부 리소스를 그리다 빠뜨리는 일이 잦다(텍스트·선만 남는다).
   * 카드의 이미지는 심볼 로고 하나뿐이라 작다 — PNG 그대로 굽는다.
   */
  async function bakeImages(node: HTMLElement) {
    await Promise.all(
      Array.from(node.querySelectorAll("img")).map(async (img) => {
        if (img.src.startsWith("data:")) return;
        try {
          const src = document.createElement("img");
          src.crossOrigin = "anonymous";
          src.src = img.currentSrc || img.src;
          await src.decode();
          const w = Math.min(src.naturalWidth, Math.ceil((img.clientWidth || src.naturalWidth) * EXPORT_RATIO));
          const h = Math.round((src.naturalHeight * w) / src.naturalWidth);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d")?.drawImage(src, 0, 0, w, h);
          img.src = canvas.toDataURL("image/png");
          await img.decode().catch(() => undefined);
        } catch {
          /* 실패해도 원본 src 그대로 두고 진행 */
        }
      }),
    );
  }

  async function renderPng(): Promise<string | null> {
    const frame = exportRef.current;
    const cardEl = exportCardRef.current;
    if (!frame || !cardEl) return null;
    /* 카드가 자리보다 길면(긴 이름·라틴 증명문) 통째로 줄여 앉힌다 — 테가 잘리는 것보다 낫다 */
    cardEl.style.zoom = "";
    const h = cardEl.getBoundingClientRect().height;
    if (h > EXPORT_CARD_MAX_H) cardEl.style.zoom = String(EXPORT_CARD_MAX_H / h);
    await document.fonts?.ready;
    await bakeImages(frame);
    return toPng(frame, {
      pixelRatio: EXPORT_RATIO,
      width: EXPORT_W,
      height: EXPORT_H,
      backgroundColor: EXPORT_PAPER,
    });
  }

  /** 다운로드는 iOS에서 사진 앱이 아니라 파일 앱으로 간다.
      사진 보관함까지 가는 경로는 공유 시트뿐이라, 가능하면 그쪽을 쓴다. */
  async function deliver(url: string) {
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], `${card.certId}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: extra.certShareText });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.certId}.png`;
    a.click();
  }

  async function bakePng(): Promise<string | null> {
    setSaveState("saving");
    try {
      const url = await renderPng();
      if (!url) throw new Error("no-node");
      setPngUrl(url);
      setSaveState("idle");
      return url;
    } catch {
      setSaveState("error");
      return null;
    }
  }

  /**
   * 시트를 열면서 바로 굽는다.
   * iOS Safari는 파일 공유 시트를 사용자 제스처 안에서만 연다. 렌더를 버튼 클릭 뒤로 미루면
   * 그 사이에 제스처가 만료돼 share()가 거부될 수 있다 — 여는 순간 구워두면 실행 버튼의
   * 클릭은 deliver() 하나만 태운다.
   */
  async function openSave() {
    setPngUrl(null);
    setSaveOpen(true);
    await bakePng();
  }

  async function onSaveAction() {
    if (saveState === "saving") return;
    /* 굽기가 실패했던 자리에서 다시 누르면 여기서 한 번 더 굽는다 */
    const url = pngUrl ?? (await bakePng());
    if (!url) return;
    setSaveState("saving");
    try {
      await deliver(url);
      /* 저장이 끝나면 시트를 닫는다 — OS가 자체 피드백을 준다(별도 결과 화면 없음) */
      setSaveState("idle");
      setSaveOpen(false);
    } catch (e) {
      /* 공유 시트에서 사용자가 취소한 것은 실패가 아니다 */
      if ((e as Error)?.name === "AbortError") setSaveState("idle");
      else setSaveState("error");
    }
  }

  const backLabel = serial !== null ? extra.certBack.replace("{serial}", String(serial)) : extra.certBackNoSerial;

  const renderRows = (rows: Row[], key: string) =>
    rows.map((r, i) => (
      <div key={`${key}-${i}`} className={styles.row}>
        <span className={styles.rowLabel}>{r.label}</span>
        <span className={`${styles.rowValue} ${r.latin ? styles.rowValueLatin : ""}`}>{r.value}</span>
      </div>
    ));

  return (
    <main className={`${styles.page} ${scriptClass}`}>
      <div className={styles.frame}>
        {/* ── 증서 ── */}
        <div className={styles.cardStage}>
          <CertificateCard card={card} locale={locale} elevated />
        </div>

        {/* ── 저장 — 곧바로 굽지 않고 저장 시트(04A)를 먼저 연다 ── */}
        <section className={styles.actions}>
          <button type="button" className={ui.secondaryD} onClick={openSave}>
            <span>{extra.certSave}</span>
            <span className={ui.chev} aria-hidden>›</span>
          </button>
          <p className={styles.saveHint}>{extra.certSaveHint}</p>
        </section>

        {/* ── 원산지 ── */}
        <section className={styles.block}>
          <h2 className={styles.blockHead}>{extra.provHead}</h2>
          <div className={styles.rows}>{renderRows(provRows, "p")}</div>
        </section>

        {/* ── 해저 숙성 ── */}
        <section className={`${styles.block} ${styles.blockSea}`}>
          <h2 className={styles.blockHead}>{extra.seaHead}</h2>
          <div className={styles.rows}>{renderRows(seaRows, "s")}</div>
        </section>

        {/* ── 되돌아가기 — 방향이 곧 의미라 ‹가 앞에 선다 ── */}
        <div className={styles.back}>
          <Link href={`/b/${code}/record`} className={ui.linkD}>
            ‹ {backLabel}
          </Link>
        </div>
      </div>

      {/* ── 저장 틀 (오프스크린) — 화면과 같은 카드 컴포넌트를 폰 화면 한 장에 앉힌다 ── */}
      <div className={styles.exportArea} aria-hidden inert>
        <div ref={exportRef} className={styles.exportFrame}>
          <div ref={exportCardRef}>
            <CertificateCard card={card} locale={locale} />
          </div>
        </div>
      </div>

      {/* ── 저장 시트 (04A) ── */}
      <dialog
        ref={saveDialogRef}
        className={styles.saveDialog}
        aria-labelledby="cert-save-title"
        onClose={() => setSaveOpen(false)}
      >
        <div className={styles.saveSheet}>
          <header className={styles.saveHeader}>
            <h2 id="cert-save-title" className={styles.saveTitle}>
              {extra.certSave}
            </h2>
            <button
              type="button"
              className={styles.saveClose}
              onClick={() => setSaveOpen(false)}
              aria-label={extra.certSaveClose}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M2 2 L14 14 M14 2 L2 14" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </header>

          {/* 미리보기는 굽은 결과물 그 자체다 */}
          <div className={styles.savePreview}>
            {pngUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={pngUrl} alt="" className={styles.savePreviewImg} />
            ) : (
              <div className={styles.savePreviewWait} />
            )}
          </div>

          <div className={styles.saveFoot}>
            {/* 실패는 이 자리에서 말한다 — 별도 결과 화면이 없으므로 */}
            <p className={`${styles.saveCaption} ${saveState === "error" ? styles.saveCaptionError : ""}`} role="status">
              {saveState === "error" ? extra.ownErrGeneric : extra.certSaveCaption}
            </p>
            <button
              type="button"
              className={`${ui.primaryD} ${saveState === "saving" ? styles.saveBusy : ""}`}
              onClick={onSaveAction}
              disabled={saveState === "saving"}
              aria-busy={saveState === "saving"}
            >
              <span>{saveState === "saving" ? extra.certSaving : extra.certSaveAction}</span>
              {saveState !== "saving" && (
                <span className={ui.chev} aria-hidden>›</span>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
