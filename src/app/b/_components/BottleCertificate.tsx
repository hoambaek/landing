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
import KeyGlyph from "./KeyGlyph";
import styles from "./certificate.module.css";
import BottleFooter from "./BottleFooter";
import {
  BOTTLE_COPY,
  MAISON_NAME,
  PRODUCT_META,
  RECORD_EXTRA,
  PROVENANCE,
  type BottleLocale,
} from "../_lib/copy";
import type { BottleRecordData, BottleOwner } from "../_lib/data";
import { useSafeAreaTint } from "../_lib/use-safe-area-tint";
import { agingMonths } from "../_lib/duration";

/* 문서명 영문 병기 — 여권처럼 자국어 위 영문을 함께 새긴다. 로케일 불변. */
const CERT_TAG_LATIN = "CERTIFICATE OF OWNERSHIP";

/* 등록 각인 — 문서번호와 같은 성격이라 로케일을 타지 않는다 */
const MONTHS_LATIN = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
function stampDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-");
  const mi = Number(m) - 1;
  if (!y || mi < 0 || mi > 11 || !d) return null;
  return `REGISTERED · ${Number(d)} ${MONTHS_LATIN[mi]} ${y}`;
}

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
  ownerNameLatin,
  certId,
  signature,
  initialLocale = "ko",
}: {
  code: string;
  data: BottleRecordData;
  owner: BottleOwner | null;
  ownerNameFull?: string | null;
  /** 인증서에 새길 로마자 표기. 등록 시 본인이 정한 값만 쓴다 —
      한글에서 기계로 옮기면 표기가 갈려(백 → Baek/Baik/Paek) 남의 이름이 새겨진다.
      없으면 서명체를 포기하고 한글을 Display 목소리로 세운다. */
  ownerNameLatin?: string | null;
  certId: string;
  /** 비밀키 미설정 시 null — 서명 블록을 렌더하지 않는다 */
  signature: string | null;
  initialLocale?: BottleLocale;
}) {
  const [locale, setLocale] = useState<BottleLocale>(initialLocale);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  /* 한 번 열면 다시 잠그지 않는다 — 감출 목적이 아니라 여는 동작을 남기려는 것이다 */
  const [signOpen, setSignOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const copy = BOTTLE_COPY[locale];
  const extra = RECORD_EXTRA[locale];
  /* 위아래가 전부 종이인 화면 — 안전영역도 종이로 잇는다(마크업의 b-paper와 짝) */
  useSafeAreaTint(true);

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
  /* 로마자가 있을 때만 서명체로 간다. 없으면 한글 하나로 세운다. */
  const latin = ownerNameLatin?.trim() || null;
  const registeredStamp = stampDate(owner?.registeredAt);
  /* 등록 전 병 — 이름 자리에 안내 문구가 들어간다. 이름 크기를 그대로 주면
     빈 자리가 채워진 것처럼 읽히므로 눌러서 보여준다. */
  const ownerUnset = !ownerNameFull && !owner?.name;

  const seaWhen = (date: string | null, fallback: number) => {
    const m = monthIdxOf(date, fallback);
    const y = date ? date.slice(0, 4) : year;
    const mo = copy.months[m];
    const se = copy.seasons[seasonOf(m)];
    if (locale === "ko") return `${y}년 ${mo} · ${se}`;
    if (locale === "ja" || locale === "zh") return `${y}年 ${mo} · ${se}`;
    return `${mo} ${y} · ${se}`;
  };

  /* 숙성 기간 — 실제 경과 일수 기준 (duration.ts) */
  const months = agingMonths(data.aging.immersion, data.aging.retrieval);
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
      /* (예정)을 붙이지 않는다 — 이 문서는 인양이 끝나 고객 손에 있는 병에서 열린다.
         배치의 인양일이 미래로 남아 있어도 그건 재고 데이터의 사정이다. */
      value: seaWhen(data.aging.retrieval, retMonth),
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

    if (!photo) return toPng(node, { pixelRatio: RATIO, backgroundColor: "#edeae3" });

    const box = photo.getBoundingClientRect();
    const photoSrc = photo.currentSrc || photo.src;

    photo.style.visibility = "hidden";
    let base: string;
    try {
      base = await toPng(node, { pixelRatio: RATIO, backgroundColor: "#edeae3" });
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


  /* b-paper — 위아래가 전부 종이인 페이지다. 안전영역(상태바)까지 종이로 잇는다(globals.css) */
  return (
    <main className={`${styles.page} b-paper`}>
      <div className={styles.frame}>
        {/* ── 헤더: 심볼 → 문서명 국·영문 병기 ── */}
        <header className={styles.header}>
          <div className={styles.headerLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans.png" alt="Muse de Marée" className={styles.headerSymbol} />
          </div>
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
          {/* 무엇에 대한 증서인지가 도판 alt에만 있었다 — 저장본에서는 그마저 사라진다.
              번호 위에 제품명을 세운다: 무엇인가 → 그중 몇 번째인가 순서다. */}
          <p className={styles.productName}>{meta.name}</p>
          {serial !== null && (
            <div className={styles.edition}>
              <span className={styles.edNo}>N°</span>
              <span className={styles.edNum}>{serial}</span>
              <span className={styles.edTotal}>/ {serialTotal}</span>
            </div>
          )}
        </section>

        {/* ── 선언: 헌정문 + 소유자 ──
            "NFC 인증 완료"는 아래 진위 씰과 같은 말이라 뺐다. */}
        <section className={styles.declaration}>
          <p className={styles.dedication}>{extra.certDedication}</p>
          {latin ? (
            <>
              <p className={styles.ownerScript}>{latin}</p>
              <p className={styles.ownerNative}>{ownerName}</p>
            </>
          ) : (
            <p className={`${styles.ownerName} ${ownerUnset ? styles.ownerNameEmpty : ""}`}>{ownerName}</p>
          )}
          {registeredStamp && <span className={styles.ownerStamp}>{registeredStamp}</span>}
        </section>

        {/* ── 인증: 디지털 서명 + 문서번호 ──
            "NFC 원본 태그와 등록 기록이 일치합니다"라는 씰 문구는 걷어냈다 —
            해시가 이미 그 사실의 증거이고, 문장은 같은 말을 사람 말로 한 번 더 하는 것이었다.
            증명은 주장하지 않고 내보이는 편이 강하다.
            이름 바로 다음에 놓아 "누구의 것인가 → 무엇이 그것을 보증하는가"로 이어진다. */}
        <section className={styles.attest}>
          <span className={styles.attestRule} aria-hidden />

          {/* 해시가 이 문서의 유일한 암호학적 증거다. 각주 크기로 숨기면 주장만 남고
              증거가 사라진다 — 알고리즘은 라벨로 내리고 다이제스트를 주인공으로 올린다. */}
          {/* 서명은 잠가 둔다. 인증서를 남에게 보여주는 자리에서 다이제스트까지 늘 펼쳐
              있을 이유가 없고, 잠긴 것을 여는 동작이 "이 문서에 지켜지는 것이 있다"를
              말보다 잘 전한다. 저장본(printSign)은 별개 블록이라 늘 펼쳐진 채 구워진다 —
              화면을 떠난 문서에서 대조 근거가 사라지면 안 된다. */}
          {signature && (
            <div className={styles.signBox}>
              {signOpen ? (
                <>
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
                </>
              ) : (
                <button
                  type="button"
                  className={styles.signLock}
                  onClick={() => setSignOpen(true)}
                  aria-label={extra.signLocked}
                >
                  <KeyGlyph className={styles.signKey} />
                  <span className={styles.signLockLabel}>{extra.signLocked}</span>
                </button>
              )}
            </div>
          )}

          <div className={styles.certIdRow}>
            <span className={styles.certIdLabel}>{extra.certIdLabel}</span>
            <span className={styles.certIdValue}>{certId}</span>
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
        <BottleFooter
          locale={locale}
          onLocaleChange={setLocale}
          tagline={copy.footerTagline}
          brandPage={extra.brandPage}
          blogPage={extra.blogPage}
          year={year}
        />
      </div>

      {/* ── 저장용 인증서 카드 (오프스크린, 고해상 PNG 렌더 대상) ── */}
      <div className={styles.printArea} aria-hidden>
        {/* 화면과 같은 구성 — 인장 헤더 · 도판 · 캡션 · 선언 */}
        <div className={styles.printCard} ref={cardRef}>
          <div className={styles.printLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo/logo_trans.png" alt="" className={styles.printSymbol} />
          </div>
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
          {/* 저장본은 화면을 떠나 혼자 남는다 — 무엇에 대한 증서인지가 그 안에 있어야 한다 */}
          <p className={styles.printProductName}>{meta.name}</p>
          <div className={styles.printEdition}>
            <span className={styles.printEdNo}>N°</span>
            <span className={styles.printEdNum}>{serial ?? "—"}</span>
            <span className={styles.printEdTotal}>/ {serialTotal}</span>
          </div>
          <p className={styles.printDedication}>{extra.certDedication}</p>
          {latin ? (
            <>
              <p className={styles.printScript}>{latin}</p>
              <p className={styles.printNative}>{ownerName}</p>
            </>
          ) : (
            <p className={`${styles.printOwner} ${ownerUnset ? styles.ownerNameEmpty : ""}`}>{ownerName}</p>
          )}
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
