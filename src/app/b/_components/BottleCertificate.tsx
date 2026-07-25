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
import { persistBottleLocale } from "../_lib/locale";
import type { BottleRecordData, BottleOwner } from "../_lib/data";

/* 문서명 영문 병기 — 여권처럼 자국어 위 영문을 함께 새긴다. 로케일 불변. */
const CERT_TAG_LATIN = "CERTIFICATE OF OWNERSHIP";

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
  initialLocale = "ko",
}: {
  code: string;
  data: BottleRecordData;
  owner: BottleOwner | null;
  ownerNameFull?: string | null;
  certId: string;
  /** 비밀키 미설정 시 null — 서명 블록을 렌더하지 않는다 */
  signature: string | null;
  initialLocale?: BottleLocale;
}) {
  const [locale, setLocale] = useState<BottleLocale>(initialLocale);
  const [langOpen, setLangOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const cardRef = useRef<HTMLDivElement>(null);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
  const activeLocale = BOTTLE_LOCALES.find((l) => l.code === locale)!;
  const meta = PRODUCT_META[data.bottle.productId] ?? PRODUCT_META.atomes_crochus_1y;
  const prov = PROVENANCE[data.bottle.productId];

  /* 라틴 로케일은 문서 제목이 길어 한글과 같은 활자 크기를 쓸 수 없다 */
  const isLatinLocale = locale === "en" || locale === "fr";

  const serial = data.bottle.serial;
  const serialTotal = meta.quantity;
  const immMonth = monthIdxOf(data.aging.immersion, 0);
  const retMonth = monthIdxOf(data.aging.retrieval, 11);
  const year = data.aging.immersion ? data.aging.immersion.slice(0, 4) : String(new Date().getFullYear());

  /* 이름은 등록자가 인증서용으로 정한 값이라 인증 없이도 그대로 쓴다 */
  const ownerName = ownerNameFull ?? owner?.name ?? extra.certOwnerFallback;

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

  /**
   * 저장 카드의 이미지를 미리 PNG data URL로 바꿔 박아둔다.
   *
   * WebKit은 foreignObject 안에서 외부 리소스를 그리다 빠뜨리는 일이 잦다(텍스트·선만 남는다).
   * 라이브러리의 인라인 처리에 맡기지 않고 직접 캔버스로 굽어서 넣으면 그 경로 자체가 사라진다.
   * WebP → PNG로 재인코딩하는 것도 겸한다(WebP는 foreignObject에서 특히 취약).
   * 표시 크기 × 3배로 줄여 구우므로 data URL이 비대해지지 않는다.
   */
  async function bakeImages(node: HTMLElement) {
    await Promise.all(
      Array.from(node.querySelectorAll("img")).map(async (img) => {
        if (img.src.startsWith("data:")) return;
        try {
          /* createImageBitmap은 Safari에서 WebP Blob을 못 여는 경우가 있다.
             (실측: 로고 PNG는 구워지고 병 WebP만 실패해 원본으로 되돌아갔다)
             <img> 디코드는 WebP를 확실히 처리하므로 이 경로만 쓴다. */
          /* next/image의 Image 임포트와 겹쳐 createElement로 만든다 */
          const src = document.createElement("img");
          src.crossOrigin = "anonymous";
          src.src = img.currentSrc || img.src;
          await src.decode();

          const want = Math.ceil((img.clientWidth || src.naturalWidth) * 3);
          const w = Math.min(src.naturalWidth, want) || src.naturalWidth;
          const h = Math.round((src.naturalHeight * w) / src.naturalWidth);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(src, 0, 0, w, h);

          /* 불투명한 사진은 JPEG로 굽는다. PNG base64는 수백 KB가 되는데,
             그만한 data URL이 foreignObject 안에 들어가면 WebKit이 통째로 흘린다.
             (실측: 로고 37KB는 그려지고 병 326KB만 빠졌다) */
          let opaque = true;
          const px = ctx?.getImageData(0, 0, w, h).data;
          if (px) {
            for (let i = 3; i < px.length; i += 4 * 97) {
              if (px[i] < 250) {
                opaque = false;
                break;
              }
            }
          }
          img.src = opaque ? canvas.toDataURL("image/jpeg", 0.92) : canvas.toDataURL("image/png");
          await img.decode().catch(() => undefined);
        } catch {
          /* 실패해도 원본 src 그대로 두고 진행 */
        }
      })
    );
  }

  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const el = document.createElement("img");
      el.onload = () => res(el);
      el.onerror = () => rej(new Error("img-load"));
      el.src = src;
    });

  /**
   * 사진은 foreignObject 밖에서 합성한다.
   *
   * WebKit은 큰 이미지를 foreignObject 안에서 그리다 통째로 흘린다(로고는 나오고 병만 빠졌다).
   * 라이브러리 옵션으로 우회가 안 되므로, 사진을 뺀 판(글자·괘선·프레임)만 toPng로 굽고
   * 그 위에 캔버스 drawImage로 사진을 직접 얹는다. drawImage는 이 문제가 없다.
   */
  async function renderPng(): Promise<string | null> {
    const node = cardRef.current;
    if (!node) return null;

    await bakeImages(node);

    const photo = node.querySelector<HTMLImageElement>("[data-photo]");
    const RATIO = 3;
    const cardBox = node.getBoundingClientRect();

    if (!photo) return toPng(node, { pixelRatio: RATIO, backgroundColor: "#0a0908" });

    const box = photo.getBoundingClientRect();
    const photoSrc = photo.currentSrc || photo.src;

    photo.style.visibility = "hidden";
    let base: string;
    try {
      base = await toPng(node, { pixelRatio: RATIO, backgroundColor: "#0a0908" });
    } finally {
      photo.style.visibility = "";
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cardBox.width * RATIO);
    canvas.height = Math.round(cardBox.height * RATIO);
    const ctx = canvas.getContext("2d");
    if (!ctx) return base;

    ctx.drawImage(await loadImg(base), 0, 0, canvas.width, canvas.height);

    /* object-fit: contain 재현 — 박스 안에서 비율 유지하고 가운데 정렬 */
    const src = await loadImg(photoSrc);
    const scale = Math.min(box.width / src.naturalWidth, box.height / src.naturalHeight);
    const dw = src.naturalWidth * scale;
    const dh = src.naturalHeight * scale;
    const dx = box.left - cardBox.left + (box.width - dw) / 2;
    const dy = box.top - cardBox.top + (box.height - dh) / 2;
    ctx.drawImage(src, dx * RATIO, dy * RATIO, dw * RATIO, dh * RATIO);

    return canvas.toDataURL("image/png");
  }

  /** 다운로드는 iOS에서 사진 앱이 아니라 파일 앱으로 간다.
      사진 보관함까지 가는 경로는 공유 시트뿐이라, 가능하면 그쪽을 쓴다. */
  async function deliver(url: string) {
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], `${certId}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: extra.certShareText, text: extra.certShareText });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${certId}.png`;
    a.click();
  }

  async function onSave() {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      const url = await renderPng();
      if (!url) throw new Error("no-node");
      await deliver(url);
      setSaveState("saved");
    } catch (e) {
      /* 공유 시트에서 사용자가 취소한 것은 실패가 아니다 */
      if ((e as Error)?.name === "AbortError") setSaveState("idle");
      else setSaveState("error");
    }
  }


  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        {/* ── 헤더: 인장(괘선 + 심볼) → 문서명 국·영문 병기 ── */}
        <header className={styles.header}>
          <span className={styles.certRule} aria-hidden />
          <div className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="Muse de Marée" className={styles.headerSymbol} />
          </div>
          <span className={styles.certRule} aria-hidden />
          <h1 className={`${styles.certTag} ${isLatinLocale ? styles.certTagLatin : ""}`}>{extra.certTag}</h1>
          {locale !== "en" && <span className={styles.certTagEn}>{CERT_TAG_LATIN}</span>}
        </header>

        {/* ── 대상: 도판 + 캡션 ── */}
        <section className={styles.plate}>
          <div className={styles.plateFrame}>
            <Image
              src={meta.imagePortrait ?? meta.image}
              alt={meta.name}
              width={138}
              height={256}
              sizes="300px"
              className={styles.bottleImg}
            />
          </div>
          {serial !== null && (
            <div className={styles.edition}>
              <span className={styles.edNo}>N°</span>
              <span className={styles.edNum}>{serial}</span>
              <span className={styles.edTotal}>/ {serialTotal}</span>
            </div>
          )}
        </section>

        {/* ── 선언: 헌정문 + 소유자 ──
            "NFC 인증 완료"는 바로 아래 진위 씰과 같은 말이라 뺐다. */}
        <section className={styles.declaration}>
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
        <section className={`${styles.block} ${styles.blockTight}`}>
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
        <section className={`${styles.block} ${styles.blockTight}`}>
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
        {signature && (
        <section className={styles.signature}>
          <span className={styles.blockHeadAmber}>{extra.certSignHead}</span>
          {/* 해시가 이 문서의 유일한 암호학적 증거다. 각주 크기로 숨기면 주장만 남고
              증거가 사라진다 — 알고리즘은 라벨로 내리고 다이제스트를 주인공으로 올린다. */}
          <div className={styles.signBox}>
            <span className={styles.signAlgo}>
              <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                <path
                  d="M2.4 4.4 V3 a1.6 1.6 0 0 1 3.2 0 V4.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <rect x="1" y="4.4" width="6" height="4.7" rx="0.9" fill="currentColor" />
              </svg>
              {/* 해시 함수 이름만 적으면 비밀키가 들어갔다는 사실이 안 드러난다 —
                  실제보다 약하게 말하는 표기였다 */}
              HMAC-SHA256
            </span>
            <span className={styles.signHash}>{signature}</span>
            <span className={styles.signRule} aria-hidden />
            <span className={styles.signIssuer}>ISSUED BY MUSE DE MARÉE OCEAN CELLAR</span>
          </div>
        </section>
        )}

        {/* ── 액션 ── */}
        <section className={styles.actions}>
          <button
            type="button"
            className={`${styles.saveBtn} ${saveState === "saving" ? styles.saveBtnBusy : ""}`}
            onClick={onSave}
            disabled={saveState === "saving"}
            aria-busy={saveState === "saving"}
          >
            {saveState === "saving" ? extra.certSaving : extra.certSave}
          </button>
          {/* "공유하기"는 삭제했다. 저장과 같은 deliver()를 타서 동작이 완전히 같았다.
              모바일은 공유 시트가 열려 그 안에서 저장·공유를 모두 고를 수 있다. */}
          {saveState === "saved" && <p className={styles.saveNote}>{extra.certSaved}</p>}
          {/* 되돌아가기라 셰브론은 텍스트 왼쪽 — 방향이 곧 의미다 */}
          <Link href={`/b/${code}/record`} className={styles.backLink}>
            <svg className={styles.backArrow} width="5" height="9" viewBox="0 0 5 9" aria-hidden>
              <polyline
                points="4.1,0.9 0.9,4.5 4.1,8.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{extra.certBack}</span>
          </Link>
        </section>

        {/* ── 푸터 ── */}
        <footer className={styles.footer}>
          {/* 브랜드 줄 — 언어 선택은 하단으로 (기록 페이지와 동일 구조) */}
          <div className={styles.footerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.footerSymbol} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_text_trans_W.png" alt="Muse de Marée" className={styles.footerWordmark} />
          </div>

          <p className={styles.footerTagline}>{copy.footerTagline}</p>

          <div className={styles.footerCols}>
            <a href="https://musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>BRAND</span>
              <span className={styles.footerColRow}>
                <span>{extra.brandPage}</span>
                <svg className={styles.footerArrow} width="5" height="9" viewBox="0 0 5 9" aria-hidden>
                  <polyline
                    points="0.9,0.9 4.1,4.5 0.9,8.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
            <a href="https://blog.musedemaree.com" className={styles.footerCol}>
              <span className={styles.footerColHead}>JOURNAL</span>
              <span className={styles.footerColRow}>
                <span>{extra.blogPage}</span>
                <svg className={styles.footerArrow} width="5" height="9" viewBox="0 0 5 9" aria-hidden>
                  <polyline
                    points="0.9,0.9 4.1,4.5 0.9,8.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          <div className={styles.footerBase}>
            <div className={styles.footerLegal}>
              <span>© {year} MUSE DE MARÉE</span>
              <span>ORKNEY CORP. · KOREA</span>
            </div>

            <div className={styles.langSelect}>
              <button
                type="button"
                className={styles.langChip}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-label="Language"
              >
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
                        persistBottleLocale(l.code);
                        setLangOpen(false);
                      }}
                    >
                      <span className={styles.langOptCode}>{l.short}</span>
                      <span className={styles.langOptNative}>{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* ── 저장용 인증서 카드 (오프스크린, 고해상 PNG 렌더 대상) ── */}
      <div className={styles.printArea} aria-hidden>
        {/* 화면과 같은 구성 — 인장 헤더 · 도판 · 캡션 · 선언 */}
        <div className={styles.printCard} ref={cardRef}>
          <span className={styles.printRule} aria-hidden />
          <div className={styles.printLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans_W_lg.png" alt="" className={styles.printSymbol} />
          </div>
          <span className={styles.printRule} aria-hidden />
          <span className={styles.printTag}>{extra.certTag}</span>
          {locale !== "en" && <span className={styles.printTagEn}>{CERT_TAG_LATIN}</span>}
          <div className={styles.printPlate}>
            {/* data-photo — renderPng가 이 이미지만 캔버스로 따로 합성한다 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.imagePortrait ?? meta.image}
              alt=""
              data-photo
              className={styles.printBottleImg}
            />
          </div>
          <div className={styles.printEdition}>
            <span className={styles.printEdNo}>N°</span>
            <span className={styles.printEdNum}>{serial ?? "—"}</span>
            <span className={styles.printEdTotal}>/ {serialTotal}</span>
          </div>
          <p className={styles.printDedication}>{extra.certDedication}</p>
          <p className={styles.printOwner}>{ownerName}</p>
          <span className={styles.printRuleWide} aria-hidden />
          <span className={styles.printCertId}>{certId}</span>
          {/* 저장본은 화면을 떠나 혼자 남는다. 문서번호만 있고 서명이 없으면
              대조할 근거가 사라진다 — 발행자만 만들 수 있는 값을 같이 굽는다. */}
          {signature && (
            <span className={styles.printSign}>
              <svg width="7" height="9" viewBox="0 0 8 10" aria-hidden>
                <path d="M2.4 4.4 V3 a1.6 1.6 0 0 1 3.2 0 V4.4" fill="none" stroke="currentColor" strokeWidth="0.9" />
                <rect x="1" y="4.4" width="6" height="4.7" rx="0.9" fill="currentColor" />
              </svg>
              {signature}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
